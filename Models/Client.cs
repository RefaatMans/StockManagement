using System.ComponentModel.DataAnnotations;

namespace yousefWeb.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int phoneNb { get; set; }
        public string address { get; set; }
    }
}
