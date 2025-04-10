using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("followers")]
    public class Follower
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required, Column("followerid")]
        public int FollowerId { get; set; }

        [Required, Column("followingid")]
        public int FollowingId { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
