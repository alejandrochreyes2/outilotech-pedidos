using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using PedidosAPI.Data;
using PedidosAPI.Repositories;
using PedidosAPI.Models;
using PedidosAPI.DTOs;

var builder = WebApplication.CreateBuilder(args);

// Leer JWT config antes de registrar servicios (evita null con UseSecurityTokenValidators)
var jwtKey      = builder.Configuration["Jwt:Key"]      ?? "ToyotaSecretKey2026SuperSegura!MínimoCincuentaCaracteres!!";
var jwtIssuer   = builder.Configuration["Jwt:Issuer"]   ?? "toyota-pedidos-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "toyota-pedidos-client";

Console.WriteLine($"[JWT CONFIG] Key len={jwtKey.Length} Issuer={jwtIssuer} Audience={jwtAudience}");

// DbContext PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("PostgreSQL")
    ?? "Host=postgres;Port=5432;Database=toyota_db;Username=toyota_user;Password=Toyota2026!";
builder.Services.AddDbContext<PedidosDbContext>(options =>
    options.UseNpgsql(connectionString));

// Repositories
builder.Services.AddScoped<IPedidoRepository, PedidoRepository>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"[AUTH] Failed: {context.Exception.GetType().Name}: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("[AUTH] Token validated OK");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Pedidos API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name        = "Authorization",
        Type        = SecuritySchemeType.Http,
        Scheme      = "bearer",
        BearerFormat = "JWT",
        In          = ParameterLocation.Header,
        Description = "Ingresa el token JWT. Ejemplo: Bearer {tu-token}"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PedidosDbContext>();
    db.Database.EnsureCreated();
}

// Middleware global de excepciones
app.Use(async (context, next) =>
{
    try
    {
        await next(context);
    }
    catch (Exception ex)
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error no controlado: {Message}", ex.Message);
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            error   = "Error interno del servidor",
            detalle = app.Environment.IsDevelopment() ? ex.Message : "Contacte al administrador"
        });
    }
});

app.UseAuthentication();
app.UseAuthorization();
app.MapHealthChecks("/health");

// GET / — Admin, Vendedor, User
app.MapGet("/", async (IPedidoRepository repo, ILogger<Program> logger) =>
{
    logger.LogInformation("[PEDIDOS] GET all pedidos");
    var pedidos = await repo.GetAllAsync();
    return Results.Ok(pedidos.Select(p => new PedidoResponseDto(p.Id, p.Cliente, p.Total, p.Fecha)));
}).RequireAuthorization(p => p.RequireRole("Admin", "Vendedor", "User"));

// POST / — Admin y Vendedor
app.MapPost("/", async (PedidoCreateDto dto, IPedidoRepository repo, ILogger<Program> logger) =>
{
    logger.LogInformation("[PEDIDOS] POST cliente={Cliente} total={Total}", dto.Cliente, dto.Total);
    var pedido = new Pedido { Cliente = dto.Cliente, Total = dto.Total };
    await repo.CreateAsync(pedido);
    return Results.Created($"/{pedido.Id}", new PedidoResponseDto(pedido.Id, pedido.Cliente, pedido.Total, pedido.Fecha));
}).RequireAuthorization(p => p.RequireRole("Admin", "Vendedor"));

app.UseSwagger();
app.UseSwaggerUI();
app.Run();
