using Microsoft.AspNetCore.Mvc;
using UseItApi.Data;
using UseItApi.Models;

namespace UseItApi.Controllers;

[ApiController]
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

    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var user = _context.Users.Find(userId);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }


    [HttpPut("me")]
    public IActionResult UpdateCurrentUser([FromBody] User updatedUser)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
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