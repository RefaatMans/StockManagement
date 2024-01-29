using System.Transactions;

namespace yousefWeb.Models
{
    public class ScheduledAmount
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public float Amount { get; set; }
    }
}
