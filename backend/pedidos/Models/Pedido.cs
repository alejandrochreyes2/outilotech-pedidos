namespace PedidosAPI.Models
{
    public class Pedido
    {
        public int Id { get; set; }
        public string Cliente { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}
