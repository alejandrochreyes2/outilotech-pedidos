using Microsoft.EntityFrameworkCore;
using InventarioAPI.Data;
using InventarioAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

var pgConnection = builder.Configuration.GetConnectionString("PostgreSQL")
    ?? "Host=postgres;Port=5432;Database=outiltech_db;Username=toyota_user;Password=Toyota2026!";

builder.Services.AddDbContext<InventarioDbContext>(options =>
    options.UseNpgsql(pgConnection));

builder.Services.AddScoped<IInventarioRepository, InventarioRepository>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
    options.AddPolicy("Angular", policy =>
        policy.WithOrigins(
                "http://localhost:4200",
                "https://outiltech.co",
                "https://www.outiltech.co")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Angular");
app.UseAuthorization();
app.MapControllers();

// Auto-apply migrations al arrancar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InventarioDbContext>();
    db.Database.EnsureCreated();
}

app.Run();
