using System.Security.Claims;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/video")]
[ApiController]
public class VideoController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserData _userData;
    private readonly VideoData _videoData;
    private readonly CloudinaryService _cloudinaryService;
    private readonly ILogger<VideoController> _logger;

    public VideoController(
        ApplicationDbContext context,
        UserData userData,
        VideoData videoData,
        CloudinaryService cloudinaryService,
        ILogger<VideoController> logger
    )
    {
        _context = context;
        _userData = userData;
        _videoData = videoData;
        _cloudinaryService = cloudinaryService;
        _logger = logger;
    }

    [HttpGet("@{uid}")]
    public async Task<IActionResult> GetListVideo(string uid)
    {
        if (string.IsNullOrEmpty(uid))
        {
            return BadRequest(new { message = "Uid không hợp lệ." });
        }

        var user = await _userData.GetUserByUserIdAsync(uid);

        if (user == null)
        {
            return NotFound(new { message = "Người dùng không tồn tại." });
        }

        var videos = await _videoData.GetVideosByUIdAsync(user.Id);

        var videoList = videos.Select(video => new
        {
            id = video.Id,
            userId = video.UserId,
            description = video.Description,
            videoUrl = video.VideoUrl,
            thumbnailUrl = video.ThumbnailUrl,
            visibility = video.Visibility,
            createdAt = video.CreatedAt,
            updatedAt = video.UpdatedAt,
            deletedAt = video.DeletedAt,
            totalLikes = video.TotalLikes,
            totalShares = video.TotalShares,
            totalComments = video.TotalComments,
            totalSaves = video.TotalSaves,
            totalViews = video.TotalViews,
            address = video.Address,
        });

        return Ok(new { videos = videoList });
    }

    [HttpPost("upload-video")]
    public async Task<IActionResult> UploadVideo(
        [FromForm] IFormFile video,
        [FromForm] IFormFile thumbnail,
        [FromForm] string description,
        [FromForm] string visibility,
        [FromForm] string location,
        [FromForm] string userid
    )
    {
        _logger.LogInformation("call");
        if (video == null || video.Length == 0)
        {
            _logger.LogWarning("Không có video nào được gửi lên.");
            return BadRequest("Không có video được gửi lên.");
        }

        //var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        //if (userIdClaim == null)
        //{
        //    _logger.LogWarning("Người dùng chưa đăng nhập hoặc token không hợp lệ.");
        //    return Unauthorized();
        //}

        //int uuserId = int.Parse(userIdClaim.Value);

        try
        {
            _logger.LogInformation($"Bắt đầu upload video cho userId: {userid}");

            // 📤 Upload video lên Cloudinary
            string videoUrl = await _cloudinaryService.UploadVideoAsync(video);
            _logger.LogInformation("Upload video lên Cloudinary thành công.");

            // 📸 Upload thumbnail nếu có
            string thumbnailUrl = "";
            if (thumbnail != null && thumbnail.Length > 0)
            {
                thumbnailUrl = await _cloudinaryService.UploadImageAsync(thumbnail);
                _logger.LogInformation("Upload thumbnail lên Cloudinary thành công.");
            }

            var newVideo = new Video
            {
                UserId = int.Parse(userid),
                Description = description,
                VideoUrl = videoUrl,
                ThumbnailUrl = thumbnailUrl,
                Visibility = visibility,
                Address = location,
                CreatedAt = DateTime.UtcNow.ToUniversalTime(),
                UpdatedAt = DateTime.UtcNow.ToUniversalTime(),
            };

            _context.Videos.Add(newVideo);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Lưu thông tin video vào cơ sở dữ liệu thành công.");

            return Ok(
                new { message = "Upload video thành công", userProfile = new { userid = userid } }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi upload video.");
            return StatusCode(500, "Đã xảy ra lỗi trong quá trình upload video.");
        }
    }
}
