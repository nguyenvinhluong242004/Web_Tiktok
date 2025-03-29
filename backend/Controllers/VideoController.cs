using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/videos")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private static List<Video> videos = new List<Video>
        {
            new Video
            {
                Id = 1,
                Title = "Funny dance",
                Url =
                    "https://res.cloudinary.com/dphytbuah/video/upload/v1742827026/DTB_Video/dgl1lbamapqq0wo7zttq.mp4",
            },
            new Video
            {
                Id = 2,
                Title = "Cool trick",
                Url =
                    "https://res.cloudinary.com/dphytbuah/video/upload/v1742829149/DTB_Video/vg6eq1nudkq8r3n866de.mp4",
            },
        };

        [HttpGet]
        public IActionResult GetVideos()
        {
            return Ok(videos);
        }
    }
}
