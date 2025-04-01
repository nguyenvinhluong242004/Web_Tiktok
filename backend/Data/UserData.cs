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

    public async Task CreateUserAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync(); // Lưu vào database
    }
}
