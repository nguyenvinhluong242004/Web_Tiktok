using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("videos")]
    public class Video
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("userid")]
        public int UserId { get; set; }

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Required, Column("videourl")]
        public string VideoUrl { get; set; }

        [Column("thumbnailurl")]
        public string ThumbnailUrl { get; set; } = string.Empty;

        [Column("visibility")]
        public string Visibility { get; set; } = "public";

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("updatedat")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        [Column("deletedat")]
        public DateTime? DeletedAt { get; set; }

        [Column("totallikes")]
        public int TotalLikes { get; set; } = 0;

        [Column("totalshares")]
        public int TotalShares { get; set; } = 0;

        [Column("totalcomments")]
        public int TotalComments { get; set; } = 0;

        [Column("totalsaves")]
        public int TotalSaves { get; set; } = 0;

        [Column("totalviews")]
        public int TotalViews { get; set; } = 0;

        [Column("address")]
        public string Address { get; set; } = "";

        [Column("musicid")]
        public int? MusicId { get; set; } = null;
    }

    public class VideoWithUserDto
    {
        public int Id { get; set; }
        public int UserDbId { get; set; } // id trong bảng videos (trỏ tới bảng users)
        public string UserId { get; set; } // userid trong bảng users
        public string Username { get; set; }
        public string ProfileImage { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Visibility { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TotalLikes { get; set; }
        public int TotalViews { get; set; }
        public int TotalComments { get; set; }
        public int TotalSaves { get; set; }
        public int TotalShares { get; set; }
        public string Address { get; set; }
        public int? MusicId { get; set; } = null;
        public string MusicName { get; set; }
        public int MusicUserId { get; set; }
        public string MusicImage { get; set; }
        public string MusicLink { get; set; }
    }
}
