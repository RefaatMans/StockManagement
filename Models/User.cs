using System.ComponentModel.DataAnnotations;

namespace yousefWeb.Models
{
    public class User
    {
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
