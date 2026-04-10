namespace PedidosAPI.DTOs
{
    // DTO simple para crear desde el panel admin
    public record PedidoCreateDto(string Cliente, decimal Total);

    // DTO completo para el flujo de checkout del carrito
    public record PedidoCheckoutDto(
        string Cliente, decimal Total,
        string Email, string Telefono,
        string Nombre, string Apellido, string Empresa,
        string Ciudad, string Direccion, string Barrio,
        string TipoId, string NumeroId,
        string MetodoEnvio, string MetodoPago,
        string ItemsJson
    );

    // DTO de respuesta básica (compatibilidad)
    public record PedidoResponseDto(int Id, string Cliente, decimal Total, DateTime Fecha);

    // DTO de respuesta completa con todos los campos
    public record PedidoDetalleDto(
        int Id, string Cliente, decimal Total, DateTime Fecha,
        string Email, string Telefono, string Nombre, string Apellido,
        string Empresa, string Ciudad, string Direccion, string Barrio,
        string TipoId, string NumeroId, string MetodoEnvio, string MetodoPago,
        string ItemsJson, string Estado
    );
}
