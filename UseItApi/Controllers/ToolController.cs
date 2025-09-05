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
        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        var tools = _context.Tools.Where(t => t.Owner == userId).ToList();
        return Ok(tools);
    }

    [HttpGet("{id}")]
    public IActionResult GetToolById(int id)
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

        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        tool.Owner = userId;

        _context.Tools.Add(tool);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetToolById), new { id = tool.Id }, tool);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateTool(int id, [FromBody] Tool tool)
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

        existingTool.Name = tool.Name;
        existingTool.Description = tool.Description;
        existingTool.IsAvailable = tool.IsAvailable;

        _context.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteTool(int id)
    {
        var tool = _context.Tools.Find(id);
        if (tool == null)
        {
            return NotFound();
        }

        _context.Tools.Remove(tool);
        _context.SaveChanges();

        return NoContent();
    }
}
