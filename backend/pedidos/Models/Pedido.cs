namespace PedidosAPI.Models
{
    public class Pedido
    {
        public int Id { get; set; }
        public string Cliente { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        // Datos de contacto
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;

        // Datos de entrega
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Empresa { get; set; } = string.Empty;
        public string Ciudad { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Barrio { get; set; } = string.Empty;
        public string TipoId { get; set; } = string.Empty;
        public string NumeroId { get; set; } = string.Empty;

        // Método de envío y pago
        public string MetodoEnvio { get; set; } = "domicilio";
        public string MetodoPago { get; set; } = "tarjeta";

        // Productos comprados (JSON)
        public string ItemsJson { get; set; } = "[]";

        public string Estado { get; set; } = "Completado";
    }
}
