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

var jwtKey      = builder.Configuration["Jwt:Key"]      ?? "ToyotaSecretKey2026SuperSegura!MínimoCincuentaCaracteres!!";
var jwtIssuer   = builder.Configuration["Jwt:Issuer"]   ?? "toyota-pedidos-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "toyota-pedidos-client";

Console.WriteLine($"[JWT CONFIG] Key len={jwtKey.Length} Issuer={jwtIssuer} Audience={jwtAudience}");

var useInMemory = builder.Configuration["USE_INMEMORY"] == "true";
if (useInMemory)
{
    builder.Services.AddDbContext<PedidosDbContext>(options =>
        options.UseInMemoryDatabase("PedidosCloud"));
}
else
{
    var connectionString = builder.Configuration.GetConnectionString("PostgreSQL")
        ?? "Host=postgres;Port=5432;Database=pedidos_db;Username=toyota_user;Password=Toyota2026!";
    builder.Services.AddDbContext<PedidosDbContext>(options =>
        options.UseNpgsql(connectionString));
}

builder.Services.AddScoped<IPedidoRepository, PedidoRepository>();

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

// Crear/migrar tablas al iniciar (agrega columnas nuevas si no existen)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PedidosDbContext>();
    try
    {
        db.Database.EnsureCreated();
        // Agregar columnas nuevas si la tabla ya existe (ALTER TABLE seguro)
        var conn = db.Database.GetDbConnection();
        conn.Open();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='Email') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""Email"" VARCHAR(200) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='Telefono') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""Telefono"" VARCHAR(50) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='Nombre') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""Nombre"" VARCHAR(100) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='Apellido') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""Apellido"" VARCHAR(100) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='Empresa') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""Empresa"" VARCHAR(200) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='Ciudad') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""Ciudad"" VARCHAR(100) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='Direccion') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""Direccion"" VARCHAR(300) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='Barrio') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""Barrio"" VARCHAR(100) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='TipoId') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""TipoId"" VARCHAR(10) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='NumeroId') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""NumeroId"" VARCHAR(50) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='MetodoEnvio') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""MetodoEnvio"" VARCHAR(50) NOT NULL DEFAULT 'domicilio';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='MetodoPago') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""MetodoPago"" VARCHAR(50) NOT NULL DEFAULT 'tarjeta';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='ItemsJson') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""ItemsJson"" TEXT NOT NULL DEFAULT '[]';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Pedidos' AND column_name='Estado') THEN
                    ALTER TABLE ""Pedidos"" ADD COLUMN ""Estado"" VARCHAR(50) NOT NULL DEFAULT 'Completado';
                END IF;
            END $$;
        ";
        cmd.ExecuteNonQuery();
        conn.Close();
        Console.WriteLine("[DB] Columnas verificadas/agregadas correctamente.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB WARNING] {ex.Message}");
    }
}

app.Use(async (context, next) =>
{
    try { await next(context); }
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

// GET / — devuelve lista completa con todos los campos
app.MapGet("/", async (IPedidoRepository repo, ILogger<Program> logger) =>
{
    logger.LogInformation("[PEDIDOS] GET all pedidos");
    var pedidos = await repo.GetAllAsync();
    return Results.Ok(pedidos.Select(p => new PedidoDetalleDto(
        p.Id, p.Cliente, p.Total, p.Fecha,
        p.Email, p.Telefono, p.Nombre, p.Apellido,
        p.Empresa, p.Ciudad, p.Direccion, p.Barrio,
        p.TipoId, p.NumeroId, p.MetodoEnvio, p.MetodoPago,
        p.ItemsJson, p.Estado
    )));
}).RequireAuthorization(p => p.RequireRole("Admin", "Vendedor", "User"));

// POST / — Admin y Vendedor (manual)
app.MapPost("/", async (PedidoCreateDto dto, IPedidoRepository repo, ILogger<Program> logger) =>
{
    logger.LogInformation("[PEDIDOS] POST cliente={Cliente} total={Total}", dto.Cliente, dto.Total);
    var pedido = new Pedido { Cliente = dto.Cliente, Total = dto.Total };
    await repo.CreateAsync(pedido);
    return Results.Created($"/{pedido.Id}", new PedidoResponseDto(pedido.Id, pedido.Cliente, pedido.Total, pedido.Fecha));
}).RequireAuthorization(p => p.RequireRole("Admin", "Vendedor"));

// POST /checkout — público, guarda compra con todos los datos del formulario
app.MapPost("/checkout", async (PedidoCheckoutDto dto, IPedidoRepository repo, ILogger<Program> logger) =>
{
    logger.LogInformation("[CHECKOUT] cliente={Cliente} total={Total} email={Email} ciudad={Ciudad} pago={Pago}",
        dto.Cliente, dto.Total, dto.Email, dto.Ciudad, dto.MetodoPago);

    var pedido = new Pedido
    {
        Cliente     = string.IsNullOrEmpty(dto.Cliente) ? $"{dto.Nombre} {dto.Apellido}".Trim() : dto.Cliente,
        Total       = dto.Total,
        Email       = dto.Email ?? string.Empty,
        Telefono    = dto.Telefono ?? string.Empty,
        Nombre      = dto.Nombre ?? string.Empty,
        Apellido    = dto.Apellido ?? string.Empty,
        Empresa     = dto.Empresa ?? string.Empty,
        Ciudad      = dto.Ciudad ?? string.Empty,
        Direccion   = dto.Direccion ?? string.Empty,
        Barrio      = dto.Barrio ?? string.Empty,
        TipoId      = dto.TipoId ?? string.Empty,
        NumeroId    = dto.NumeroId ?? string.Empty,
        MetodoEnvio = dto.MetodoEnvio ?? "domicilio",
        MetodoPago  = dto.MetodoPago ?? "tarjeta",
        ItemsJson   = dto.ItemsJson ?? "[]",
        Estado      = "Completado"
    };
    await repo.CreateAsync(pedido);
    return Results.Created($"/{pedido.Id}", new PedidoDetalleDto(
        pedido.Id, pedido.Cliente, pedido.Total, pedido.Fecha,
        pedido.Email, pedido.Telefono, pedido.Nombre, pedido.Apellido,
        pedido.Empresa, pedido.Ciudad, pedido.Direccion, pedido.Barrio,
        pedido.TipoId, pedido.NumeroId, pedido.MetodoEnvio, pedido.MetodoPago,
        pedido.ItemsJson, pedido.Estado
    ));
});

app.UseSwagger();
app.UseSwaggerUI();
app.Run();
