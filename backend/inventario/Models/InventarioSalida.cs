namespace InventarioAPI.Models;

public class InventarioSalida
{
    public int Id { get; set; }
    public int NroDocumento { get; set; }
    public DateOnly Fecha { get; set; }
    public string CodigoProducto { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string? Lote { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioVenta { get; set; }
    public decimal Utilidad { get; set; }
    public DateTime CreatedAt { get; set; }

    public InventarioStock? Stock { get; set; }
}
