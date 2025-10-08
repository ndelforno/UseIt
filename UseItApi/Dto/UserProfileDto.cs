using System.Linq;
using UseItApi.Models;

namespace UseItApi.Dto;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public bool IsProfileComplete { get; set; }

    public static UserProfileDto FromEntity(User user)
    {
        return new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Phone = user.Phone,
            Address = user.Address,
            City = user.City,
            ProfilePictureUrl = user.ProfilePictureUrl,
            UserName = user.UserName,
            DisplayName = GetDisplayName(user),
            IsProfileComplete = IsComplete(user)
        };
    }

    public static string GetDisplayName(User user)
    {
        var full = string.Join(" ", new[] { user.FirstName, user.LastName }.Where(s => !string.IsNullOrWhiteSpace(s))).Trim();
        if (!string.IsNullOrWhiteSpace(full)) return full;
        return string.IsNullOrWhiteSpace(user.UserName) ? user.Email : user.UserName;
    }

    public static bool IsComplete(User user)
    {
        return !string.IsNullOrWhiteSpace(user.FirstName)
            && !string.IsNullOrWhiteSpace(user.LastName)
            && !string.IsNullOrWhiteSpace(user.Phone)
            && !string.IsNullOrWhiteSpace(user.Address);
    }
}
