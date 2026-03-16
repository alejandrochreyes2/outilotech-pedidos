namespace PagosAPI.DTOs
{
    public record PagoCreateDto(int PedidoId, decimal Monto);
    public record PagoResponseDto(int Id, int PedidoId, decimal Monto, string Estado, DateTime Fecha);
}
