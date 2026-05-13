using Microsoft.AspNetCore.Mvc;
using InventarioAPI.DTOs;
using InventarioAPI.Repositories;

namespace InventarioAPI.Controllers;

[ApiController]
[Route("api/inventario")]
public class InventarioController : ControllerBase
{
    private readonly IInventarioRepository _repo;
    public InventarioController(IInventarioRepository repo) => _repo = repo;

    // ── ENDPOINT 1: GET /api/inventario/stock ─────────────────────────────
    // Lista todos los productos con paginación y búsqueda opcional
    // Angular: GET /api/inventario/stock?search=cable&page=1&pageSize=50
    [HttpGet("stock")]
    public async Task<IActionResult> GetStock(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        if (page < 1 || pageSize is < 1 or > 200) return BadRequest("Parámetros de paginación inválidos.");
        var resultado = await _repo.GetStockAsync(search, page, pageSize);
        return Ok(resultado);
    }

    // ── ENDPOINT 2: GET /api/inventario/stock/{codigo} ────────────────────
    // Detalle de un producto por código (ej: A001)
    [HttpGet("stock/{codigo}")]
    public async Task<IActionResult> GetProducto(string codigo)
    {
        var producto = await _repo.GetStockByCodigoAsync(codigo);
        return producto is null ? NotFound($"Producto '{codigo}' no encontrado.") : Ok(producto);
    }

    // ── ENDPOINT 3: GET /api/inventario/stock/bajo?umbral=3 ──────────────
    // Productos con stock por debajo del umbral (alerta de reabastecimiento)
    [HttpGet("stock/bajo")]
    public async Task<IActionResult> GetStockBajo([FromQuery] int umbral = 3)
    {
        var productos = await _repo.GetStockBajoAsync(umbral);
        return Ok(productos);
    }

    // ── ENDPOINT 4: GET /api/inventario/resumen ───────────────────────────
    // Dashboard: total productos, unidades, valor en costo y ventas
    [HttpGet("resumen")]
    public async Task<IActionResult> GetResumen()
    {
        var resumen = await _repo.GetResumenAsync();
        return Ok(resumen);
    }

    // ── ENDPOINT 5: GET /api/inventario/entradas ─────────────────────────
    // Historial de compras con filtro por fecha
    [HttpGet("entradas")]
    public async Task<IActionResult> GetEntradas(
        [FromQuery] DateOnly? desde,
        [FromQuery] DateOnly? hasta,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var entradas = await _repo.GetEntradasAsync(desde, hasta, page, pageSize);
        return Ok(entradas);
    }

    // ── ENDPOINT 6: POST /api/inventario/entradas ────────────────────────
    // Registra una compra/recepción → trigger suma stock automáticamente
    [HttpPost("entradas")]
    public async Task<IActionResult> CrearEntrada([FromBody] CrearEntradaDto dto)
    {
        if (dto.Cantidad <= 0) return BadRequest("La cantidad debe ser mayor a 0.");
        try
        {
            var entrada = await _repo.CrearEntradaAsync(dto);
            return CreatedAtAction(nameof(GetEntradas), new { }, entrada);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.InnerException?.Message ?? ex.Message });
        }
    }

    // ── ENDPOINT 7: GET /api/inventario/salidas ───────────────────────────
    // Historial de ventas con filtro por fecha
    [HttpGet("salidas")]
    public async Task<IActionResult> GetSalidas(
        [FromQuery] DateOnly? desde,
        [FromQuery] DateOnly? hasta,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var salidas = await _repo.GetSalidasAsync(desde, hasta, page, pageSize);
        return Ok(salidas);
    }

    // ── ENDPOINT 8 (BONUS): POST /api/inventario/salidas ─────────────────
    // Registra una venta → trigger valida stock y descuenta automáticamente
    // Lanza 400 si stock insuficiente (error del trigger PostgreSQL P0001)
    [HttpPost("salidas")]
    public async Task<IActionResult> CrearSalida([FromBody] CrearSalidaDto dto)
    {
        if (dto.Cantidad <= 0) return BadRequest("La cantidad debe ser mayor a 0.");
        try
        {
            var salida = await _repo.CrearSalidaAsync(dto);
            return CreatedAtAction(nameof(GetSalidas), new { }, salida);
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            // El trigger PostgreSQL lanza P0001 cuando no hay stock
            return BadRequest(new { error = msg });
        }
    }
}
