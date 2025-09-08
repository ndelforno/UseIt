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

        if (req.EndDate <= req.StartDate)
            return BadRequest("End date must be after start date");

        var renterId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(renterId)) return Unauthorized();

        var tool = _context.Tools.Find(req.ToolId);
        if (tool == null) return NotFound("Tool not found");
        if (tool.Owner == renterId) return Forbid();

        var overlaps = _context.Reservations.Any(r => r.ToolId == req.ToolId && r.Status == "Active" &&
            !(req.EndDate <= r.StartDate || req.StartDate >= r.EndDate));
        if (overlaps) return Conflict("Tool is already reserved for those dates");

        var reservation = new Reservation
        {
            ToolId = req.ToolId,
            RenterId = renterId,
            StartDate = req.StartDate,
            EndDate = req.EndDate,
            Status = "Active"
        };

        _context.Reservations.Add(reservation);
        tool.IsAvailable = false;
        _context.SaveChanges();

        return Created($"api/reservation/{reservation.Id}", reservation);
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
}
