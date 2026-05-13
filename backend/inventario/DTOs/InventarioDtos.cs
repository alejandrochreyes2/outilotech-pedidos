namespace InventarioAPI.DTOs;

// ── STOCK ────────────────────────────────────────────────
public record StockDto(
    int Id,
    string CodigoProducto,
    string Descripcion,
    string? Lote,
    int Entradas,
    int Salidas,
    int StockActual,
    decimal CostoUnitario,
    decimal PrecioVenta,
    decimal ImporteInventarioProveedor,
    decimal Venta,
    DateTime UpdatedAt
);

// ── ENTRADAS ─────────────────────────────────────────────
public record EntradaDto(
    int Id,
    int NroDocumento,
    DateOnly Fecha,
    string CodigoProducto,
    string? Descripcion,
    string? Lote,
    int Cantidad,
    DateTime CreatedAt
);

public record CrearEntradaDto(
    int NroDocumento,
    DateOnly Fecha,
    string CodigoProducto,
    string? Descripcion,
    string? Lote,
    int Cantidad
);

// ── SALIDAS ──────────────────────────────────────────────
public record SalidaDto(
    int Id,
    int NroDocumento,
    DateOnly Fecha,
    string CodigoProducto,
    string? Descripcion,
    string? Lote,
    int Cantidad,
    decimal PrecioVenta,
    decimal Utilidad,
    DateTime CreatedAt
);

public record CrearSalidaDto(
    int NroDocumento,
    DateOnly Fecha,
    string CodigoProducto,
    string? Descripcion,
    string? Lote,
    int Cantidad,
    decimal PrecioVenta,
    decimal Utilidad
);

// ── RESUMEN ──────────────────────────────────────────────
public record ResumenInventarioDto(
    int TotalProductos,
    int UnidadesTotales,
    decimal ValorCostoTotal,
    decimal ValorVentasTotal
);
