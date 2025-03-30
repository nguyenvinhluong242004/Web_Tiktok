using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Video
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("userid")]
        public int UserId { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Required, Column("videourl")]
        public string VideoUrl { get; set; }

        [Column("thumbnailurl")]
        public string ThumbnailUrl { get; set; }

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
    }
}
