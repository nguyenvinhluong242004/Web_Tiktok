using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using Backend.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly UserData _userData;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;

    public AuthController(
        AuthService authService,
        UserData userData,
        ILogger<AuthController> logger,
        IConfiguration configuration
    )
    {
        _authService = authService;
        _userData = userData;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegister model)
    {
        _logger.LogInformation("User {Email} is attempting to register", model.Email);
        _logger.LogInformation("Model received: {@Model}", model);

        if (await _userData.IsEmailTaken(model.Email))
        {
            return BadRequest(new { message = "Email đã được sử dụng" });
        }

        // Kiểm tra mã xác thực có đúng không
        if (
            !Request.Cookies.TryGetValue("verificationCode", out string storedCodeStr) // Lấy chuỗi từ cookie
            || !int.TryParse(storedCodeStr, out int storedCode) // Chuyển thành số nguyên
            || storedCode != model.VerificationCode // So sánh với mã xác minh
        )
        {
            _logger.LogInformation("User {StoredCodeStr} is attempting to register", storedCodeStr);

            _logger.LogInformation(
                "User {VerificationCode} is attempting to register",
                model.VerificationCode
            );
            return BadRequest(new { message = "Mã xác thực không đúng hoặc đã hết hạn." });
        }

        // Xóa mã xác thực sau khi sử dụng
        Response.Cookies.Delete("verificationCode");

        // Tạo username từ email (phần trước @)
        string generatedUsername = model.Email.Split('@')[0];

        int suffix = 1;

        // Kiểm tra trùng lặp và thêm số vào username nếu cần
        while (await _userData.IsUsernameTaken(generatedUsername))
        {
            generatedUsername = $"{generatedUsername}{suffix}";
            suffix++;
        }

        suffix = 1;
        // Tạo UserId ngẫu nhiên
        string userId = $"{generatedUsername}_{Guid.NewGuid().ToString().Substring(0, 4)}";

        // Kiểm tra trùng lặp và thêm số vào userId nếu cần
        while (await _userData.IsUsernameTaken(generatedUsername))
        {
            userId = $"{userId}{suffix}";
            suffix++;
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
        _logger.LogInformation("Pass {HashedPassword}", hashedPassword);

        if (!DateTime.TryParse(model.DateOfBirth, out DateTime dob))
        {
            return BadRequest(new { message = "Ngày sinh không hợp lệ" });
        }

        var user = new User
        {
            UserId = userId, // Gán UserId tự động
            Username = generatedUsername, // Gán username tự động
            Email = model.Email,
            PasswordHash = hashedPassword,
            DateOfBirth = dob.ToUniversalTime(),
            Role = "user",
            CreatedAt = DateTime.UtcNow.ToUniversalTime(),
            UpdatedAt = DateTime.UtcNow.ToUniversalTime(),
            ReceiveNews = model.ReceiveNews,
        };

        await _userData.CreateUserAsync(user);

        return Ok(new { message = "Đăng ký thành công", username = generatedUsername });
    }

    [HttpPost("send-code")]
    public async Task<IActionResult> SendVerificationCode(
        [FromBody] EmailRequest request,
        [FromServices] SmtpClient smtpClient
    )
    {
        _logger.LogInformation("Gửi mã xác thực đến email: {Email}", request.Email);

        if (string.IsNullOrEmpty(request.Email))
        {
            return BadRequest(new { message = "Email không được để trống." });
        }

        if (await _userData.IsEmailTaken(request.Email))
        {
            return BadRequest(new { message = "Email đã được sử dụng" });
        }

        // ✅ Tạo mã xác thực ngẫu nhiên 6 chữ số
        var verificationCode = new Random().Next(100000, 999999).ToString();

        // ✅ Lưu mã vào Cookies (Thời gian hết hạn 3 phút)
        Response.Cookies.Append(
            "verificationCode",
            verificationCode.ToString(),
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, //local là false
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(3),
            }
        );

        // ✅ Lấy thông tin từ cấu hình đã được đăng ký trong DI container
        var senderEmail = _configuration["Email:SenderEmail"];
        var senderName = _configuration["Email:SenderName"];

        // ✅ Gửi mã xác thực qua SMTP
        try
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail, senderName),
                Subject = "Xác thực tài khoản TikTok",
                Body =
                    $@"
                    <html>
                    <body style='font-family: Arial, sans-serif; color: #333;'>
                        <h3 style='color:rgb(195, 0, 255);'>Xác thực tài khoản của bạn</h3>
                        <p>Chào bạn,</p>
                        <p>Bạn vừa yêu cầu mã xác thực để đăng ký hoặc đăng nhập TikTok.</p>
                        <p><strong>Mã xác thực của bạn:</strong> <span style='font-size: 17px; color:rgb(255, 51, 0);'>{verificationCode}</span></p>
                        <p>Mã này sẽ hết hạn sau <strong>3 phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
                        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                        <hr>
                        <p>Trân trọng,<br><strong>TikTok Team</strong></p>
                    </body>
                    </html>",
                IsBodyHtml = true,
            };

            mailMessage.To.Add(request.Email);
            mailMessage.ReplyToList.Add(new MailAddress("support@tiktokclone.com")); // Giúp tránh spam
            mailMessage.Priority = MailPriority.High; // Gmail ưu tiên email này hơn

            await smtpClient.SendMailAsync(mailMessage);

            return Ok(new { message = "Mã xác thực đã được gửi." });
        }
        catch (Exception ex)
        {
            _logger.LogError("Lỗi gửi email: {Error}", ex.Message);
            return StatusCode(500, new { message = "Không thể gửi email. Vui lòng thử lại sau." });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLogin model)
    {
        _logger.LogInformation("User {Email} is attempting to log in", model.Email);

        var user = await _userData.GetUserByEmailAsync(model.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });
        }
        if (!BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });
        }
        string role = model.Email switch
        {
            "luongnguyen02042004@gmail.com" => "Admin",
            "vquan2142@gmail.com" => "Censor",
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
                Expires = DateTime.UtcNow.AddMinutes(15),
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
                Expires = DateTime.UtcNow.AddDays(7),
            }
        );

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

        return Ok(
            new
            {
                message = "Login successful",
                access_token = accessToken,
                role = role,
                user = userProfile,
            }
        );
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
        _logger.LogInformation("User IsAuthenticated: {0}", User.Identity.IsAuthenticated);

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

        _logger.LogInformation("email {email}", email);
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

    //[Authorize] // Nếu check thì khi ac_token hết hạn -> không vượt qua -> không lấy được ac_token mới
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

        // _logger.LogInformation("Email: {email}, RefreshToken: {refreshToken}", email, refreshToken);

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
                Expires = DateTime.UtcNow.AddMinutes(15),
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
