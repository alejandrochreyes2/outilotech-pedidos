using Microsoft.EntityFrameworkCore;
using PagosAPI.Models;

namespace PagosAPI.Data;

public class PagosDbContext : DbContext
{
    public PagosDbContext(DbContextOptions<PagosDbContext> options)
        : base(options) { }

    public DbSet<Pago> Pagos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pago>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Estado).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Monto).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Fecha).HasDefaultValueSql("NOW()");
        });
    }
}
