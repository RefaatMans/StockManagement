namespace yousefWeb.Models
{
    public class CartDetails
    {
        public int Id { get; set; }
        public int Qty { get; set; }
        public int CartId { get; set; }
        public Cart Cart { get; set; }
        public int ItemId { get; set; }
        public Item Item { get; set; }
        public int UnitPrice { get; set; }
    }
}
