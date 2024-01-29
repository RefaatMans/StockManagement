namespace yousefWeb.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public Client Client { get; set; }
        public float Total { get; set; }
        public DateTime? Date { get; set; }

    }
}
