using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Comment
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("userid")]
        public int UserId { get; set; }

        [Column("videoid")]
        public int VideoId { get; set; }

        [Column("parentcommentid")]
        public int? ParentCommentId { get; set; }

        [Required, Column("content")]
        public string Content { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("totallikes")]
        public int TotalLikes { get; set; } = 0;

        [Column("totalreplies")]
        public int TotalReplies { get; set; } = 0;
    }
}
