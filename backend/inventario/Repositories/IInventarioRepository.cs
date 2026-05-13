using InventarioAPI.DTOs;

namespace InventarioAPI.Repositories;

public interface IInventarioRepository
{
    // Stock
    Task<IEnumerable<StockDto>> GetStockAsync(string? search, int page, int pageSize);
    Task<StockDto?> GetStockByCodigoAsync(string codigo);
    Task<IEnumerable<StockDto>> GetStockBajoAsync(int umbral);
    Task<ResumenInventarioDto> GetResumenAsync();

    // Entradas
    Task<IEnumerable<EntradaDto>> GetEntradasAsync(DateOnly? desde, DateOnly? hasta, int page, int pageSize);
    Task<EntradaDto> CrearEntradaAsync(CrearEntradaDto dto);

    // Salidas
    Task<IEnumerable<SalidaDto>> GetSalidasAsync(DateOnly? desde, DateOnly? hasta, int page, int pageSize);
    Task<SalidaDto> CrearSalidaAsync(CrearSalidaDto dto);
}
