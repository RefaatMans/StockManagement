namespace yousefWeb.Models.DTO
{
    public class Itemdto
    {
        public int CatId { get; set; }
        public int CurrencyId { get; set; }
        public int SellingCurrencyId { get; set; }
        public double Price { get; set; }
        public double SellingPrice { get; set; }
        public string Name { get; set; }
        public byte[] Image { get; set; }
        public bool IsActive { get; set; }
    }
}
