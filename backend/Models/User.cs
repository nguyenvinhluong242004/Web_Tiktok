using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required, Column("username")]
        public string Username { get; set; }

        [Required, Column("email")]
        public string Email { get; set; }

        [Required, Column("passwordhash")]
        public string PasswordHash { get; set; }

        [Column("phonenumber")]
        public string? PhoneNumber { get; set; } = null;

        [Column("dateofbirth")]
        public DateTime? DateOfBirth { get; set; }

        [Column("role")]
        public string Role { get; set; } = "user";

        [Column("profileimage")]
        public string? ProfileImage { get; set; } = null;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("totalfollowers")]
        public int TotalFollowers { get; set; } = 0;

        [Column("totalfollowing")]
        public int TotalFollowing { get; set; } = 0;

        [Column("totalvideolikes")]
        public int TotalVideoLikes { get; set; } = 0;

        [Column("receivenews")]
        public bool ReceiveNews { get; set; } = false;
    }
}
