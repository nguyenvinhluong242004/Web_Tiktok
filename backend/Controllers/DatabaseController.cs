using System.Linq;
using Backend.Models; // Import model User
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class DatabaseController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseController> _logger;

    public DatabaseController(ApplicationDbContext context, ILogger<DatabaseController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        _logger.LogInformation("📢 API GET /api/users được gọi!");

        var users = _context.Users.ToList();
        _logger.LogInformation("🔍 Tổng số users: {users.Count}", users.Count);

        if (users == null || !users.Any())
        {
            _logger.LogInformation("⚠️ Không có dữ liệu người dùng!");
            return NotFound(new { message = "Không có dữ liệu người dùng" });
        }

        return Ok(users);
    }
}
