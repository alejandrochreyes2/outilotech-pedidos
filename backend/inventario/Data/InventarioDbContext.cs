using Microsoft.EntityFrameworkCore;
using InventarioAPI.Models;

namespace InventarioAPI.Data;

public class InventarioDbContext : DbContext
{
    public InventarioDbContext(DbContextOptions<InventarioDbContext> options) : base(options) { }

    public DbSet<InventarioStock>   Stock    { get; set; }
    public DbSet<InventarioEntrada> Entradas { get; set; }
    public DbSet<InventarioSalida>  Salidas  { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InventarioStock>(e =>
        {
            e.ToTable("inventario_stock");
            e.HasKey(x => x.Id);
            e.Property(x => x.CodigoProducto).IsRequired().HasMaxLength(20);
            e.HasIndex(x => x.CodigoProducto).IsUnique();
            e.Property(x => x.Descripcion).IsRequired().HasMaxLength(255);
            e.Property(x => x.Lote).HasMaxLength(50);
            e.Property(x => x.CostoUnitario).HasColumnType("numeric(12,2)");
            e.Property(x => x.PrecioVenta).HasColumnType("numeric(12,2)");
            e.Property(x => x.ImporteInventarioProveedor).HasColumnType("numeric(14,2)");
            e.Property(x => x.Venta).HasColumnType("numeric(14,2)");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("NOW()");
            e.Property(x => x.UpdatedAt).HasDefaultValueSql("NOW()");
        });

        modelBuilder.Entity<InventarioEntrada>(e =>
        {
            e.ToTable("inventario_entradas");
            e.HasKey(x => x.Id);
            e.Property(x => x.CodigoProducto).IsRequired().HasMaxLength(20);
            e.Property(x => x.Descripcion).HasMaxLength(255);
            e.Property(x => x.Lote).HasMaxLength(50);
            e.Property(x => x.CreatedAt).HasDefaultValueSql("NOW()");
            e.HasOne(x => x.Stock)
             .WithMany()
             .HasForeignKey(x => x.CodigoProducto)
             .HasPrincipalKey(s => s.CodigoProducto);
        });

        modelBuilder.Entity<InventarioSalida>(e =>
        {
            e.ToTable("inventario_salidas");
            e.HasKey(x => x.Id);
            e.Property(x => x.CodigoProducto).IsRequired().HasMaxLength(20);
            e.Property(x => x.Descripcion).HasMaxLength(255);
            e.Property(x => x.Lote).HasMaxLength(50);
            e.Property(x => x.PrecioVenta).HasColumnType("numeric(12,2)");
            e.Property(x => x.Utilidad).HasColumnType("numeric(12,2)");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("NOW()");
            e.HasOne(x => x.Stock)
             .WithMany()
             .HasForeignKey(x => x.CodigoProducto)
             .HasPrincipalKey(s => s.CodigoProducto);
        });
    }
}
