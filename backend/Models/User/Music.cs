using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("musics")]
    public class Music
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required, Column("name")]
        public string Name { get; set; }

        [Required, Column("userid")]
        public int UserId { get; set; }

        [Required, Column("image")]
        public string Image { get; set; }

        [Required, Column("link")]
        public string Link { get; set; }
    }
}
