using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.Models;
using BCrypt.Net;
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

    [HttpPost("feeds")]
    public async Task<IActionResult> GetVideosOnFeeds()
    {
        var videos = await _videoData.GetRandomVideosAsync(10);
        return Ok(videos);
    }

    [HttpGet("@{uid}")]
    public async Task<IActionResult> GetListVideo(string uid)
    {
        string email = null;
        if (string.IsNullOrEmpty(uid))
        {
            return BadRequest(new { message = "Uid không hợp lệ." });
        }

        if (Request.Cookies.TryGetValue("access_token", out var refreshToken))
        {
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadToken(refreshToken) as JwtSecurityToken;
            email = token?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        }

        var user = await _userData.GetUserByUserIdAsync(uid);
        string profileEmail = user.Email;

        if (user == null)
        {
            return NotFound(new { message = "Người dùng không tồn tại." });
        }
        _logger.LogInformation("profileEmail {profileEmail}", profileEmail);
        _logger.LogInformation("email {email}", email);

        string pov = null;
        if (profileEmail == email)
        {
            _logger.LogInformation("chính chủ");
            pov = "owner";
        }
        else if (email == null)
        {
            _logger.LogInformation("khách");
            pov = "guest";
        }
        else
        {
            if (await _userData.IsFriendAsync(user.Id, email))
            {
                pov = "friend";
            }
            else
            {
                pov = "guest";
            }
        }

        _logger.LogInformation("Trạng thái người xem {pov}", pov);

        var videos = await _videoData.GetVideosByUIdAsync(user.Id);

        // lọc theo quyền
        List<Video> filteredVideos = pov switch
        {
            "owner" => videos, // trả hết
            "friend" => videos
                .Where(v => v.Visibility == "public" || v.Visibility == "friends")
                .ToList(),
            "guest" => videos.Where(v => v.Visibility == "public").ToList(),
            _ => new List<Video>(),
        };

        var videoList = filteredVideos
            .OrderByDescending(v => v.CreatedAt)
            .Select(video => new
            {
                id = video.Id,
                userId = video.UserId,
                uid = uid,
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

    [Authorize]
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
                new
                {
                    message = "Upload video thành công",
                    videoId = newVideo.Id,
                    userProfile = new { userid = userid },
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi upload video.");
            return StatusCode(500, "Đã xảy ra lỗi trong quá trình upload video.");
        }
    }

    [Authorize]
    [HttpPut("update-visibility")]
    public async Task<IActionResult> UpdateVisibility(
        [FromForm] int videoId,
        [FromForm] string visibility
    )
    {
        try
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (email == null)
            {
                _logger.LogWarning("Người dùng chưa đăng nhập hoặc token không hợp lệ.");
                return Unauthorized();
            }

            var user = await _userData.GetUserByEmailAsync(email);

            var video = await _videoData.GetVideoByIdAsync(videoId);
            if (video == null)
            {
                _logger.LogWarning($"Không tìm thấy video với ID: {videoId}");
                return NotFound("Video không tồn tại.");
            }

            if (video.UserId != user.Id)
            {
                _logger.LogWarning($"Người dùng không có quyền sửa video với ID: {videoId}");
                return Forbid("Bạn không có quyền sửa video này.");
            }

            video.Visibility = visibility;
            video.UpdatedAt = DateTime.UtcNow.ToUniversalTime();
            video.DeletedAt = video.DeletedAt?.ToUniversalTime();
            video.CreatedAt = DateTime.SpecifyKind(video.CreatedAt, DateTimeKind.Utc);

            _context.Videos.Update(video);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Đã cập nhật visibility cho video ID: {videoId}");

            return Ok(
                new
                {
                    message = "Cập nhật visibility thành công",
                    videoId = video.Id,
                    newVisibility = video.Visibility,
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật visibility.");
            return StatusCode(500, "Đã xảy ra lỗi khi cập nhật visibility.");
        }
    }
}
