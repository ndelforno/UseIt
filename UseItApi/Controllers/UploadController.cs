using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UseItApi.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{

    [Authorize]
    [HttpPost("uploadImage")]
    public async Task<IActionResult> UploadToolImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File not selected");

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var path = Path.Combine("wwwroot/images", fileName);

        using (var stream = new FileStream(path, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"/images/{fileName}";
        return Ok(new { imageUrl });
    }
}