using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

public class VideoData
{
    private readonly ApplicationDbContext _context;

    public VideoData(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Video?> GetVideoByIdAsync(int id)
    {
        return await _context.Videos.FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<List<Video>> GetVideosByUserIdAsync(int userId)
    {
        return await _context.Videos.Where(v => v.UserId == userId).ToListAsync();
    }

    public async Task<List<Video>> GetVideosByUIdAsync(int id)
    {
        return await _context.Videos.Where(v => v.UserId == id).ToListAsync();
    }

    public async Task<List<Video>> GetAllVideosAsync()
    {
        return await _context.Videos.ToListAsync();
    }

    public async Task CreateVideoAsync(Video video)
    {
        await _context.Videos.AddAsync(video);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateVideoAsync(Video video)
    {
        video.CreatedAt = video.CreatedAt.ToLocalTime().ToUniversalTime();
        video.UpdatedAt = video.UpdatedAt.ToUniversalTime();

        _context.Videos.Update(video);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteVideoAsync(Video video)
    {
        _context.Videos.Remove(video);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> VideoExistsAsync(int id)
    {
        return await _context.Videos.AnyAsync(v => v.Id == id);
    }
}
