using System.Threading.Tasks;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

public class UserData
{
    private readonly ApplicationDbContext _context;

    public UserData(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> IsEmailTaken(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<bool> IsUsernameTaken(string username)
    {
        return await _context.Users.AnyAsync(u => u.Username == username);
    }

    public async Task<User?> GetUserByUserIdAsync(string uid)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.UserId == uid);
    }

    public async Task<User?> GetUserByUUIDAsync(int uuid)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == uuid);
    }

    public async Task CreateUserAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync(); // Lưu vào database
    }

    public async Task UpdateUserAsync(User user)
    {
        user.DateOfBirth = user.DateOfBirth?.ToLocalTime().ToUniversalTime();
        user.CreatedAt = user.CreatedAt.ToLocalTime().ToUniversalTime();

        user.UpdatedAt = user.UpdatedAt.ToUniversalTime();
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsFriendAsync(int uId, string targetEmail) // uId: Người đang được xem profile     targetEmail: người xem
    {
        var target = await _context.Users.FirstOrDefaultAsync(u => u.Email == targetEmail);

        if (target == null)
            return false;

        return await _context.Followers.AnyAsync(f =>
            f.FollowerId == target.Id && f.FollowingId == uId
        );
    }
}
