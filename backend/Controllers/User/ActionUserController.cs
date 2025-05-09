using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/action")]
[ApiController]
public class ActionUserController : ControllerBase
{
    private readonly UserData _userData;
    private readonly CloudinaryService _cloudinaryService;
    private readonly ILogger<AccountController> _logger;
    private readonly ApplicationDbContext _context;

    public ActionUserController(
        UserData userData,
        CloudinaryService cloudinaryService,
        ILogger<AccountController> logger,
        ApplicationDbContext context
    )
    {
        _userData = userData;
        _cloudinaryService = cloudinaryService;
        _logger = logger;
        _context = context;
    }

    [HttpPost("add-follower")]
    [Authorize]
    public async Task<IActionResult> AddFollower([FromBody] Follower follower)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _context.Followers.Add(follower);
        await _context.SaveChangesAsync();
        return Ok(follower);
    }

    // DELETE: api/action/del-follower?followerId=1&followingId=2
    [HttpDelete("del-follower")]
    [Authorize]
    public async Task<IActionResult> DeleteFollowerByPair(
        [FromQuery] int followerId,
        [FromQuery] int followingId
    )
    {
        var follower = await _context.Followers.FirstOrDefaultAsync(f =>
            f.FollowerId == followerId && f.FollowingId == followingId
        );

        if (follower == null)
            return NotFound(new { message = "Không tìm thấy follow để xóa." });

        _context.Followers.Remove(follower);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
