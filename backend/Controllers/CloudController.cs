using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class CloudController : ControllerBase
{
    private readonly CloudinaryService _cloudinaryService;

    public CloudController(CloudinaryService cloudinaryService)
    {
        _cloudinaryService = cloudinaryService;
    }

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "File không hợp lệ!" }); // JSON hợp lệ

        var imageUrl = await _cloudinaryService.UploadImageAsync(file);
        if (imageUrl == null)
            return BadRequest(new { error = "Không thể upload ảnh!" }); // JSON hợp lệ

        return Ok(new { ImageUrl = imageUrl });
    }
}
