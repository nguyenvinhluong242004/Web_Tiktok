using System.Collections.Generic;
using System.Linq;
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

    public async Task<List<VideoWithUserDto>> GetRandomVideosAsync(int count = 10)
    {
        var total = await _context.Videos.CountAsync();

        if (total == 0)
            return new List<VideoWithUserDto>();

        if (total <= count)
        {
            var allVideos = await _context.Videos.OrderBy(v => v.Id).ToListAsync();

            return await ConvertToDtoList(allVideos);
        }

        var random = new Random();
        var indices = new HashSet<int>();
        while (indices.Count < count)
        {
            indices.Add(random.Next(0, total));
        }

        var tasks = indices.Select(async index =>
            await _context.Videos.OrderBy(v => v.Id).Skip(index).Take(1).FirstAsync()
        );

        var selectedVideos = await Task.WhenAll(tasks);
        return await ConvertToDtoList(selectedVideos.ToList());
    }

    private async Task<List<VideoWithUserDto>> ConvertToDtoList(List<Video> videos)
    {
        var userIds = videos.Select(v => v.UserId).Distinct().ToList();
        var users = await _context
            .Users.Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id);

        return videos
            .Select(v =>
            {
                var user = users.GetValueOrDefault(v.UserId);
                return new VideoWithUserDto
                {
                    Id = v.Id,
                    UserDbId = user?.Id ?? 0,
                    UserId = user?.UserId ?? "",
                    Username = user?.Username ?? "",
                    Description = v.Description,
                    VideoUrl = v.VideoUrl,
                    ThumbnailUrl = v.ThumbnailUrl,
                    Visibility = v.Visibility,
                    CreatedAt = v.CreatedAt,
                    TotalLikes = v.TotalLikes,
                    TotalViews = v.TotalViews,
                    Address = v.Address,
                };
            })
            .ToList();
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
