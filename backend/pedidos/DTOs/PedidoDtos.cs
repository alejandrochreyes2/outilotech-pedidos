namespace PedidosAPI.DTOs
{
    public record PedidoCreateDto(string Cliente, decimal Total);
    public record PedidoResponseDto(int Id, string Cliente, decimal Total, DateTime Fecha);
}
