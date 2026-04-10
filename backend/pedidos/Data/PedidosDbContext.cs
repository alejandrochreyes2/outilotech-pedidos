using Microsoft.EntityFrameworkCore;
using PedidosAPI.Models;

namespace PedidosAPI.Data;

public class PedidosDbContext : DbContext
{
    public PedidosDbContext(DbContextOptions<PedidosDbContext> options)
        : base(options) { }

    public DbSet<Pedido> Pedidos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Cliente).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Total).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Fecha).HasDefaultValueSql("NOW()");
            entity.Property(e => e.Email).HasMaxLength(200).HasDefaultValue("");
            entity.Property(e => e.Telefono).HasMaxLength(50).HasDefaultValue("");
            entity.Property(e => e.Nombre).HasMaxLength(100).HasDefaultValue("");
            entity.Property(e => e.Apellido).HasMaxLength(100).HasDefaultValue("");
            entity.Property(e => e.Empresa).HasMaxLength(200).HasDefaultValue("");
            entity.Property(e => e.Ciudad).HasMaxLength(100).HasDefaultValue("");
            entity.Property(e => e.Direccion).HasMaxLength(300).HasDefaultValue("");
            entity.Property(e => e.Barrio).HasMaxLength(100).HasDefaultValue("");
            entity.Property(e => e.TipoId).HasMaxLength(10).HasDefaultValue("");
            entity.Property(e => e.NumeroId).HasMaxLength(50).HasDefaultValue("");
            entity.Property(e => e.MetodoEnvio).HasMaxLength(50).HasDefaultValue("domicilio");
            entity.Property(e => e.MetodoPago).HasMaxLength(50).HasDefaultValue("tarjeta");
            entity.Property(e => e.ItemsJson).HasColumnType("text").HasDefaultValue("[]");
            entity.Property(e => e.Estado).HasMaxLength(50).HasDefaultValue("Completado");
        });
    }
}
