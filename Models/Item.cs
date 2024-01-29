using System.ComponentModel.DataAnnotations.Schema;

namespace yousefWeb.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public double SellingPrice { get; set; }
        public byte[] Image { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        [ForeignKey("Currency")]
        public int CurrencyId { get; set; }
        public Currency Currency { get; set; }

        [ForeignKey("SellingCurrency")]
        public int SellingCurrencyId { get; set; }
        public Currency SellingCurrency { get; set; }

        public bool IsActive { get; set; }
    }
}
