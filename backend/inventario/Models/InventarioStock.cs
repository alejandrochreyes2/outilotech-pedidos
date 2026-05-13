namespace InventarioAPI.Models;

public class InventarioStock
{
    public int Id { get; set; }
    public string CodigoProducto { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string? Lote { get; set; }
    public int Entradas { get; set; }
    public int Salidas { get; set; }
    public int StockActual { get; set; }
    public decimal CostoUnitario { get; set; }
    public decimal PrecioVenta { get; set; }
    public decimal ImporteInventarioProveedor { get; set; }
    public decimal Venta { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
