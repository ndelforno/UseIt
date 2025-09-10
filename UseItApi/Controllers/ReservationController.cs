using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UseItApi.Data;

namespace UseItApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public partial class ReservationController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReservationController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost]
    public IActionResult Create([FromBody] CreateReservationRequest req)
    {
        if (req == null || req.ToolId <= 0)
            return BadRequest("Invalid reservation data");

        // Allow same-day reservations; only invalid if end is before start
        if (req.EndDate < req.StartDate)
            return BadRequest("End date must be on or after start date");

        var renterId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(renterId)) return Unauthorized();

        var tool = _context.Tools.Find(req.ToolId);
        if (tool == null) return NotFound("Tool not found");
        if (tool.Owner == renterId) return Forbid();

        // Inclusive overlap check: conflicts if ranges intersect at any date.
        // Consider both Active and Pending reservations as blocking.
        var overlaps = _context.Reservations.Any(r => r.ToolId == req.ToolId && (r.Status == nameof(ReservationStatus.Active) || r.Status == nameof(ReservationStatus.Pending)) &&
            !(req.EndDate < r.StartDate || req.StartDate > r.EndDate));
        if (overlaps) return Conflict("Tool is already reserved for those dates");

        var reservation = new Reservation
        {
            ToolId = req.ToolId,
            RenterId = renterId,
            StartDate = req.StartDate,
            EndDate = req.EndDate,
            Status = nameof(ReservationStatus.Pending)
        };

        _context.Reservations.Add(reservation);
        _context.SaveChanges();

        return Created($"api/reservation/{reservation.Id}", reservation);
    }

    // Return active/pending reservations (date ranges) for a given tool
    [HttpGet("tool/{toolId}")]
    public IActionResult GetReservationsForTool(int toolId)
    {
        var tool = _context.Tools.Find(toolId);
        if (tool == null) return NotFound("Tool not found");

        var reservations = _context.Reservations
            .Where(r => r.ToolId == toolId && (r.Status == nameof(ReservationStatus.Active) || r.Status == nameof(ReservationStatus.Pending)))
            .Select(r => new { r.Id, r.ToolId, r.StartDate, r.EndDate, r.Status })
            .OrderBy(r => r.StartDate)
            .ToList();

        return Ok(reservations);
    }

    [Authorize]
    [HttpGet("my")]
    public IActionResult MyReservations()
    {
        var renterId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(renterId)) return Unauthorized();

        var result = _context.Reservations
            .Where(r => r.RenterId == renterId)
            .Join(_context.Tools,
                r => r.ToolId,
                t => t.Id,
                (r, t) => new
                {
                    r.Id,
                    r.ToolId,
                    r.StartDate,
                    r.EndDate,
                    r.Status,
                    Tool = new { t.Id, t.Name, t.ImageUrl, t.Price, t.Area }
                })
            .OrderByDescending(r => r.StartDate)
            .ToList();

        return Ok(result);
    }

    // Owner updates a pending reservation's status (Active | Cancelled)
    [Authorize]
    [HttpPost("{id}/status")]
    public IActionResult UpdateStatus(int id, [FromBody] string status)
    {
        var ownerId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(ownerId)) return Unauthorized();
        if (string.IsNullOrWhiteSpace(status))
            return BadRequest("Status is required");
        if (!Enum.TryParse<ReservationStatus>(status, true, out var desired))
            return BadRequest("Status must be 'Active' or 'Cancelled'");

        var reservation = _context.Reservations.Find(id);
        if (reservation == null) return NotFound();
        var tool = _context.Tools.Find(reservation.ToolId);
        if (tool == null) return NotFound("Tool not found");
        if (tool.Owner != ownerId) return Forbid();
        if (!string.Equals(reservation.Status, nameof(ReservationStatus.Pending), StringComparison.OrdinalIgnoreCase))
            return BadRequest("Only pending reservations can be updated");

        reservation.Status = desired.ToString();
        _context.SaveChanges();
        return Ok(reservation);
    }
}
