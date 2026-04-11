namespace PagosAPI.Models
{
    public class Pago
    {
        public int Id { get; set; }
        public int PedidoId { get; set; }
        public decimal Monto { get; set; }
        public string Moneda { get; set; } = "COP";
        public string Metodo { get; set; } = "tarjeta";
        public string Estado { get; set; } = "Aprobado";
        public string Referencia { get; set; } = string.Empty;
        public string Banco { get; set; } = string.Empty;
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}
