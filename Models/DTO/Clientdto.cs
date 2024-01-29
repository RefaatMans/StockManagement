using System.ComponentModel.DataAnnotations;

namespace yousefWeb.Models.DTO
{
    public class Clientdto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int phoneNb { get; set; }
        [Required]
        public string address { get; set; }
    }
}
