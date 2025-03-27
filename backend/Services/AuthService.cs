using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.IdentityModel.Tokens;

public class AuthService
{
    private readonly IConfiguration _config;
    private readonly IDistributedCache _cache; // Redis Cache
    private readonly ILogger<AuthController> _logger;

    public AuthService(
        IConfiguration config,
        IDistributedCache cache,
        ILogger<AuthController> logger
    )
    {
        _config = config;
        _cache = cache;
        _logger = logger;
    }

    public string GenerateJwtToken(string email)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddMinutes(1), // Access Token có hiệu lực 15 phút
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        return Convert.ToBase64String(randomBytes);
    }

    public async Task StoreRefreshTokenAsync(string email, string refreshToken)
    {
        await _cache.SetStringAsync(
            $"refresh_{email}",
            refreshToken,
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5), // Hết hạn sau 7 ngày
            }
        );
    }

    public async Task<bool> ValidateRefreshTokenAsync(string email, string refreshToken)
    {
        var storedToken = await _cache.GetStringAsync($"refresh_{email}");
        return storedToken == refreshToken;
    }

    public async Task<string> GetfreshTokenAsync(string email)
    {
        return await _cache.GetStringAsync($"refresh_{email}");
    }

    public async Task RevokeRefreshTokenAsync(string email)
    {
        await _cache.RemoveAsync($"refresh_{email}");
    }
}
