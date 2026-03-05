var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHealthChecks(); // Para el endpoint /health

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.MapControllers();
app.MapHealthChecks("/health"); // Endpoint de health check

// Endpoint de status personalizado
app.MapGet("/status", () => new
{
    service = "pagos",
    status = "OK",
    timestamp = DateTime.UtcNow
});

app.Run();