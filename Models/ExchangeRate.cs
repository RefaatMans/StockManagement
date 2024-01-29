namespace yousefWeb.Models
{
    public class ExchangeRate
    {
        public int Id { get; set; }
        public double Rate { get; set; }
        public int CurrencyId { get; set; }
        public Currency Currency { get; set; }
        public DateTime? Date { get; set; }

    }
}
