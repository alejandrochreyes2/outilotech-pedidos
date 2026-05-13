using Microsoft.EntityFrameworkCore;
using InventarioAPI.Data;
using InventarioAPI.DTOs;
using InventarioAPI.Models;

namespace InventarioAPI.Repositories;

public class InventarioRepository : IInventarioRepository
{
    private readonly InventarioDbContext _db;

    public InventarioRepository(InventarioDbContext db) => _db = db;

    // ── STOCK ────────────────────────────────────────────
    public async Task<IEnumerable<StockDto>> GetStockAsync(string? search, int page, int pageSize)
    {
        var query = _db.Stock.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s =>
                s.CodigoProducto.Contains(search.ToUpper()) ||
                s.Descripcion.ToUpper().Contains(search.ToUpper()));

        return await query
            .OrderBy(s => s.CodigoProducto)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => ToStockDto(s))
            .ToListAsync();
    }

    public async Task<StockDto?> GetStockByCodigoAsync(string codigo)
    {
        var s = await _db.Stock.AsNoTracking()
            .FirstOrDefaultAsync(x => x.CodigoProducto == codigo.ToUpper());
        return s is null ? null : ToStockDto(s);
    }

    public async Task<IEnumerable<StockDto>> GetStockBajoAsync(int umbral) =>
        await _db.Stock.AsNoTracking()
            .Where(s => s.StockActual < umbral)
            .OrderBy(s => s.StockActual)
            .Select(s => ToStockDto(s))
            .ToListAsync();

    public async Task<ResumenInventarioDto> GetResumenAsync()
    {
        var r = await _db.Stock.AsNoTracking()
            .GroupBy(_ => 1)
            .Select(g => new ResumenInventarioDto(
                g.Count(),
                g.Sum(s => s.StockActual),
                g.Sum(s => s.ImporteInventarioProveedor),
                g.Sum(s => s.Venta)
            )).FirstOrDefaultAsync();
        return r ?? new ResumenInventarioDto(0, 0, 0, 0);
    }

    // ── ENTRADAS ─────────────────────────────────────────
    public async Task<IEnumerable<EntradaDto>> GetEntradasAsync(DateOnly? desde, DateOnly? hasta, int page, int pageSize)
    {
        var query = _db.Entradas.AsNoTracking();
        if (desde.HasValue) query = query.Where(e => e.Fecha >= desde.Value);
        if (hasta.HasValue) query = query.Where(e => e.Fecha <= hasta.Value);
        return await query
            .OrderByDescending(e => e.Fecha).ThenByDescending(e => e.Id)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(e => ToEntradaDto(e)).ToListAsync();
    }

    public async Task<EntradaDto> CrearEntradaAsync(CrearEntradaDto dto)
    {
        // El trigger fn_entrada_actualiza_stock actualiza stock automáticamente
        var entrada = new InventarioEntrada
        {
            NroDocumento   = dto.NroDocumento,
            Fecha          = dto.Fecha,
            CodigoProducto = dto.CodigoProducto.ToUpper(),
            Descripcion    = dto.Descripcion,
            Lote           = dto.Lote,
            Cantidad       = dto.Cantidad,
            CreatedAt      = DateTime.UtcNow
        };
        _db.Entradas.Add(entrada);
        await _db.SaveChangesAsync();
        return ToEntradaDto(entrada);
    }

    // ── SALIDAS ──────────────────────────────────────────
    public async Task<IEnumerable<SalidaDto>> GetSalidasAsync(DateOnly? desde, DateOnly? hasta, int page, int pageSize)
    {
        var query = _db.Salidas.AsNoTracking();
        if (desde.HasValue) query = query.Where(s => s.Fecha >= desde.Value);
        if (hasta.HasValue) query = query.Where(s => s.Fecha <= hasta.Value);
        return await query
            .OrderByDescending(s => s.Fecha).ThenByDescending(s => s.Id)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(s => ToSalidaDto(s)).ToListAsync();
    }

    public async Task<SalidaDto> CrearSalidaAsync(CrearSalidaDto dto)
    {
        // El trigger fn_salida_valida_stock bloquea si no hay stock
        // El trigger fn_salida_actualiza_stock descuenta automáticamente
        var salida = new InventarioSalida
        {
            NroDocumento   = dto.NroDocumento,
            Fecha          = dto.Fecha,
            CodigoProducto = dto.CodigoProducto.ToUpper(),
            Descripcion    = dto.Descripcion,
            Lote           = dto.Lote,
            Cantidad       = dto.Cantidad,
            PrecioVenta    = dto.PrecioVenta,
            Utilidad       = dto.Utilidad,
            CreatedAt      = DateTime.UtcNow
        };
        _db.Salidas.Add(salida);
        await _db.SaveChangesAsync();
        return ToSalidaDto(salida);
    }

    // ── Mappers ──────────────────────────────────────────
    private static StockDto ToStockDto(InventarioStock s) => new(
        s.Id, s.CodigoProducto, s.Descripcion, s.Lote,
        s.Entradas, s.Salidas, s.StockActual,
        s.CostoUnitario, s.PrecioVenta,
        s.ImporteInventarioProveedor, s.Venta, s.UpdatedAt);

    private static EntradaDto ToEntradaDto(InventarioEntrada e) => new(
        e.Id, e.NroDocumento, e.Fecha, e.CodigoProducto,
        e.Descripcion, e.Lote, e.Cantidad, e.CreatedAt);

    private static SalidaDto ToSalidaDto(InventarioSalida s) => new(
        s.Id, s.NroDocumento, s.Fecha, s.CodigoProducto,
        s.Descripcion, s.Lote, s.Cantidad,
        s.PrecioVenta, s.Utilidad, s.CreatedAt);
}
