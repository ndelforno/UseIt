using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UseItApi.Data;
using UseItApi.Models;

namespace UseItApi.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAllUsers()
    {
        var users = _context.Users.ToList();
        return Ok(users);
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var userIdClaim = User.FindFirst("UserId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            return Unauthorized();
        }

        var user = _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new { u.Id, u.Email, u.Name }) // Return only safe fields
            .FirstOrDefault();

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [Authorize]
    [HttpPut("me")]
    public IActionResult UpdateCurrentUser([FromBody] User updatedUser)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            return Unauthorized();
        }

        var user = _context.Users.Find(userId);
        if (user == null)
        {
            return NotFound();
        }

        user.Name = updatedUser.Name;
        user.City = updatedUser.City;
        user.ProfilePictureUrl = updatedUser.ProfilePictureUrl;

        _context.SaveChanges();
        return Ok(user);
    }
}
