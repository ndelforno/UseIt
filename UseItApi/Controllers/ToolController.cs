using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UseItApi.Data;
namespace UseItApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToolController : ControllerBase
{
    private readonly AppDbContext _context;

    public ToolController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAllTools()
    {
        var tools = _context.Tools.ToList();
        return Ok(tools);
    }

    [Authorize]
    [HttpGet("myTools")]
    public IActionResult GetMyTools()
    {
        var userIdStr = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

        var tools = _context.Tools
            .Where(t => t.OwnerId == userId)
            .Select(t => new Dto.MyToolDto
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                Category = t.Category,
                ImageUrl = t.ImageUrl,
                Price = t.Price,
                PostalCode = t.PostalCode,
                Area = t.Area,
                Deposit = t.Deposit,
                Brand = t.Brand,
                Model = t.Model,
                IsAvailable = t.IsAvailable,
                PendingCount = _context.Reservations.Count(r =>
                    r.ToolId == t.Id && r.Status == nameof(UseItApi.Data.ReservationStatus.Pending))
            })
            .ToList();

        return Ok(tools);
    }

    [HttpGet("{id}")]
    public IActionResult GetToolById(Guid id)
    {
        var tool = _context.Tools.Find(id);
        if (tool == null)
        {
            return NotFound();
        }
        return Ok(tool);
    }

    [Authorize]
    [HttpPost("createTool")]
    public IActionResult CreateTool([FromBody] Tool tool)
    {

        if (tool == null)
        {
            return BadRequest();
        }

        var userIdStr = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId)) return Unauthorized();
        tool.OwnerId = userId;

        _context.Tools.Add(tool);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetToolById), new { id = tool.Id }, tool);
    }

    [Authorize]
    [HttpPut("{id}")]
    public IActionResult UpdateTool(Guid id, [FromBody] Tool tool)
    {
        if (tool == null || tool.Id != id)
        {
            return BadRequest();
        }

        var existingTool = _context.Tools.Find(id);
        if (existingTool == null)
        {
            return NotFound();
        }

        var userIdStr = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId) || existingTool.OwnerId != userId)
        {
            return Forbid();
        }

        existingTool.Name = tool.Name;
        existingTool.Description = tool.Description;
        existingTool.IsAvailable = tool.IsAvailable;
        existingTool.Category = tool.Category;
        existingTool.ImageUrl = tool.ImageUrl;
        existingTool.Price = tool.Price;
        existingTool.PostalCode = tool.PostalCode;
        existingTool.Area = tool.Area;
        existingTool.Deposit = tool.Deposit;
        existingTool.Brand = tool.Brand;
        existingTool.Model = tool.Model;

        _context.SaveChanges();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult DeleteTool(Guid id)
    {
        var tool = _context.Tools.Find(id);
        if (tool == null)
        {
            return NotFound();
        }

        var userIdStr = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId) || tool.OwnerId != userId)
        {
            return Forbid();
        }

        // Delete associated image file if it exists under wwwroot/images
        var imageUrl = tool.ImageUrl ?? string.Empty;
        if (!string.IsNullOrWhiteSpace(imageUrl))
        {
            var normalized = imageUrl.Replace("\\", "/");
            if (normalized.StartsWith("/images/", StringComparison.OrdinalIgnoreCase))
            {
                var localPath = Path.Combine("wwwroot", normalized.TrimStart('/'));
                if (System.IO.File.Exists(localPath))
                {
                    try { System.IO.File.Delete(localPath); } catch { }
                }
            }
        }

        _context.Tools.Remove(tool);
        _context.SaveChanges();

        return NoContent();
    }
}
