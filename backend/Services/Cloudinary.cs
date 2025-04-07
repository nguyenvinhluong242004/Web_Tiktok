using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<CloudinaryService> _logger;

    public CloudinaryService(Cloudinary cloudinary, ILogger<CloudinaryService> logger)
    {
        _cloudinary = cloudinary;
        _logger = logger;
    }

    public async Task<string> UploadVideoAsync(IFormFile file)
    {
        if (_cloudinary == null)
        {
            throw new NullReferenceException("Cloudinary instance is null!");
        }

        if (file == null || file.Length == 0)
            return null;

        using var stream = file.OpenReadStream();
        var uploadParams = new VideoUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "Video_tiktok",
            PublicId = Guid.NewGuid().ToString(),
            // KHÔNG cần gán ResourceType ở đây
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl?.AbsoluteUri;
    }

    public async Task<string> UploadImageAsync(IFormFile file)
    {
        if (_cloudinary == null)
        {
            throw new NullReferenceException("Cloudinary instance is null!");
        }

        if (file.Length <= 0)
            return null;

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "Image_tiktok", // 📂 Chỉ định folder trên Cloudinary
            Transformation = new Transformation().Width(500).Height(500).Crop("fill"),
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl.AbsoluteUri;
    }

    public async Task DeleteImageAsync(string imageUrl)
    {
        try
        {
            // Trích xuất publicId từ URL
            var publicId = "Image_tiktok/" + imageUrl.Split('/').Last().Split('.').First();

            // Ghi log trước khi xóa
            _logger.LogInformation($"Attempting to delete image with publicId: {publicId}");

            if (string.IsNullOrEmpty(publicId))
            {
                _logger.LogError("Unable to extract publicId from the provided image URL.");
                throw new ArgumentException("Invalid image URL, publicId could not be extracted.");
            }

            // Tạo tham số xóa với publicId
            var deletionParams = new DeletionParams(publicId)
            {
                ResourceType = ResourceType.Image, // Chỉ định loại tài nguyên là hình ảnh
            };

            // Xóa ảnh từ Cloudinary
            var result = await _cloudinary.DestroyAsync(deletionParams);

            if (result.Result == "ok")
            {
                _logger.LogInformation("Image deleted successfully.");
            }
            else
            {
                _logger.LogError($"Failed to delete image: {result.Error?.Message}");
            }
        }
        catch (Exception ex)
        {
            // Ghi log lỗi chi tiết nếu có
            _logger.LogError($"Error deleting image: {ex.Message}");
            throw; // Ném lại lỗi để xử lý tiếp nếu cần
        }
    }
}
