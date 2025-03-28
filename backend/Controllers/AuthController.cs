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
            string role = model.Email switch
            {
                "luong" => "Admin",
                "nhi" => "Censor",
                _ => "User",
            };

            var accessToken = _authService.GenerateJwtToken(model.Email, role);
            var refreshToken = _authService.GenerateRefreshToken();

            await _authService.StoreRefreshTokenAsync(model.Email, refreshToken);

            Response.Cookies.Append(
                "access_token",
                accessToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
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

            return Ok(
                new
                {
                    message = "Login successful",
                    access_token = accessToken,
                    role = role,
                }
            );
        }

        return Unauthorized();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            return BadRequest(new { message = "No refresh token found" });

        string email = null;

        // 2️⃣ Lấy email từ access token cũ (nếu còn)
        var oldAccessToken = HttpContext
            .Request.Headers["Authorization"]
            .ToString()
            .Replace("Bearer ", "");
        if (!string.IsNullOrEmpty(oldAccessToken))
        {
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadToken(oldAccessToken) as JwtSecurityToken;
            email = token?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        }

        // 3️⃣ Nếu chưa có, lấy từ header `X-User-Email`
        if (string.IsNullOrEmpty(email))
        {
            email = HttpContext.Request.Headers["X-User-Email"].ToString();
        }

        // 4️⃣ Nếu vẫn chưa có, lấy từ User Claims (nếu access token đã hết hạn)
        if (string.IsNullOrEmpty(email))
        {
            email = User.FindFirst(ClaimTypes.Email)?.Value;
        }

        if (string.IsNullOrEmpty(email))
            return Unauthorized(new { message = "Email not found" });

        await _authService.RevokeRefreshTokenAsync(email);

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

        if (!Request.Cookies.TryGetValue("access_token", out var tokenFromCookie))
            return Unauthorized(new { message = "No access_token from Cookies" });

        if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(tokenFromCookie))
        {
            _logger.LogInformation("CheckToken T1: {0}", token.Split(" ")[1]);
            _logger.LogInformation("CheckToken T2: {0}", tokenFromCookie);
            if (token.Split(" ")[1] != tokenFromCookie)
            {
                return Unauthorized(new { message = "Token trong header và cookie không khớp." });
            }
        }

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

    [Authorize]
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        _logger.LogInformation(
            "Cookies nhận được: {Cookies}",
            string.Join(", ", Request.Cookies.Keys)
        );

        // 1️⃣ Kiểm tra refresh token trong Redis (từ cookie client gửi lên)
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            return Unauthorized(new { message = "No refresh token" });

        string email = null;
        string role = null;

        // 2️⃣ Lấy email từ access token cũ (nếu còn)
        var oldAccessToken = HttpContext
            .Request.Headers["Authorization"]
            .ToString()
            .Replace("Bearer ", "");
        if (!string.IsNullOrEmpty(oldAccessToken))
        {
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadToken(oldAccessToken) as JwtSecurityToken;
            email = token?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            role = token?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value ?? "User";
        }

        // 3️⃣ Nếu chưa có, lấy từ header `X-User-Email`
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(role))
        {
            email = HttpContext.Request.Headers["X-User-Email"].ToString();
            role = HttpContext.Request.Headers["X-User-Role"].ToString();
        }

        // 4️⃣ Nếu vẫn chưa có, lấy từ User Claims (nếu access token đã hết hạn)
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(role))
        {
            email = User.FindFirst(ClaimTypes.Email)?.Value;
            role = User.FindFirst(ClaimTypes.Role)?.Value ?? "User";
        }

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(role))
            return Unauthorized(new { message = "Email not found" });

        // 5️⃣ Kiểm tra refresh token có hợp lệ không (lấy từ Redis)
        if (!await _authService.ValidateRefreshTokenAsync(email, refreshToken))
            return Unauthorized(new { message = "Invalid refresh token" });

        // 6️⃣ Tạo access token mới
        var newAccessToken = _authService.GenerateJwtToken(email, role);

        // 7️⃣ Gửi token mới về client (cookie HttpOnly)
        Response.Cookies.Append(
            "access_token",
            newAccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Local là false, production nên đặt true
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(1),
            }
        );

        return Ok(new { message = "Token refreshed", access_token = newAccessToken });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAdminData()
    {
        // 1️ Kiểm tra refresh token trong Redis (từ cookie client gửi lên)
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            return Unauthorized(new { message = "Role: No refresh token" });

        string email = email = User.FindFirst(ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(email))
            return Unauthorized(new { message = "Role: Email not found" });

        // 2 Kiểm tra refresh token có hợp lệ không (lấy từ Redis)
        if (!await _authService.ValidateRefreshTokenAsync(email, refreshToken))
            return Unauthorized(new { message = "Role: Invalid refresh token" });

        return Ok(new { message = "This is admin data." });
    }

    [Authorize(Roles = "Censor")]
    [HttpGet("censor")]
    public async Task<IActionResult> GetCensorData()
    {
        // 1️ Kiểm tra refresh token trong Redis (từ cookie client gửi lên)
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            return Unauthorized(new { message = "Role: No refresh token" });

        string email = email = User.FindFirst(ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(email))
            return Unauthorized(new { message = "Role: Email not found" });

        // 2 Kiểm tra refresh token có hợp lệ không (lấy từ Redis)
        if (!await _authService.ValidateRefreshTokenAsync(email, refreshToken))
            return Unauthorized(new { message = "Role: Invalid refresh token" });

        return Ok(new { message = "This is admin data." });
    }

    [Authorize(Roles = "User")]
    [HttpGet("user")]
    public async Task<IActionResult> GetUserData()
    {
        // 1️ Kiểm tra refresh token trong Redis (từ cookie client gửi lên)
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            return Unauthorized(new { message = "Role: No refresh token" });

        string email = email = User.FindFirst(ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(email))
            return Unauthorized(new { message = "Role: Email not found" });

        // 2 Kiểm tra refresh token có hợp lệ không (lấy từ Redis)
        if (!await _authService.ValidateRefreshTokenAsync(email, refreshToken))
            return Unauthorized(new { message = "Role: Invalid refresh token" });

        return Ok(new { message = "This is user data." });
    }
}
