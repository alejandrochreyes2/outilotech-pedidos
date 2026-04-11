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
            entity.ToTable("pagos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Monto).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Moneda).HasMaxLength(10).HasDefaultValue("COP");
            entity.Property(e => e.Metodo).HasMaxLength(50).HasDefaultValue("tarjeta");
            entity.Property(e => e.Estado).IsRequired().HasMaxLength(50).HasDefaultValue("Aprobado");
            entity.Property(e => e.Referencia).HasMaxLength(100).HasDefaultValue("");
            entity.Property(e => e.Banco).HasMaxLength(100).HasDefaultValue("");
            entity.Property(e => e.Fecha).HasDefaultValueSql("NOW()");
        });
    }
}
