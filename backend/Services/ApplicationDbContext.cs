using Backend.Models; // Import model User
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    // Định nghĩa DbSet để truy vấn dữ liệu
    public DbSet<User> Users { get; set; }
}
