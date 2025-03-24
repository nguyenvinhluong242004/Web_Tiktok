var builder = WebApplication.CreateBuilder(args);

// Thêm các service cần thiết
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// 🛠️ Quan trọng: Thêm dòng này để tránh lỗi
builder.Services.AddAuthorization(); 

var app = builder.Build();

app.UseCors("AllowAllOrigins");
app.UseRouting();
app.UseAuthorization(); // Không lỗi nữa
app.UseEndpoints(endpoints => endpoints.MapControllers());

app.Run();
