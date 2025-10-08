using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UseItApi.Data;
using UseItApi.Models;
using UseItApi.Services;

namespace UseItApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public partial class ReservationController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public ReservationController(AppDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest req)
    {
        if (req == null || req.ToolId == Guid.Empty)
            return BadRequest("Invalid reservation data");

        // Allow same-day reservations; only invalid if end is before start
        if (req.EndDate < req.StartDate)
            return BadRequest("End date must be on or after start date");

        var renterIdStr = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(renterIdStr)) return Unauthorized();
        if (!Guid.TryParse(renterIdStr, out var renterId)) return Unauthorized();

        var tool = _context.Tools.Find(req.ToolId);
        if (tool == null) return NotFound("Tool not found");
        if (tool.OwnerId == renterId) return Forbid();

        var renter = _context.Users.Find(renterId);
        if (renter == null) return Unauthorized();

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
        await _context.SaveChangesAsync();

        var owner = _context.Users.Find(tool.OwnerId);
        if (owner != null)
        {
            try
            {
                await _emailService.SendReservationCreatedAsync(owner, tool, reservation, renter);
            }
            catch
            {
                // Ignore failures so the reservation still succeeds; logging can be added later.
            }
        }

        return Created($"api/reservation/{reservation.Id}", reservation);
    }

    // Return active/pending reservations (date ranges) for a given tool
    [HttpGet("tool/{toolId}")]
    public IActionResult GetReservationsForTool(Guid toolId)
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
        var renterIdStr = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(renterIdStr) || !Guid.TryParse(renterIdStr, out var renterGuid)) return Unauthorized();

        var result = _context.Reservations
            .Where(r => r.RenterId == renterGuid)
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
                    Tool = new
                    {
                        t.Id,
                        t.Name,
                        t.ImageUrl,
                        t.Price,
                        t.Area,
                        t.Deposit,
                        t.Brand,
                        t.Model
                    }
                })
            .OrderByDescending(r => r.StartDate)
            .ToList();

        return Ok(result);
    }

    // Owner updates a pending reservation's status (Active | Cancelled)
    [Authorize]
    [HttpPost("{id}/status")]
    public IActionResult UpdateStatus(Guid id, [FromBody] string status)
    {
        var ownerIdStr = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(ownerIdStr) || !Guid.TryParse(ownerIdStr, out var ownerId)) return Unauthorized();
        if (string.IsNullOrWhiteSpace(status))
            return BadRequest("Status is required");
        if (!Enum.TryParse<ReservationStatus>(status, true, out var desired))
            return BadRequest("Status must be 'Active' or 'Cancelled'");

        var reservation = _context.Reservations.Find(id);
        if (reservation == null) return NotFound();
        var tool = _context.Tools.Find(reservation.ToolId);
        if (tool == null) return NotFound("Tool not found");
        if (tool.OwnerId != ownerId) return Forbid();
        if (!string.Equals(reservation.Status, nameof(ReservationStatus.Pending), StringComparison.OrdinalIgnoreCase))
            return BadRequest("Only pending reservations can be updated");

        reservation.Status = desired.ToString();
        _context.SaveChanges();
        return Ok(reservation);
    }
}
