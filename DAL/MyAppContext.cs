using Microsoft.EntityFrameworkCore;
using yousefWeb.Models;

namespace yousefWeb.DAL
{
    public class MyAppContext : DbContext
    {
        public MyAppContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<ExchangeRate> ExchangeRates { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartDetails> CartDetails { get; set; }
        public DbSet<ScheduledAmount> ScheduledAmounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure your relationships and constraints here

            modelBuilder.Entity<Item>()
            .HasOne(i => i.SellingCurrency)
            .WithMany()
            .HasForeignKey(i => i.SellingCurrencyId)
            .OnDelete(DeleteBehavior.Restrict); // Specify the desired behavior, e.g., Restrict, NoAction, SetNull

            modelBuilder.Entity<Item>()
                .HasOne(i => i.Category)
                .WithMany()
                .HasForeignKey(i => i.CategoryId)
                .OnDelete(DeleteBehavior.Cascade); // Adjust the cascade behavior based on your requirements

            modelBuilder.Entity<Item>()
                .HasOne(i => i.Currency)
                .WithMany()
                .HasForeignKey(i => i.CurrencyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
