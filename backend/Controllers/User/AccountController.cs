using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserData _userData;
    private readonly CloudinaryService _cloudinaryService;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        UserData userData,
        CloudinaryService cloudinaryService,
        ILogger<AccountController> logger
    )
    {
        _userData = userData;
        _cloudinaryService = cloudinaryService;
        _logger = logger;
    }

    // Không cần xác thực cho API này: Có thể truy cập mà không cần đăng nhập (xem profile của người khác)
    // API động với uid
    [HttpGet("@{uid}")]
    public async Task<IActionResult> GetProfile(string uid)
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

        var userProfile = new
        {
            uuid = user.Id,
            userid = user.UserId,
            username = user.Username,
            email = user.Email,
            dateOfBirth = user.DateOfBirth,
            bio = user.Bio,
            totalFollowers = user.TotalFollowers,
            totalFollowing = user.TotalFollowing,
            totalVideoLikes = user.TotalVideoLikes,
            profileImage = user.ProfileImage,
        };

        return Ok(new { userProfile });
    }

    [Authorize]
    [HttpPost("check-profile")]
    public async Task<IActionResult> CheckProfile()
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
        {
            return Unauthorized(new { message = "Không thể xác thực người dùng." });
        }

        var user = await _userData.GetUserByEmailAsync(userEmail);
        if (user == null)
        {
            return NotFound(new { message = "Người dùng không tồn tại." });
        }

        var userProfile = new
        {
            uuid = user.Id,
            userid = user.UserId,
            username = user.Username,
            email = user.Email,
            dateOfBirth = user.DateOfBirth,
            bio = user.Bio,
            totalFollowers = user.TotalFollowers,
            totalFollowing = user.TotalFollowing,
            totalVideoLikes = user.TotalVideoLikes,
            profileImage = user.ProfileImage,
        };

        return Ok(new { userProfile });
    }

    [Authorize]
    [HttpPost("update-profile")]
    public async Task<IActionResult> UpdateProfile(
        [FromForm] IFormFile? newImage,
        [FromForm] int uuid,
        [FromForm] string userId,
        [FromForm] string name,
        [FromForm] string bio,
        [FromForm] string oldImage
    )
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
        {
            return Unauthorized(new { message = "Không thể xác thực người dùng." });
        }

        var user = await _userData.GetUserByUUIDAsync(uuid);
        if (user == null)
        {
            return NotFound(new { message = "Người dùng không tồn tại." });
        }

        // Kiểm tra nếu username đã được sử dụng bởi người khác
        if (user.Username != name && await _userData.IsUsernameTaken(name))
        {
            return BadRequest(new { message = "Tên người dùng đã tồn tại." });
        }

        string newImageUrl = oldImage; // Giữ nguyên nếu không có ảnh mới

        if (newImage != null)
        {
            // Upload ảnh mới lên Cloudinary
            newImageUrl = await _cloudinaryService.UploadImageAsync(newImage);
            if (string.IsNullOrEmpty(newImageUrl))
            {
                return BadRequest(new { message = "Lỗi khi tải ảnh lên Cloudinary." });
            }

            // Xóa ảnh cũ nếu có
            if (!string.IsNullOrEmpty(oldImage))
            {
                await _cloudinaryService.DeleteImageAsync(oldImage);
            }
        }

        // Cập nhật thông tin người dùng
        user.Username = name;
        user.UserId = userId;
        user.Bio = bio;
        user.ProfileImage = newImageUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await _userData.UpdateUserAsync(user);

        var userProfile = new
        {
            userid = user.UserId,
            username = user.Username,
            email = user.Email,
            dateOfBirth = user.DateOfBirth,
            bio = user.Bio,
            totalFollowers = user.TotalFollowers,
            totalFollowing = user.TotalFollowing,
            totalVideoLikes = user.TotalVideoLikes,
            profileImage = user.ProfileImage,
        };

        return Ok(new { message = "Cập nhật thông tin thành công.", userProfile });
    }
}
