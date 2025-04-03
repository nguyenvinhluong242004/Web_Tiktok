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
    private readonly ILogger<AccountController> _logger;

    public AccountController(UserData userData, ILogger<AccountController> logger)
    {
        _userData = userData;
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
            userid = user.UserId,
            username = user.Username,
            email = user.Email,
            dateOfBirth = user.DateOfBirth,
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
            userid = user.UserId,
            username = user.Username,
            email = user.Email,
            dateOfBirth = user.DateOfBirth,
            totalFollowers = user.TotalFollowers,
            totalFollowing = user.TotalFollowing,
            totalVideoLikes = user.TotalVideoLikes,
            profileImage = user.ProfileImage,
        };

        return Ok(new { userProfile });
    }
}
