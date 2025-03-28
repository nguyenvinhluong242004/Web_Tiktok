using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Thêm các service cần thiết
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowSpecificOrigin",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:8888") // Đúng với frontend
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); // Cho phép gửi cookie/token
        }
    );
});

// Cấu hình Redis Upstash
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
    options.ConfigurationOptions = new ConfigurationOptions
    {
        EndPoints = { builder.Configuration["Redis:ConnectionString"] },
        Password = builder.Configuration["Redis:Password"],
        Ssl = true, // Upstash yêu cầu SSL
        AbortOnConnectFail = false,
    };
});

// Cấu hình Authentication
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            ),
            RoleClaimType = ClaimTypes.Role,
        };
    });

// Thêm Authorization Policies cho các vai trò
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("CensorPolicy", policy => policy.RequireRole("Censor"));
    options.AddPolicy("UserPolicy", policy => policy.RequireRole("User"));
});

// 🛠️ Quan trọng: Thêm dòng này để tránh lỗi
builder.Services.AddAuthorization();
builder.Services.AddScoped<AuthService>();
builder.Services.AddControllers();
builder.Services.AddLogging();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization(); // Không lỗi nữa

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseMiddleware<JwtMiddleware>();

app.Run();
