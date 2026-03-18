using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using PagosAPI.Data;
using PagosAPI.Repositories;
using PagosAPI.Models;
using PagosAPI.DTOs;

var builder = WebApplication.CreateBuilder(args);

// Leer JWT config antes de registrar servicios (evita null con UseSecurityTokenValidators)
var jwtKey      = builder.Configuration["Jwt:Key"]      ?? "ToyotaSecretKey2026SuperSegura!MínimoCincuentaCaracteres!!";
var jwtIssuer   = builder.Configuration["Jwt:Issuer"]   ?? "toyota-pedidos-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "toyota-pedidos-client";

Console.WriteLine($"[JWT CONFIG] Key len={jwtKey.Length} Issuer={jwtIssuer} Audience={jwtAudience}");

// DbContext — PostgreSQL local o InMemory para cloud demo
var useInMemory = builder.Configuration["USE_INMEMORY"] == "true";
if (useInMemory)
{
    builder.Services.AddDbContext<PagosDbContext>(options =>
        options.UseInMemoryDatabase("PagosCloud"));
}
else
{
    var connectionString = builder.Configuration.GetConnectionString("PostgreSQL")
        ?? "Host=postgres;Port=5432;Database=pagos_db;Username=toyota_user;Password=Toyota2026!";
    builder.Services.AddDbContext<PagosDbContext>(options =>
        options.UseNpgsql(connectionString));
}

// Repositories
builder.Services.AddScoped<IPagoRepository, PagoRepository>();

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
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Pagos API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
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
    var db = scope.ServiceProvider.GetRequiredService<PagosDbContext>();
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

// GET / — solo Admin
app.MapGet("/", async (IPagoRepository repo, ILogger<Program> logger) =>
{
    logger.LogInformation("[PAGOS] GET all pagos");
    var pagos = await repo.GetAllAsync();
    return Results.Ok(pagos.Select(p => new PagoResponseDto(p.Id, p.PedidoId, p.Monto, p.Estado, p.Fecha)));
}).RequireAuthorization(p => p.RequireRole("Admin"));

// POST / — solo Admin
app.MapPost("/", async (PagoCreateDto dto, IPagoRepository repo, ILogger<Program> logger) =>
{
    logger.LogInformation("[PAGOS] POST pedidoId={PedidoId} monto={Monto}", dto.PedidoId, dto.Monto);
    var pago = new Pago { PedidoId = dto.PedidoId, Monto = dto.Monto };
    await repo.CreateAsync(pago);
    return Results.Created($"/{pago.Id}", new PagoResponseDto(pago.Id, pago.PedidoId, pago.Monto, pago.Estado, pago.Fecha));
}).RequireAuthorization(p => p.RequireRole("Admin"));

app.UseSwagger();
app.UseSwaggerUI();
app.Run();
