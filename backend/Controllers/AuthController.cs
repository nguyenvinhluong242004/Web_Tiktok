using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLogin model)
    {
        _logger.LogInformation("User {Email} is attempting to log in", model.Email);

        if (model.Email == "luong" && model.Password == "123")
        {
            var accessToken = _authService.GenerateJwtToken(model.Email);
            var refreshToken = _authService.GenerateRefreshToken();

            await _authService.StoreRefreshTokenAsync(model.Email, refreshToken);

            Response.Cookies.Append(
                "access_token",
                accessToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTime.UtcNow.AddMinutes(1),
                }
            );

            Response.Cookies.Append(
                "refresh_token",
                refreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false, //local là false
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTime.UtcNow.AddMinutes(5),
                }
            );

            return Ok(new { message = "Login successful", access_token = accessToken });
        }

        return Unauthorized();
    }

    [Authorize]
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        _logger.LogInformation(
            "Cookies nhận được: {Cookies}",
            string.Join(", ", Request.Cookies.Keys)
        );
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            return Unauthorized(new { message = "No refresh token" });

        // if (!Request.Cookies.TryGetValue("access_token", out var oldAccessToken))
        //     return Unauthorized(new { message = "No access token" });


        var oldAccessToken = HttpContext.Request.Headers["Authorization"].ToString();

        var handler = new JwtSecurityTokenHandler();
        var token = oldAccessToken;
        var email = User.FindFirst(ClaimTypes.Email)?.Value; // Lấy email từ token

        if (email == null || !await _authService.ValidateRefreshTokenAsync(email, refreshToken))
            return Unauthorized(new { message = "Invalid refresh token" });

        var newAccessToken = _authService.GenerateJwtToken(email);
        Response.Cookies.Append(
            "access_token",
            newAccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, //local là false
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(5),
            }
        );

        return Ok(new { message = "Token refreshed", access_token = newAccessToken });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            return BadRequest(new { message = "No refresh token found" });

        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(refreshToken);
        var email = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

        if (email != null)
        {
            await _authService.RevokeRefreshTokenAsync(email);
        }

        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");

        return Ok(new { message = "Logged out" });
    }

    [Authorize]
    [HttpGet("check-token")]
    public IActionResult CheckToken()
    {
        // In log để kiểm tra API có chạy đến đây không
        _logger.LogInformation("CheckToken API được gọi");

        // Lấy token từ request header
        var token = HttpContext.Request.Headers["Authorization"].ToString();
        _logger.LogInformation("Token nhận được: {Token}", token);

        if (string.IsNullOrEmpty(token))
            return Unauthorized(new { message = "Không có token trong request." });

        var email = User.FindFirst(ClaimTypes.Email)?.Value; // Lấy email từ token

        _logger.LogInformation("email", email);
        var expClaim = User.FindFirst(JwtRegisteredClaimNames.Exp)?.Value;

        if (expClaim == null)
            return Unauthorized(new { message = "Token không hợp lệ.", email });

        var expTimestamp = long.Parse(expClaim);
        var expiryDate = DateTimeOffset.FromUnixTimeSeconds(expTimestamp).UtcDateTime;

        if (expiryDate < DateTime.UtcNow)
            return Unauthorized(new { message = "Token đã hết hạn.", email });

        return Ok(
            new
            {
                message = "Token hợp lệ.",
                email,
                expiresAt = expiryDate,
            }
        );
    }
}
