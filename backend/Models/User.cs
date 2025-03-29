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

        [Column("email")]
        [Required]
        public string Email { get; set; } = string.Empty;

        [Column("passwordhash")]
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
