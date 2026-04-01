var builder = WebApplication.CreateBuilder(args);

// Agregar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.WithOrigins(
            "http://localhost",
            "http://localhost:4200",
            "http://localhost:80",
            "https://gentle-water-0ba98b90f.1.azurestaticapps.net",
            "https://outiltech.co",
            "https://www.outiltech.co"
        )
        .AllowAnyMethod()
        .AllowAnyHeader());
});

builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
builder.Services.AddHealthChecks();
var app = builder.Build();

app.UseCors("AllowAll");
app.MapHealthChecks("/health");
app.MapReverseProxy();

Console.WriteLine("╔══════════════════════════════════════════════════╗");
Console.WriteLine("║ 🌐 API Gateway iniciado en puerto 5000           ║");
Console.WriteLine("║   GET  /health                                  ║");
Console.WriteLine("║ Rutas disponibles:                               ║");
Console.WriteLine("║   POST /api/usuarios/auth/login                  ║");
Console.WriteLine("║   POST /api/usuarios/auth/register               ║");
Console.WriteLine("║   GET  /api/pedidos/...                          ║");
Console.WriteLine("║   GET  /api/pagos/...                            ║");
Console.WriteLine("╚══════════════════════════════════════════════════╝");

app.Run();
