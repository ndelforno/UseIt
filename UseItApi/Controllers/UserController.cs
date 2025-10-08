using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UseItApi.Data;
using UseItApi.Dto;
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
        var users = _context.Users
            .AsEnumerable()
            .Select(UserProfileDto.FromEntity)
            .ToList();
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

        var userEntity = _context.Users.FirstOrDefault(u => u.Id == userId);
        if (userEntity == null)
        {
            return NotFound();
        }

        var user = UserProfileDto.FromEntity(userEntity);

        return Ok(user);
    }

    [Authorize]
    [HttpPut("me")]
    public IActionResult UpdateCurrentUser([FromBody] UpdateUserProfileRequest request)
    {
        if (request == null)
        {
            return BadRequest("Invalid profile data");
        }
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

        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        user.Phone = request.Phone.Trim();
        user.Address = request.Address.Trim();
        user.City = request.City.Trim();
        user.ProfilePictureUrl = string.IsNullOrWhiteSpace(request.ProfilePictureUrl) ? null : request.ProfilePictureUrl;
        user.UserName = UserProfileDto.GetDisplayName(user);

        _context.SaveChanges();
        return Ok(UserProfileDto.FromEntity(user));
    }
}
