using System.Security.Claims;
using System.Text;
using CloudinaryDotNet;
using dotenv.net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Load biến môi trường từ file .env
DotEnv.Load();

builder.Configuration.AddEnvironmentVariables();

// Gán các biến cần thiết vào Configuration
var config = builder.Configuration;

config["Jwt:Key"] = Environment.GetEnvironmentVariable("JWT_KEY")?.Trim();
config["Jwt:Issuer"] = Environment.GetEnvironmentVariable("JWT_ISSUER");
config["Jwt:Audience"] = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
config["Cloudinary:CloudName"] = Environment.GetEnvironmentVariable("CLOUD_NAME");
config["Cloudinary:ApiKey"] = Environment.GetEnvironmentVariable("CLOUD_KEY");
config["Cloudinary:ApiSecret"] = Environment.GetEnvironmentVariable("CLOUD_SECRET");
config["Redis:ConnectionString"] = Environment.GetEnvironmentVariable("REDIS_CONNECTION_STRING");
config["Redis:Password"] = Environment.GetEnvironmentVariable("REDIS_PASSWORD");

config["Database:Host"] = Environment.GetEnvironmentVariable("DB_HOST");
config["Database:Name"] = Environment.GetEnvironmentVariable("DB_NAME");
config["Database:User"] = Environment.GetEnvironmentVariable("DB_USER");
config["Database:Password"] = Environment.GetEnvironmentVariable("DB_PASSWORD");
config["Database:Port"] = Environment.GetEnvironmentVariable("DB_PORT");
config["Database:SslMode"] = Environment.GetEnvironmentVariable("DB_SSLMODE");
config["Database:TrustServerCertificate"] = Environment.GetEnvironmentVariable("DB_TRUST_CERT");

// Cấu hình Cloudinary
var account = new Account(
    config["Cloudinary:CloudName"],
    config["Cloudinary:ApiKey"],
    config["Cloudinary:ApiSecret"]
);
var cloudinary = new Cloudinary(account);
builder.Services.AddSingleton(cloudinary);
builder.Services.AddScoped<CloudinaryService>();

// Cấu hình Database
var connectionString =
    $"Host={config["Database:Host"]};"
    + $"Database={config["Database:Name"]};"
    + $"Username={config["Database:User"]};"
    + $"Password={config["Database:Password"]};"
    + $"Port={config["Database:Port"]};"
    + $"Ssl Mode={config["Database:SslMode"]};"
    + $"Trust Server Certificate={config["Database:TrustServerCertificate"]}";

// Thêm DbContext vào dịch vụ
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

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
    options.Configuration = config["Redis:ConnectionString"];
    options.ConfigurationOptions = new ConfigurationOptions
    {
        EndPoints = { config["Redis:ConnectionString"] },
        Password = config["Redis:Password"],
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
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
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

app.Use(
    async (context, next) =>
    {
        Console.WriteLine($"📩 Request: {context.Request.Method} {context.Request.Path}");
        await next();
    }
);

app.Run();
