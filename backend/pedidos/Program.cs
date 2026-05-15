using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Collections.Concurrent;
using Npgsql;
using PedidosAPI.Data;
using PedidosAPI.Repositories;
using PedidosAPI.Models;
using PedidosAPI.DTOs;

var builder = WebApplication.CreateBuilder(args);

var jwtKey      = builder.Configuration["Jwt:Key"]      ?? "OutiltechSecretKey2026SuperSegura!MínimoCincuentaCaracteres!!";
var jwtIssuer   = builder.Configuration["Jwt:Issuer"]   ?? "outiltech-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "outiltech-client";
var emailUser   = builder.Configuration["Email:User"]        ?? "";
var emailPass   = builder.Configuration["Email:Password"]    ?? "";
var emailAdmin  = builder.Configuration["Email:AdminEmail"]  ?? "alejandrochreyes2@gmail.com";

Console.WriteLine($"[JWT CONFIG] Key len={jwtKey.Length} Issuer={jwtIssuer} Audience={jwtAudience}");

var pgConnectionString = builder.Configuration.GetConnectionString("PostgreSQL")
    ?? "Host=postgres;Port=5432;Database=outiltech_db;Username=toyota_user;Password=Toyota2026!";

var useInMemory = builder.Configuration["USE_INMEMORY"] == "true";
if (useInMemory)
{
    builder.Services.AddDbContext<PedidosDbContext>(options =>
        options.UseInMemoryDatabase("PedidosCloud"));
}
else
{
    builder.Services.AddDbContext<PedidosDbContext>(options =>
        options.UseNpgsql(pgConnectionString));
}

builder.Services.AddScoped<IPedidoRepository, PedidoRepository>();
builder.Services.AddHttpClient(); // Para sync a Supabase

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

// Verificar y agregar columnas al iniciar (idempotente)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PedidosDbContext>();
    try
    {
        db.Database.EnsureCreated();
        var conn = db.Database.GetDbConnection();
        conn.Open();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='Email') THEN
                    ALTER TABLE pedidos ADD COLUMN ""Email"" VARCHAR(200) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='Telefono') THEN
                    ALTER TABLE pedidos ADD COLUMN ""Telefono"" VARCHAR(50) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='Nombre') THEN
                    ALTER TABLE pedidos ADD COLUMN ""Nombre"" VARCHAR(100) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='Apellido') THEN
                    ALTER TABLE pedidos ADD COLUMN ""Apellido"" VARCHAR(100) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='Empresa') THEN
                    ALTER TABLE pedidos ADD COLUMN ""Empresa"" VARCHAR(200) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='Ciudad') THEN
                    ALTER TABLE pedidos ADD COLUMN ""Ciudad"" VARCHAR(100) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='Direccion') THEN
                    ALTER TABLE pedidos ADD COLUMN ""Direccion"" VARCHAR(300) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='Barrio') THEN
                    ALTER TABLE pedidos ADD COLUMN ""Barrio"" VARCHAR(100) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='TipoId') THEN
                    ALTER TABLE pedidos ADD COLUMN ""TipoId"" VARCHAR(10) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='NumeroId') THEN
                    ALTER TABLE pedidos ADD COLUMN ""NumeroId"" VARCHAR(50) NOT NULL DEFAULT '';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='MetodoEnvio') THEN
                    ALTER TABLE pedidos ADD COLUMN ""MetodoEnvio"" VARCHAR(50) NOT NULL DEFAULT 'domicilio';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='MetodoPago') THEN
                    ALTER TABLE pedidos ADD COLUMN ""MetodoPago"" VARCHAR(50) NOT NULL DEFAULT 'tarjeta';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='ItemsJson') THEN
                    ALTER TABLE pedidos ADD COLUMN ""ItemsJson"" TEXT NOT NULL DEFAULT '[]';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='Estado') THEN
                    ALTER TABLE pedidos ADD COLUMN ""Estado"" VARCHAR(50) NOT NULL DEFAULT 'Completado';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pedidos' AND column_name='ComprobanteNequi') THEN
                    ALTER TABLE pedidos ADD COLUMN ""ComprobanteNequi"" VARCHAR(500) NOT NULL DEFAULT '';
                END IF;
            END $$;
        ";
        cmd.ExecuteNonQuery();
        Console.WriteLine("[DB] Columnas verificadas/agregadas correctamente.");

        // ── Crear tabla inventario_productos (idempotente) ──
        using var cmd2 = conn.CreateCommand();
        cmd2.CommandText = @"
            CREATE TABLE IF NOT EXISTS inventario_productos (
                id              SERIAL PRIMARY KEY,
                producto_id     VARCHAR(100) NOT NULL UNIQUE,
                nombre          VARCHAR(300) NOT NULL,
                marca           VARCHAR(100) NOT NULL,
                categoria       VARCHAR(100) NOT NULL,
                modelo          VARCHAR(200) NOT NULL,
                año             INTEGER NOT NULL DEFAULT 2025,
                precio          DECIMAL(12,2) NOT NULL DEFAULT 0,
                precio_anterior DECIMAL(12,2),
                unidades        INTEGER NOT NULL DEFAULT 5,
                disponibilidad  VARCHAR(2) NOT NULL DEFAULT 'Si',
                garantia        VARCHAR(100) NOT NULL DEFAULT '1 año',
                slug            VARCHAR(200) NOT NULL,
                badge           VARCHAR(50),
                creado_en       TIMESTAMP DEFAULT NOW(),
                actualizado_en  TIMESTAMP DEFAULT NOW()
            );
            INSERT INTO inventario_productos (producto_id,nombre,marca,categoria,modelo,año,precio,precio_anterior,unidades,disponibilidad,garantia,slug,badge) VALUES
            ('sam-s26u-512','Samsung S26 Ultra 512GB','Samsung','Samsung','Galaxy S Ultra',2025,5300000,5100000,5,'Si','1 año Samsung','samsung-s26-ultra-512gb','NUEVO'),
            ('pencil-2gen','Apple Pencil 2da Gen','Apple','Accesorios','Apple Pencil',2022,450000,250000,10,'Si','1 año Apple','apple-pencil-2da-gen','NUEVO'),
            ('pencil-pro','Apple Pencil Pro','Apple','Accesorios','Apple Pencil',2024,680000,480000,8,'Si','1 año Apple','apple-pencil-pro','NUEVO'),
            ('mbneo-256-azul','MacBook Neo 256GB Azul','Apple','Mac','MacBook Neo',2025,2850000,2650000,5,'Si','1 año Apple','macbook-neo-256gb-azul','NUEVO'),
            ('mbneo-256-ama','MacBook Neo 256GB Amarilla','Apple','Mac','MacBook Neo',2025,2950000,2750000,5,'Si','1 año Apple','macbook-neo-256gb-amarilla','NUEVO'),
            ('mbneo-512-bla','MacBook Neo 512GB Blanca','Apple','Mac','MacBook Neo',2025,3300000,3100000,5,'Si','1 año Apple','macbook-neo-512gb-blanca','NUEVO'),
            ('mbpro14-m5-512','MacBook Pro 14"" M5 512GB','Apple','Mac','MacBook Pro',2025,6400000,6200000,3,'Si','1 año Apple','macbook-pro-14-m5-512gb','NUEVO'),
            ('mbpro14-m5-1tb','MacBook Pro 14"" M5 1TB','Apple','Mac','MacBook Pro',2025,7200000,7000000,2,'Si','1 año Apple','macbook-pro-14-m5-1tb','NUEVO'),
            ('mbair-m1-256','MacBook Air M1 256GB','Apple','Mac','MacBook Air',2020,2950000,2750000,3,'Si','1 año Apple','macbook-air-m1-256gb','OFERTA'),
            ('mbair-m4-512','MacBook Air M4 512GB','Apple','Mac','MacBook Air',2024,4700000,4500000,4,'Si','1 año Apple','macbook-air-m4-512gb','NUEVO'),
            ('mbair-m4-15-256','MacBook Air M4 15"" 256GB','Apple','Mac','MacBook Air',2024,4700000,4500000,4,'Si','1 año Apple','macbook-air-m4-15-256gb','NUEVO'),
            ('mbair-m5-512','MacBook Air 13"" M5 512GB 16RAM','Apple','Mac','MacBook Air',2025,5200000,5000000,3,'Si','1 año Apple','macbook-air-13-m5-512gb','NUEVO'),
            ('ipad-a16-128','iPad A16 128GB','Apple','iPad','iPad',2025,1600000,1400000,6,'Si','1 año Apple','ipad-a16-128gb','NUEVO'),
            ('ipadpro13-m5-256','iPad Pro 13"" M5 256GB','Apple','iPad','iPad Pro',2025,5100000,4900000,3,'Si','1 año Apple','ipad-pro-13-m5-256gb','NUEVO'),
            ('ipadpro11-m5-256','iPad 11 Pro M5 256GB','Apple','iPad','iPad Pro',2025,3950000,3750000,4,'Si','1 año Apple','ipad-11-pro-m5-256gb','NUEVO'),
            ('aw-s11-42-rosa','Watch Series 11 42mm Rosa','Apple','Watch','Apple Watch',2025,1750000,1550000,5,'Si','1 año Apple','apple-watch-s11-42mm-rosa','NUEVO'),
            ('aw-s11-46-gps','Watch Series 11 46mm GPS','Apple','Watch','Apple Watch',2025,1800000,1600000,5,'Si','1 año Apple','apple-watch-s11-46mm-gps','NUEVO'),
            ('aw-se2-44-cel','Watch SE Gen2 44mm Cellular','Apple','Watch','Apple Watch SE',2022,1250000,1050000,5,'Si','1 año Apple','apple-watch-se-gen2-44mm','NUEVO'),
            ('aw-ultra3-man','Watch Ultra 3 Manilla Metálica','Apple','Watch','Apple Watch Ultra',2025,3300000,3100000,2,'Si','1 año Apple','apple-watch-ultra-3-manilla','NUEVO'),
            ('aw-ultra3-neg','Watch Ultra 3 Negro','Apple','Watch','Apple Watch Ultra',2025,3150000,2950000,2,'Si','1 año Apple','apple-watch-ultra-3-negro','NUEVO'),
            ('iph13-128','iPhone 13 128GB','Apple','iPhone','iPhone Nuevo',2021,2200000,2000000,5,'Si','1 año Apple','iphone-13-128gb','NUEVO'),
            ('iph15-128','iPhone 15 128GB','Apple','iPhone','iPhone Nuevo',2023,2600000,2400000,5,'Si','1 año Apple','iphone-15-128gb','NUEVO'),
            ('iph15-512','iPhone 15 512GB','Apple','iPhone','iPhone Nuevo',2023,2950000,2750000,5,'Si','1 año Apple','iphone-15-512gb','NUEVO'),
            ('iph15plus-128','iPhone 15 Plus 128GB','Apple','iPhone','iPhone Nuevo',2023,2950000,2750000,4,'Si','1 año Apple','iphone-15-plus-128gb','NUEVO'),
            ('iph16-128-11m','iPhone 16 128GB - 11 meses','Apple','iPhone','iPhone Nuevo',2024,2850000,2650000,5,'Si','11 meses','iphone-16-128gb-activo','NUEVO'),
            ('iph16-128','iPhone 16 128GB','Apple','iPhone','iPhone Nuevo',2024,2950000,2750000,5,'Si','1 año Apple','iphone-16-128gb','NUEVO'),
            ('iph16pm-256','iPhone 16 Pro Max 256GB','Apple','iPhone','iPhone Nuevo',2024,4900000,4700000,4,'Si','1 año Apple','iphone-16-pro-max-256gb','NUEVO'),
            ('iph16pm-256-asi','iPhone 16 Pro Max Asis 256GB','Apple','iPhone','iPhone Nuevo',2024,4500000,4300000,4,'Si','1 año Apple','iphone-16-pro-max-asis','NUEVO'),
            ('iph17-256-11m','iPhone 17 256GB - 11 meses','Apple','iPhone','iPhone Nuevo',2025,3550000,3350000,5,'Si','11 meses','iphone-17-256gb-activo','NUEVO'),
            ('iph17-256','iPhone 17 256GB','Apple','iPhone','iPhone Nuevo',2025,3750000,3550000,5,'Si','1 año Apple','iphone-17-256gb','NUEVO'),
            ('iph17pro-256-nar','iPhone 17 Pro 256GB Naranja','Apple','iPhone','iPhone Nuevo',2025,5000000,4800000,4,'Si','Efectivo','iphone-17-pro-naranja','NUEVO'),
            ('iph17pm-256-nb','iPhone 17 Pro Max 256GB Nar/Az','Apple','iPhone','iPhone Nuevo',2025,5550000,5350000,4,'Si','1 año Apple','iphone-17-pro-max-naranja-azul','NUEVO'),
            ('iph17pm-256-bla','iPhone 17 Pro Max 256GB Blanco','Apple','iPhone','iPhone Nuevo',2025,5550000,5350000,4,'Si','1 año Apple','iphone-17-pro-max-blanco','NUEVO'),
            ('iph17pm-2tb','iPhone 17 Pro Max 2TB','Apple','iPhone','iPhone Nuevo',2025,8700000,8500000,2,'Si','1 año Apple','iphone-17-pro-max-2tb','NUEVO'),
            ('iph12-128-cpo','iPhone 12 128GB CPO','Apple','iPhone','iPhone CPO',2020,1600000,1400000,5,'Si','6 meses','iphone-12-128gb-cpo','CPO'),
            ('iph13-128-cpo','iPhone 13 128GB CPO','Apple','iPhone','iPhone CPO',2021,2000000,1800000,5,'Si','6 meses','iphone-13-128gb-cpo','CPO'),
            ('iph15pm-512-cpo','iPhone 15 Pro Max 512GB CPO','Apple','iPhone','iPhone CPO',2023,3900000,3700000,3,'Si','6 meses','iphone-15-pro-max-512gb-cpo','CPO'),
            ('iph15pm-1tb-cpo','iPhone 15 Pro Max 1TB CPO','Apple','iPhone','iPhone CPO',2023,4000000,3800000,3,'Si','6 meses','iphone-15-pro-max-1tb-cpo','CPO'),
            ('seg-es2','Patineta Segway ES2','Segway','Patinetas','Segway',2024,1580000,1380000,4,'Si','6 meses','segway-es2','PROMO'),
            ('seg-es3','Patineta Segway ES3','Segway','Patinetas','Segway',2024,1630000,1430000,4,'Si','6 meses','segway-es3','PROMO'),
            ('seg-e2','Patineta Segway E2','Segway','Patinetas','Segway',2024,1700000,1500000,3,'Si','6 meses','segway-e2','PROMO'),
            ('seg-c2pro','Patineta Segway C2 PRO','Segway','Patinetas','Segway',2024,1280000,1080000,4,'Si','6 meses','segway-c2-pro','PROMO'),
            ('airpods4-rep','AirPods 4 Réplica','Apple','AirPods','AirPods',2024,260000,60000,10,'Si','Sin garantía','airpods-4-replica','RÉPLICA'),
            ('airpodsp2-rep','AirPods Pro 2 Réplica','Apple','AirPods','AirPods',2023,260000,60000,10,'Si','Sin garantía','airpods-pro-2-replica','RÉPLICA'),
            ('airpodsp3-ori','AirPods Pro 3 Original','Apple','AirPods','AirPods',2025,1400000,1200000,5,'Si','1 año Apple','airpods-pro-3-original','NUEVO'),
            ('cubo-uni','Cubo Original Apple Unidad','Apple','Accesorios','Cargadores',2024,260000,60000,20,'Si','1 año Apple','cubo-apple-unidad','ACCESORIO'),
            ('cubo-x10','Cubo Original Apple Caja x10','Apple','Accesorios','Cargadores',2024,750000,550000,10,'Si','1 año Apple','cubo-apple-caja-x10','ACCESORIO'),
            ('cable-cc','Cable USB-C a C Original','Apple','Accesorios','Cables',2024,240000,40000,20,'Si','1 año Apple','cable-usbc-a-c','ACCESORIO'),
            ('cable-light','Cable Lightning Original','Apple','Accesorios','Cables',2023,235000,35000,20,'Si','1 año Apple','cable-lightning','ACCESORIO'),
            ('exh-ipad5-32','iPad 5th Gen 32GB Sim','Apple','Exhibición','iPad Exhibición',2017,650000,450000,2,'Si','4 meses','exh-ipad-5th-gen-32gb','EXHIBICIÓN'),
            ('exh-aws7','Watch Series 7 Exhibición','Apple','Exhibición','Watch Exhibición',2021,700000,500000,2,'Si','4 meses','exh-watch-series-7','EXHIBICIÓN'),
            ('exh-aws9','Watch Series 9 Exhibición','Apple','Exhibición','Watch Exhibición',2023,950000,750000,2,'Si','4 meses','exh-watch-series-9','EXHIBICIÓN'),
            ('exh-iph11-64','iPhone 11 64GB Exhibición','Apple','Exhibición','iPhone Exhibición',2019,850000,650000,3,'Si','4 meses','exh-iphone-11-64gb','EXHIBICIÓN'),
            ('exh-iph11-128','iPhone 11 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2019,1050000,850000,3,'Si','4 meses','exh-iphone-11-128gb','EXHIBICIÓN'),
            ('exh-iph11p-64','iPhone 11 Pro 64GB Exhibición','Apple','Exhibición','iPhone Exhibición',2019,1200000,1000000,2,'Si','4 meses','exh-iphone-11-pro-64gb','EXHIBICIÓN'),
            ('exh-iph11p-128','iPhone 11 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2019,1300000,1100000,2,'Si','4 meses','exh-iphone-11-pro-128gb','EXHIBICIÓN'),
            ('exh-iph11pm-256','iPhone 11 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2019,1600000,1400000,2,'Si','4 meses','exh-iphone-11-pro-max-256gb','EXHIBICIÓN'),
            ('exh-iph12m-64','iPhone 12 Mini 64GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,900000,700000,2,'Si','4 meses','exh-iphone-12-mini-64gb','EXHIBICIÓN'),
            ('exh-iph12-128','iPhone 12 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,1300000,1100000,3,'Si','4 meses','exh-iphone-12-128gb','EXHIBICIÓN'),
            ('exh-iph12-256','iPhone 12 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,1400000,1200000,3,'Si','4 meses','exh-iphone-12-256gb','EXHIBICIÓN'),
            ('exh-iph12p-128','iPhone 12 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,1500000,1300000,2,'Si','4 meses','exh-iphone-12-pro-128gb','EXHIBICIÓN'),
            ('exh-iph12p-256','iPhone 12 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,1650000,1450000,2,'Si','4 meses','exh-iphone-12-pro-256gb','EXHIBICIÓN'),
            ('exh-iph12pm-128','iPhone 12 Pro Max 128GB Exh','Apple','Exhibición','iPhone Exhibición',2020,1850000,1650000,2,'Si','4 meses','exh-iphone-12-pro-max-128gb','EXHIBICIÓN'),
            ('exh-iph12pm-256','iPhone 12 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2020,1950000,1750000,2,'Si','4 meses','exh-iphone-12-pro-max-256gb','EXHIBICIÓN'),
            ('exh-iph13-128','iPhone 13 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,1520000,1320000,3,'Si','4 meses','exh-iphone-13-128gb','EXHIBICIÓN'),
            ('exh-iph13-256','iPhone 13 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,0,NULL,0,'No','4 meses','exh-iphone-13-256gb','AGOTADO'),
            ('exh-iph13p-128','iPhone 13 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,1900000,1700000,2,'Si','4 meses','exh-iphone-13-pro-128gb','EXHIBICIÓN'),
            ('exh-iph13p-256','iPhone 13 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,2020000,1820000,2,'Si','4 meses','exh-iphone-13-pro-256gb','EXHIBICIÓN'),
            ('exh-iph13p-512','iPhone 13 Pro 512GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,2100000,1900000,2,'Si','4 meses','exh-iphone-13-pro-512gb','EXHIBICIÓN'),
            ('exh-iph13pm-128','iPhone 13 Pro Max 128GB Exh','Apple','Exhibición','iPhone Exhibición',2021,2100000,1900000,2,'Si','4 meses','exh-iphone-13-pro-max-128gb','EXHIBICIÓN'),
            ('exh-iph13pm-256','iPhone 13 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2021,2350000,2150000,2,'Si','4 meses','exh-iphone-13-pro-max-256gb','EXHIBICIÓN'),
            ('exh-iph13pm-1tb','iPhone 13 Pro Max 1TB Exh','Apple','Exhibición','iPhone Exhibición',2021,2650000,2450000,1,'Si','4 meses','exh-iphone-13-pro-max-1tb','EXHIBICIÓN'),
            ('exh-iph14-128','iPhone 14 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,1600000,1400000,3,'Si','4 meses','exh-iphone-14-128gb','EXHIBICIÓN'),
            ('exh-iph14p-128','iPhone 14 Plus 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,1850000,1650000,2,'Si','4 meses','exh-iphone-14-plus-128gb','EXHIBICIÓN'),
            ('exh-iph14p-256','iPhone 14 Plus 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,1950000,1750000,2,'Si','4 meses','exh-iphone-14-plus-256gb','EXHIBICIÓN'),
            ('exh-iph14pro-128','iPhone 14 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,2100000,1900000,2,'Si','4 meses','exh-iphone-14-pro-128gb','EXHIBICIÓN'),
            ('exh-iph14pro-256','iPhone 14 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,2200000,2000000,2,'Si','4 meses','exh-iphone-14-pro-256gb','EXHIBICIÓN'),
            ('exh-iph14pm-128','iPhone 14 Pro Max 128GB Exh','Apple','Exhibición','iPhone Exhibición',2022,2480000,2280000,2,'Si','4 meses','exh-iphone-14-pro-max-128gb','EXHIBICIÓN'),
            ('exh-iph14pm-256','iPhone 14 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2022,2600000,2400000,2,'Si','4 meses','exh-iphone-14-pro-max-256gb','EXHIBICIÓN'),
            ('exh-iph15-128','iPhone 15 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2150000,1950000,3,'Si','4 meses','exh-iphone-15-128gb','EXHIBICIÓN'),
            ('exh-iph15-256','iPhone 15 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2600000,2400000,3,'Si','4 meses','exh-iphone-15-256gb','EXHIBICIÓN'),
            ('exh-iph15p-128','iPhone 15 Plus 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2200000,2000000,2,'Si','4 meses','exh-iphone-15-plus-128gb','EXHIBICIÓN'),
            ('exh-iph15pro-128','iPhone 15 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2480000,2280000,2,'Si','4 meses','exh-iphone-15-pro-128gb','EXHIBICIÓN'),
            ('exh-iph15pro-256','iPhone 15 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2550000,2350000,2,'Si','4 meses','exh-iphone-15-pro-256gb','EXHIBICIÓN'),
            ('exh-iph15pm-256','iPhone 15 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2023,2850000,2650000,2,'Si','4 meses','exh-iphone-15-pro-max-256gb','EXHIBICIÓN'),
            ('exh-iph15pm-512','iPhone 15 Pro Max 512GB Exh','Apple','Exhibición','iPhone Exhibición',2023,3050000,2850000,2,'Si','4 meses','exh-iphone-15-pro-max-512gb','EXHIBICIÓN'),
            ('exh-iph16-128','iPhone 16 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2024,2550000,2350000,3,'Si','4 meses','exh-iphone-16-128gb','EXHIBICIÓN'),
            ('exh-iph16p-128','iPhone 16 Plus 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2024,2900000,2700000,2,'Si','4 meses','exh-iphone-16-plus-128gb','EXHIBICIÓN'),
            ('exh-iph16pro-128','iPhone 16 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2024,3200000,3000000,2,'Si','4 meses','exh-iphone-16-pro-128gb','EXHIBICIÓN'),
            ('exh-iph16pro-256','iPhone 16 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2024,3350000,3150000,2,'Si','4 meses','exh-iphone-16-pro-256gb','EXHIBICIÓN'),
            ('exh-iph16pm-256','iPhone 16 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2024,3700000,3500000,2,'Si','4 meses','exh-iphone-16-pro-max-256gb','EXHIBICIÓN'),
            ('exh-iph17-256','iPhone 17 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2025,3450000,3250000,3,'Si','10 meses Apple','exh-iphone-17-256gb','EXHIBICIÓN'),
            ('exh-iph17pm-256','iPhone 17 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2025,5100000,4900000,2,'Si','Garantía Apple','exh-iphone-17-pro-max-256gb','EXHIBICIÓN'),
            ('sam-zflip7fe','Samsung Z Flip 7 FE','Samsung','Samsung','Galaxy Z',2025,3150000,2950000,4,'Si','1 año Samsung','samsung-z-flip-7-fe','NUEVO'),
            ('sam-zfold3-256','Samsung Z Fold 3 256GB','Samsung','Samsung','Galaxy Z',2021,3200000,3000000,3,'Si','1 año Samsung','samsung-z-fold-3-256gb','NUEVO'),
            ('sam-a07-128','Samsung A07 128GB','Samsung','Samsung','Galaxy A',2022,650000,450000,8,'Si','1 año Samsung','samsung-a07-128gb','NUEVO'),
            ('sam-a17-128','Samsung A17 128GB','Samsung','Samsung','Galaxy A',2024,850000,650000,8,'Si','1 año Samsung','samsung-a17-128gb','NUEVO'),
            ('sam-a56-256','Samsung A56 256GB','Samsung','Samsung','Galaxy A',2025,1550000,1350000,6,'Si','1 año Samsung','samsung-a56-256gb','NUEVO'),
            ('sam-char45','Samsung Cargador 45W Original','Samsung','Accesorios','Cargadores',2024,280000,80000,15,'Si','1 año Samsung','samsung-cargador-45w','ACCESORIO'),
            ('sam-char25','Samsung Cargador 25W Original','Samsung','Accesorios','Cargadores',2024,250000,50000,15,'Si','1 año Samsung','samsung-cargador-25w','ACCESORIO'),
            ('redmi-note14-256','Redmi Note 14 256GB','Redmi','Android','Redmi',2024,850000,650000,6,'Si','1 año','redmi-note-14-256gb','NUEVO'),
            ('redmi-a5','Redmi A5','Redmi','Android','Redmi',2025,500000,300000,8,'Si','1 año','redmi-a5','NUEVO'),
            ('inf-hot60pro','Infinix Hot 60 Pro+','Infinix','Android','Infinix',2024,880000,680000,6,'Si','1 año','infinix-hot-60-pro-plus','NUEVO'),
            ('inf-note50pro','Infinix Note 50 Pro','Infinix','Android','Infinix',2025,1170000,970000,5,'Si','1 año','infinix-note-50-pro','NUEVO'),
            ('inf-gt30','Infinix GT 30','Infinix','Android','Infinix',2025,1200000,1000000,5,'Si','1 año','infinix-gt-30','NUEVO'),
            ('zte-v70max','ZTE Blade V70 Max','ZTE','Android','ZTE',2024,620000,420000,6,'Si','1 año','zte-blade-v70-max','NUEVO'),
            ('tecno-spark40','Tecno Spark 40','Tecno','Android','Tecno',2024,660000,460000,6,'Si','1 año','tecno-spark-40','NUEVO'),
            ('tecno-go3-64','Tecno Spark GO 3 64GB','Tecno','Android','Tecno',2025,505000,305000,8,'Si','1 año','tecno-spark-go-3-64gb','NUEVO'),
            ('tecno-go3-128','Tecno Spark GO 3 128GB','Tecno','Android','Tecno',2025,550000,350000,8,'Si','1 año','tecno-spark-go-3-128gb','NUEVO'),
            ('tecno-spark50-5g','Tecno Spark 50 5G 256GB','Tecno','Android','Tecno',2025,1050000,850000,6,'Si','1 año','tecno-spark-50-5g','NUEVO'),
            ('oppo-reno12-5g','Oppo Reno 12 5G','Oppo','Android','Oppo',2024,2400000,2200000,4,'Si','1 año','oppo-reno-12-5g','NUEVO'),
            ('oppo-a79','Oppo A79','Oppo','Android','Oppo',2023,1040000,840000,5,'Si','1 año','oppo-a79','NUEVO'),
            ('oppo-a80','Oppo A80','Oppo','Android','Oppo',2024,1060000,860000,5,'Si','1 año','oppo-a80','NUEVO'),
            ('oppo-a58','Oppo A58','Oppo','Android','Oppo',2023,860000,660000,5,'Si','1 año','oppo-a58','NUEVO')
            ON CONFLICT (producto_id) DO NOTHING;
        ";
        cmd2.ExecuteNonQuery();

        // ── Crear tabla conversaciones (chatbot IA Jhon) ────────────────
        using var cmd3 = conn.CreateCommand();
        cmd3.CommandText = @"
            CREATE TABLE IF NOT EXISTS conversaciones (
                id             SERIAL PRIMARY KEY,
                session_id     VARCHAR(100) NOT NULL,
                email          VARCHAR(200),
                nombre_usuario VARCHAR(200),
                role           VARCHAR(20),
                mensaje        TEXT,
                pregunta       TEXT,
                respuesta      TEXT,
                desde_cache    BOOLEAN DEFAULT FALSE,
                nivel_respuesta VARCHAR(20),
                intencion      VARCHAR(30),
                sentimiento    VARCHAR(10),
                tokens_usados  INTEGER,
                duracion_ms    INTEGER,
                creado_en      TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_conv_session ON conversaciones(session_id);
            CREATE INDEX IF NOT EXISTS idx_conv_email   ON conversaciones(email);
            CREATE EXTENSION IF NOT EXISTS pg_trgm;
            CREATE INDEX IF NOT EXISTS idx_conversaciones_trgm
              ON conversaciones USING gin(pregunta gin_trgm_ops)
              WHERE pregunta IS NOT NULL;
        ";
        cmd3.ExecuteNonQuery();

        // ── Crear tablas JhonIA avanzadas ───────────────────────────────
        using var cmd4 = conn.CreateCommand();
        cmd4.CommandText = @"
            CREATE TABLE IF NOT EXISTS estadisticas_jhon (
              id SERIAL PRIMARY KEY, fecha DATE NOT NULL UNIQUE,
              total_conversaciones INTEGER DEFAULT 0,
              respuestas_desde_cache INTEGER DEFAULT 0,
              respuestas_desde_groq INTEGER DEFAULT 0,
              respuestas_desde_entrenamiento INTEGER DEFAULT 0,
              hora_pico INTEGER, producto_mas_consultado VARCHAR(200),
              tasa_satisfaccion DECIMAL(5,2), total_escalaciones_wa INTEGER DEFAULT 0,
              creado_en TIMESTAMP DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS conversaciones_fallidas (
              id SERIAL PRIMARY KEY, session_id VARCHAR(100),
              pregunta TEXT, respuesta_jhon TEXT, motivo_falla VARCHAR(50),
              creado_en TIMESTAMP DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS gaps_conocimiento (
              id SERIAL PRIMARY KEY, pregunta TEXT NOT NULL UNIQUE,
              veces_fallida INTEGER DEFAULT 1, resuelta BOOLEAN DEFAULT FALSE,
              respuesta_admin TEXT, creado_en TIMESTAMP DEFAULT NOW(), resuelta_en TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_gaps_resuelta ON gaps_conocimiento(resuelta, veces_fallida DESC);
            CREATE TABLE IF NOT EXISTS conocimiento_jhon (
              id SERIAL PRIMARY KEY, pregunta_clave TEXT NOT NULL,
              respuesta_oficial TEXT NOT NULL, categoria VARCHAR(50),
              veces_usada INTEGER DEFAULT 0, activo BOOLEAN DEFAULT TRUE,
              creado_por VARCHAR(100) DEFAULT 'admin',
              creado_en TIMESTAMP DEFAULT NOW(), actualizado_en TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_conocimiento_trgm ON conocimiento_jhon USING gin(pregunta_clave gin_trgm_ops);
            CREATE INDEX IF NOT EXISTS idx_conocimiento_activo ON conocimiento_jhon(activo) WHERE activo = TRUE;
            DO $$ BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='uq_conocimiento_pregunta') THEN
                ALTER TABLE conocimiento_jhon ADD CONSTRAINT uq_conocimiento_pregunta UNIQUE (pregunta_clave);
              END IF;
            END $$;
            CREATE TABLE IF NOT EXISTS perfiles_clientes (
              id SERIAL PRIMARY KEY, session_id VARCHAR(100) UNIQUE NOT NULL,
              email VARCHAR(200), nombre VARCHAR(200),
              productos_consultados TEXT[] DEFAULT '{}',
              total_visitas INTEGER DEFAULT 1, satisfaccion_promedio DECIMAL(3,2) DEFAULT 0.5,
              segmento VARCHAR(20) DEFAULT 'nuevo',
              ultima_visita TIMESTAMP DEFAULT NOW(), primera_visita TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_perfiles_session ON perfiles_clientes(session_id);
            CREATE TABLE IF NOT EXISTS productos_relacionados (
              id SERIAL PRIMARY KEY, producto_a VARCHAR(200), producto_b VARCHAR(200),
              veces_consultados_juntos INTEGER DEFAULT 1,
              actualizado_en TIMESTAMP DEFAULT NOW(), UNIQUE(producto_a, producto_b)
            );
            CREATE TABLE IF NOT EXISTS control_api (
              id SERIAL PRIMARY KEY, proveedor VARCHAR(50) DEFAULT 'groq',
              timestamp_llamada TIMESTAMP DEFAULT NOW(), tokens_usados INTEGER,
              modelo VARCHAR(100), session_id VARCHAR(100), duracion_ms INTEGER
            );
            CREATE INDEX IF NOT EXISTS idx_control_api_timestamp ON control_api(timestamp_llamada DESC);
            CREATE TABLE IF NOT EXISTS inventario_por_imagen (
              id            SERIAL PRIMARY KEY,
              referencia    TEXT,
              notas         TEXT,
              imagen_base64 TEXT,
              mime_type     VARCHAR(50) DEFAULT 'image/jpeg',
              fecha         TIMESTAMPTZ DEFAULT NOW(),
              cajera        VARCHAR(200),
              token_sesion  VARCHAR(100),
              revisado      BOOLEAN DEFAULT FALSE
            );
            CREATE INDEX IF NOT EXISTS idx_inv_imagen_revisado ON inventario_por_imagen(revisado, fecha DESC);
        ";
        cmd4.ExecuteNonQuery();

        conn.Close();
        Console.WriteLine("[DB] Tablas inventario_productos, conversaciones, JhonIA e inventario_por_imagen verificadas/creadas.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB WARNING] {ex.Message}");
    }
}

// ============================================================
// SUPABASE SYNC — helper que corre en background
// ============================================================
const string SUPABASE_URL  = "https://gklxdzhmpjwwmffjdmwv.supabase.co/rest/v1/pedidos";
const string SUPABASE_BASE = "https://gklxdzhmpjwwmffjdmwv.supabase.co/rest/v1/";
const string SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHhkemhtcGp3d21mZmpkbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTM0MDEsImV4cCI6MjA5MTQyOTQwMX0.Es3YyKtLnx9lKiA_xyTHxK_IDSICb9kGf5-nu2XE_jg";

// Cliente HTTP reutilizable para sync JhonIA (evita threading factory por todas las funciones helper)
var supabaseClient = new HttpClient();
supabaseClient.DefaultRequestHeaders.Add("apikey", SUPABASE_KEY);
supabaseClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {SUPABASE_KEY}");

async Task SyncJhonToSupabase(string tabla, object payload)
{
    try
    {
        var json    = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        content.Headers.Add("Prefer", "return=minimal");
        var resp = await supabaseClient.PostAsync($"{SUPABASE_BASE}{tabla}", content);
        Console.WriteLine($"[SUPABASE JHON] Sync {tabla} → HTTP {(int)resp.StatusCode}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[SUPABASE JHON] Sync {tabla} falló (no crítico): {ex.Message}");
    }
}

async Task SyncPedidoToSupabase(Pedido p, IHttpClientFactory factory)
{
    try
    {
        // NO enviamos id — Supabase asigna su propio SERIAL para evitar conflictos
        // con el ID del PostgreSQL local/Hetzner (ambas secuencias son independientes)
        var payload = new
        {
            cliente      = p.Cliente,
            total        = p.Total,
            fecha        = p.Fecha,
            email        = p.Email,
            telefono     = p.Telefono,
            nombre       = p.Nombre,
            apellido     = p.Apellido,
            empresa      = p.Empresa,
            ciudad       = p.Ciudad,
            direccion    = p.Direccion,
            barrio       = p.Barrio,
            tipo_id      = p.TipoId,
            numero_id    = p.NumeroId,
            metodo_envio = p.MetodoEnvio,
            metodo_pago  = p.MetodoPago,
            items_json   = p.ItemsJson,
            estado       = p.Estado
        };

        using var client = factory.CreateClient();
        client.DefaultRequestHeaders.Add("apikey", SUPABASE_KEY);
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {SUPABASE_KEY}");
        client.DefaultRequestHeaders.Add("Prefer", "return=minimal");

        var json    = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var resp    = await client.PostAsync(SUPABASE_URL, content);

        Console.WriteLine($"[SUPABASE] Sync pedido {p.Id} → HTTP {(int)resp.StatusCode}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[SUPABASE] Sync falló (no crítico): {ex.Message}");
    }
}

// ============================================================
// WOMPI — claves (sandbox por defecto; sobrescribir con env vars en prod)
// ============================================================
var WOMPI_PUBLIC_KEY    = builder.Configuration["Wompi:PublicKey"]    ?? "pub_test_iGDtX1yJbTOiwFOZQsz57WHnqkPfKATo";
var WOMPI_INTEGRITY_KEY = builder.Configuration["Wompi:IntegrityKey"] ?? "test_integrity_emFDteel2smneriBhxztMfMmudxgZhPg";
var WOMPI_EVENTS_KEY    = builder.Configuration["Wompi:EventsKey"]    ?? "test_events_HZaNbXWnNGOICIDNxtjCvcgnZX6UobgW";

string WompiIntegritySignature(string reference, long amountCents, string currency)
{
    var raw  = $"{reference}{amountCents}{currency}{WOMPI_INTEGRITY_KEY}";
    var hash = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
    return BitConverter.ToString(hash).Replace("-", "").ToLower();
}

// ============================================================
// MIDDLEWARE
// ============================================================
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

// ============================================================
// GET /productos — inventario completo desde inventario_productos
// Público: el frontend lo consume sin autenticación
// ============================================================
app.MapGet("/productos", async () =>
{
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    var cmd = new NpgsqlCommand(
        "SELECT producto_id, nombre, marca, precio, precio_anterior, unidades, disponibilidad, badge " +
        "FROM inventario_productos ORDER BY id", conn);
    await using var reader = await cmd.ExecuteReaderAsync();
    var list = new List<object>();
    while (await reader.ReadAsync())
    {
        list.Add(new {
            productoId     = reader.GetString(0),
            nombre         = reader.GetString(1),
            marca          = reader.GetString(2),
            precio         = reader.GetDecimal(3),
            precioAnterior = reader.IsDBNull(4) ? (decimal?)null : reader.GetDecimal(4),
            unidades       = reader.GetInt32(5),
            disponibilidad = reader.GetString(6),
            badge          = reader.IsDBNull(7) ? null : reader.GetString(7)
        });
    }
    return Results.Ok(list);
});

// POST /sync/productos — Supabase webhook llama este endpoint cuando cambia un producto
// También puede llamarse manualmente desde Coolify o admin para sincronizar todo el inventario
app.MapPost("/sync/productos", async (IHttpClientFactory factory, ILogger<Program> logger) =>
{
    try
    {
        logger.LogInformation("[SYNC] Iniciando sincronización productos Supabase → Hetzner");

        using var client = factory.CreateClient();
        client.DefaultRequestHeaders.Add("apikey", SUPABASE_KEY);
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {SUPABASE_KEY}");

        var resp = await client.GetAsync(
            "https://gklxdzhmpjwwmffjdmwv.supabase.co/rest/v1/inventario_productos?select=*&order=id.asc");

        if (!resp.IsSuccessStatusCode)
            return Results.Problem($"Supabase error: {resp.StatusCode}");

        var jsonStr = await resp.Content.ReadAsStringAsync();
        var productos = JsonSerializer.Deserialize<List<JsonElement>>(jsonStr);
        if (productos == null || productos.Count == 0)
            return Results.Ok(new { synced = 0, message = "Sin productos en Supabase" });

        int synced = 0;
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();

        foreach (var p in productos)
        {
            string pid    = p.GetProperty("producto_id").GetString() ?? "";
            string nombre = p.GetProperty("nombre").GetString() ?? "";
            string marca  = p.GetProperty("marca").GetString() ?? "";
            string cat    = p.GetProperty("categoria").GetString() ?? "";
            string modelo = p.GetProperty("modelo").GetString() ?? "";
            int anyo      = p.TryGetProperty("año", out var anyoProp) ? anyoProp.GetInt32() : 2025;
            decimal precio = p.GetProperty("precio").GetDecimal();
            decimal? precioAnt = p.TryGetProperty("precio_anterior", out var paProp)
                                 && paProp.ValueKind != JsonValueKind.Null
                                 ? paProp.GetDecimal() : null;
            int unidades  = p.TryGetProperty("unidades", out var uProp) ? uProp.GetInt32() : 5;
            string disp   = p.TryGetProperty("disponibilidad", out var dProp) ? dProp.GetString() ?? "Si" : "Si";
            string gar    = p.TryGetProperty("garantia", out var gProp) ? gProp.GetString() ?? "1 año" : "1 año";
            string slug   = p.TryGetProperty("slug", out var sProp) ? sProp.GetString() ?? pid : pid;
            string? badge = p.TryGetProperty("badge", out var bProp) && bProp.ValueKind != JsonValueKind.Null
                            ? bProp.GetString() : null;

            var cmd = new NpgsqlCommand(@"
                INSERT INTO inventario_productos
                    (producto_id, nombre, marca, categoria, modelo, año, precio, precio_anterior,
                     unidades, disponibilidad, garantia, slug, badge, actualizado_en)
                VALUES
                    (@pid, @nombre, @marca, @cat, @modelo, @anyo, @precio, @precioAnt,
                     @unidades, @disp, @gar, @slug, @badge, NOW())
                ON CONFLICT (producto_id) DO UPDATE SET
                    nombre          = EXCLUDED.nombre,
                    marca           = EXCLUDED.marca,
                    categoria       = EXCLUDED.categoria,
                    modelo          = EXCLUDED.modelo,
                    año             = EXCLUDED.año,
                    precio          = EXCLUDED.precio,
                    precio_anterior = EXCLUDED.precio_anterior,
                    unidades        = EXCLUDED.unidades,
                    disponibilidad  = EXCLUDED.disponibilidad,
                    garantia        = EXCLUDED.garantia,
                    slug            = EXCLUDED.slug,
                    badge           = EXCLUDED.badge,
                    actualizado_en  = NOW()", conn);

            cmd.Parameters.AddWithValue("pid", pid);
            cmd.Parameters.AddWithValue("nombre", nombre);
            cmd.Parameters.AddWithValue("marca", marca);
            cmd.Parameters.AddWithValue("cat", cat);
            cmd.Parameters.AddWithValue("modelo", modelo);
            cmd.Parameters.AddWithValue("anyo", anyo);
            cmd.Parameters.AddWithValue("precio", precio);
            cmd.Parameters.AddWithValue("precioAnt", (object?)precioAnt ?? DBNull.Value);
            cmd.Parameters.AddWithValue("unidades", unidades);
            cmd.Parameters.AddWithValue("disp", disp);
            cmd.Parameters.AddWithValue("gar", gar);
            cmd.Parameters.AddWithValue("slug", slug);
            cmd.Parameters.AddWithValue("badge", (object?)badge ?? DBNull.Value);

            await cmd.ExecuteNonQueryAsync();
            synced++;
        }

        logger.LogInformation("[SYNC] Sincronizados {Count} productos", synced);
        return Results.Ok(new { synced, message = $"{synced} productos sincronizados correctamente" });
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "[SYNC] Error sincronizando productos");
        return Results.Problem(ex.Message);
    }
});

// GET / — lista completa
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

// POST / — Admin/Vendedor (pedido manual)
app.MapPost("/", async (PedidoCreateDto dto, IPedidoRepository repo, ILogger<Program> logger, IHttpClientFactory factory) =>
{
    logger.LogInformation("[PEDIDOS] POST cliente={Cliente} total={Total}", dto.Cliente, dto.Total);
    var pedido = new Pedido { Cliente = dto.Cliente, Total = dto.Total };
    await repo.CreateAsync(pedido);
    _ = Task.Run(() => SyncPedidoToSupabase(pedido, factory));
    return Results.Created($"/{pedido.Id}", new PedidoResponseDto(pedido.Id, pedido.Cliente, pedido.Total, pedido.Fecha));
}).RequireAuthorization(p => p.RequireRole("Admin", "Vendedor"));

// POST /checkout — público, guarda compra completa y sincroniza a Supabase
app.MapPost("/checkout", async (PedidoCheckoutDto dto, IPedidoRepository repo, ILogger<Program> logger, IHttpClientFactory factory) =>
{
    logger.LogInformation("[CHECKOUT] cliente={Cliente} total={Total} email={Email} ciudad={Ciudad} pago={Pago}",
        dto.Cliente, dto.Total, dto.Email, dto.Ciudad, dto.MetodoPago);

    var pedido = new Pedido
    {
        Cliente     = string.IsNullOrEmpty(dto.Cliente) ? $"{dto.Nombre} {dto.Apellido}".Trim() : dto.Cliente,
        Total       = dto.Total,
        Email       = dto.Email       ?? string.Empty,
        Telefono    = dto.Telefono    ?? string.Empty,
        Nombre      = dto.Nombre      ?? string.Empty,
        Apellido    = dto.Apellido    ?? string.Empty,
        Empresa     = dto.Empresa     ?? string.Empty,
        Ciudad      = dto.Ciudad      ?? string.Empty,
        Direccion   = dto.Direccion   ?? string.Empty,
        Barrio      = dto.Barrio      ?? string.Empty,
        TipoId      = dto.TipoId      ?? string.Empty,
        NumeroId    = dto.NumeroId    ?? string.Empty,
        MetodoEnvio = dto.MetodoEnvio ?? "domicilio",
        MetodoPago  = dto.MetodoPago  ?? "tarjeta",
        ItemsJson   = dto.ItemsJson   ?? "[]",
        Estado      = "Completado"
    };

    await repo.CreateAsync(pedido);

    // Sync a Supabase y email — en background, no bloquean la respuesta
    _ = Task.Run(() => SyncPedidoToSupabase(pedido, factory));
    _ = Task.Run(() => EnviarEmail(pedido, "checkout"));

    return Results.Created($"/{pedido.Id}", new PedidoDetalleDto(
        pedido.Id, pedido.Cliente, pedido.Total, pedido.Fecha,
        pedido.Email, pedido.Telefono, pedido.Nombre, pedido.Apellido,
        pedido.Empresa, pedido.Ciudad, pedido.Direccion, pedido.Barrio,
        pedido.TipoId, pedido.NumeroId, pedido.MetodoEnvio, pedido.MetodoPago,
        pedido.ItemsJson, pedido.Estado
    ));
});

// ============================================================
// WOMPI — POST /create-wompi-transaction (público)
// Recibe datos del pedido, devuelve URL de checkout de Wompi
// ============================================================
app.MapPost("/create-wompi-transaction", (WompiTransactionRequestDto dto, ILogger<Program> logger) =>
{
    logger.LogInformation("[WOMPI] Creando transacción ref={Ref} monto={Monto}", dto.Reference, dto.AmountCop);

    var amountCents = (long)(dto.AmountCop * 100);
    var currency    = "COP";
    var signature   = WompiIntegritySignature(dto.Reference, amountCents, currency);

    var qs = new System.Text.StringBuilder();
    qs.Append($"public-key={Uri.EscapeDataString(WOMPI_PUBLIC_KEY)}");
    qs.Append($"&currency={currency}");
    qs.Append($"&amount-in-cents={amountCents}");
    qs.Append($"&reference={Uri.EscapeDataString(dto.Reference)}");
    qs.Append($"&signature:integrity={signature}");
    qs.Append($"&redirect-url={Uri.EscapeDataString(dto.RedirectUrl)}");
    if (!string.IsNullOrEmpty(dto.Email))
        qs.Append($"&customer-data:email={Uri.EscapeDataString(dto.Email)}");
    if (!string.IsNullOrEmpty(dto.FullName))
        qs.Append($"&customer-data:full-name={Uri.EscapeDataString(dto.FullName)}");
    if (!string.IsNullOrEmpty(dto.Phone))
        qs.Append($"&customer-data:phone-number={Uri.EscapeDataString(dto.Phone)}");

    var checkoutUrl = $"https://checkout.wompi.co/p/?{qs}";
    logger.LogInformation("[WOMPI] URL generada para ref={Ref}", dto.Reference);

    return Results.Ok(new { checkoutUrl, reference = dto.Reference });
});

// ============================================================
// WOMPI — POST /wompi-webhook (público — llamado por Wompi)
// Actualiza el estado del pedido según confirmación de pago
// ============================================================
app.MapPost("/wompi-webhook", async (HttpRequest request, IPedidoRepository repo, ILogger<Program> logger) =>
{
    try
    {
        var body = await new StreamReader(request.Body).ReadToEndAsync();
        var evt  = JsonSerializer.Deserialize<JsonElement>(body);

        var eventType = evt.TryGetProperty("event", out var evtProp) ? evtProp.GetString() : null;
        if (eventType != "transaction.updated") return Results.Ok();

        var data        = evt.GetProperty("data").GetProperty("transaction");
        var reference   = data.GetProperty("reference").GetString() ?? "";
        var status      = data.GetProperty("status").GetString() ?? "";
        var transId     = data.GetProperty("id").GetString() ?? "";

        logger.LogInformation("[WOMPI WEBHOOK] ref={Ref} status={Status} transId={TId}", reference, status, transId);

        // Verificar firma del evento (HMAC-SHA256)
        if (request.Headers.TryGetValue("X-Event-Checksum", out var checksumHeader))
        {
            var checksum   = checksumHeader.ToString();
            var timestamp  = evt.TryGetProperty("timestamp", out var tsProp) ? tsProp.ToString() : "";
            var rawToSign  = $"{timestamp}{body}{WOMPI_EVENTS_KEY}";
            var computed   = BitConverter.ToString(SHA256.HashData(Encoding.UTF8.GetBytes(rawToSign))).Replace("-","").ToLower();
            if (!string.Equals(checksum, computed, StringComparison.OrdinalIgnoreCase))
            {
                logger.LogWarning("[WOMPI WEBHOOK] Firma inválida para ref={Ref}", reference);
                return Results.Unauthorized();
            }
        }

        // Extraer pedidoId de la referencia "OUTILTECH-{id}-{timestamp}"
        var parts = reference.Split('-');
        if (parts.Length >= 2 && int.TryParse(parts[1], out var pedidoId))
        {
            var pedido = await repo.GetByIdAsync(pedidoId);
            if (pedido != null)
            {
                pedido.Estado = status switch
                {
                    "APPROVED"  => "Pagado",
                    "DECLINED"  => "Rechazado",
                    "VOIDED"    => "Anulado",
                    "ERROR"     => "Error_Pago",
                    _           => pedido.Estado
                };
                await repo.UpdateAsync(pedido);
                logger.LogInformation("[WOMPI WEBHOOK] Pedido {Id} actualizado a {Estado}", pedidoId, pedido.Estado);
            }
        }

        return Results.Ok();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "[WOMPI WEBHOOK] Error procesando evento");
        return Results.Ok(); // Wompi requiere 200 siempre para no reenviar
    }
});

// ============================================================
// PATCH /nequi-comprobante/{id} — público
// Guarda el comprobante de pago directo Nequi/Daviplata
// ============================================================
app.MapPatch("/nequi-comprobante/{id}", async (int id, NequiComprobanteDto dto, IPedidoRepository repo, ILogger<Program> logger) =>
{
    var pedido = await repo.GetByIdAsync(id);
    if (pedido == null)
    {
        logger.LogWarning("[NEQUI] Pedido {Id} no encontrado", id);
        return Results.NotFound(new { error = "Pedido no encontrado" });
    }

    pedido.Estado           = "PendienteVerificacion";
    pedido.ComprobanteNequi = $"Tipo: {dto.TipoPago} | Cel: {dto.NumeroPagador} | Comprobante: {dto.CodigoComprobante}";
    await repo.UpdateAsync(pedido);

    logger.LogInformation("[NEQUI] Comprobante guardado pedido {Id}: {Comprobante}", id, pedido.ComprobanteNequi);

    // Enviar email de confirmación al cliente y al admin
    _ = Task.Run(() => EnviarEmail(pedido, "nequi_comprobante"));

    return Results.Ok(new
    {
        mensaje      = "Comprobante recibido. Tu pedido quedará confirmado al verificar el pago.",
        pedidoId     = id,
        estado       = pedido.Estado,
        comprobante  = pedido.ComprobanteNequi
    });
});

// ============================================================
// CHATBOT IA — helpers de base de datos y email
// ============================================================
async Task AsociarEmailSesion(string sessionId, string email, string? nombre)
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(
            "UPDATE conversaciones SET email = @email, nombre_usuario = COALESCE(@nombre, nombre_usuario) " +
            "WHERE session_id = @sid AND email IS NULL", conn);
        cmd.Parameters.AddWithValue("email",  email);
        cmd.Parameters.AddWithValue("nombre", (object?)nombre ?? DBNull.Value);
        cmd.Parameters.AddWithValue("sid",    sessionId);
        await cmd.ExecuteNonQueryAsync();
    }
    catch (Exception ex) { Console.WriteLine($"[CHATBOT DB] Error asociando email: {ex.Message}"); }
}

async Task<int> ContarMensajesSesion(string sessionId)
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand("SELECT COUNT(*) FROM conversaciones WHERE session_id = @sid", conn);
        cmd.Parameters.AddWithValue("sid", sessionId);
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }
    catch { return 0; }
}

async Task EnviarEmailBienvenidaChatbot(string emailDestino, string? nombre, string sessionId)
{
    if (string.IsNullOrEmpty(emailUser) || string.IsNullOrEmpty(emailPass) || emailPass == "PONER_APP_PASSWORD_AQUI") return;
    try
    {
        var saludo = string.IsNullOrEmpty(nombre) ? "Hola" : $"Hola {nombre}";
        var htmlBody = $@"<!DOCTYPE html><html lang='es'><body style='margin:0;padding:0;background:#0f0f0f;font-family:Arial,sans-serif'>
<div style='max-width:600px;margin:0 auto;background:#1a1a1a;border-radius:12px;overflow:hidden'>
  <div style='background:#FF6B00;padding:28px 40px'>
    <div style='font-family:Arial Black,sans-serif;font-size:26px;font-weight:900'>
      <span style='color:#fff'>OUTIL</span><span style='color:#0D1117'>TECH</span>
    </div>
    <p style='color:rgba(255,255,255,0.85);font-size:13px;margin:4px 0 0'>Jhon · Asistente IA de Outiltech</p>
  </div>
  <div style='padding:32px 40px'>
    <h1 style='color:#fff;font-size:22px;margin:0 0 12px'>¡Tu consulta ha sido registrada! 🤖</h1>
    <p style='color:#ccc;font-size:14px;line-height:1.7'>{saludo}, gracias por contactar a <strong style='color:#FF6B00'>Jhon</strong>, el asistente IA de Outiltech.</p>
    <p style='color:#ccc;font-size:14px;line-height:1.7'>Hemos guardado tu conversación. Al finalizar, recibirás un resumen completo de tu consulta en este correo.</p>
    <div style='background:#FF6B00;border-radius:8px;padding:16px 24px;margin:24px 0;text-align:center'>
      <p style='color:#fff;font-weight:700;margin:0;font-size:15px'>¿Necesitas ayuda inmediata?</p>
      <p style='color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:13px'>📧 contactanos@outiltech.co &nbsp;|&nbsp; 💬 WhatsApp +57 3133082905</p>
    </div>
    <a href='https://outiltech.co' style='display:inline-block;background:#1a1f2e;color:#FF6B00;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;border:1px solid #FF6B00'>
      🛍️ Ver productos en outiltech.co
    </a>
  </div>
  <div style='padding:16px 40px;background:#111;text-align:center'>
    <p style='color:rgba(255,255,255,0.3);font-size:12px;margin:0'>© 2026 Outiltech · contactanos@outiltech.co</p>
  </div>
</div></body></html>";

#pragma warning disable SYSLIB0006
        using var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587) { EnableSsl = true, Credentials = new System.Net.NetworkCredential(emailUser, emailPass) };
#pragma warning restore SYSLIB0006
        var mail = new System.Net.Mail.MailMessage(emailUser, emailDestino, "Jhon IA registró tu consulta · Outiltech", htmlBody) { IsBodyHtml = true };
        await smtp.SendMailAsync(mail);
        var adminMail = new System.Net.Mail.MailMessage(emailUser, emailAdmin, $"[Chatbot] Nuevo usuario: {emailDestino}", $"<p>Nuevo usuario en el chatbot: <strong>{emailDestino}</strong> ({nombre})<br/>Sesión: {sessionId}</p>") { IsBodyHtml = true };
        await smtp.SendMailAsync(adminMail);
        Console.WriteLine($"[CHATBOT EMAIL] Bienvenida enviada a {emailDestino}");
    }
    catch (Exception ex) { Console.WriteLine($"[CHATBOT EMAIL] Error: {ex.Message}"); }
}

async Task EnviarTranscriptoEmail(string emailDestino, string? nombre, string sessionId)
{
    if (string.IsNullOrEmpty(emailUser) || string.IsNullOrEmpty(emailPass) || emailPass == "PONER_APP_PASSWORD_AQUI") return;
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(
            "SELECT role, mensaje, creado_en FROM conversaciones WHERE session_id = @sid ORDER BY creado_en ASC LIMIT 100", conn);
        cmd.Parameters.AddWithValue("sid", sessionId);
        await using var reader = await cmd.ExecuteReaderAsync();
        var rows = new System.Text.StringBuilder();
        while (await reader.ReadAsync())
        {
            var role  = reader.GetString(0);
            var msg   = reader.GetString(1);
            var fecha = reader.GetDateTime(2).ToString("HH:mm");
            var bg    = role == "user" ? "#1e2433" : "#161b27";
            var who   = role == "user" ? $"<strong style='color:#FF6B00'>{(nombre ?? "Cliente")}</strong>" : "<strong style='color:#22c55e'>Jhon IA</strong>";
            rows.Append($"<div style='background:{bg};padding:10px 14px;border-radius:8px;margin-bottom:8px'><span style='font-size:11px;color:#888'>{fecha}</span> {who}<br/><span style='color:#ddd;font-size:13px'>{System.Web.HttpUtility.HtmlEncode(msg)}</span></div>");
        }
        var htmlBody = $@"<!DOCTYPE html><html lang='es'><body style='margin:0;padding:0;background:#0f0f0f;font-family:Arial,sans-serif'>
<div style='max-width:600px;margin:0 auto;background:#1a1a1a;border-radius:12px;overflow:hidden'>
  <div style='background:#FF6B00;padding:24px 40px'><div style='font-family:Arial Black,sans-serif;font-size:24px;font-weight:900'><span style='color:#fff'>OUTIL</span><span style='color:#0D1117'>TECH</span></div><p style='color:rgba(255,255,255,0.85);font-size:13px;margin:4px 0 0'>Resumen de tu conversación con Jhon IA</p></div>
  <div style='padding:24px 40px'><h2 style='color:#fff;font-size:18px'>Transcripto de tu consulta</h2>{rows}</div>
  <div style='padding:16px 40px;background:#111;text-align:center'><p style='color:rgba(255,255,255,0.3);font-size:12px;margin:0'>© 2026 Outiltech · contactanos@outiltech.co</p></div>
</div></body></html>";

#pragma warning disable SYSLIB0006
        using var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587) { EnableSsl = true, Credentials = new System.Net.NetworkCredential(emailUser, emailPass) };
#pragma warning restore SYSLIB0006
        var mail = new System.Net.Mail.MailMessage(emailUser, emailDestino, "Tu conversación con Jhon IA · Outiltech", htmlBody) { IsBodyHtml = true };
        await smtp.SendMailAsync(mail);
        var adminMail = new System.Net.Mail.MailMessage(emailUser, emailAdmin, $"[Chatbot Transcripto] {emailDestino}", htmlBody) { IsBodyHtml = true };
        await smtp.SendMailAsync(adminMail);
        Console.WriteLine($"[CHATBOT EMAIL] Transcripto enviado a {emailDestino}");
    }
    catch (Exception ex) { Console.WriteLine($"[CHATBOT EMAIL] Error transcripto: {ex.Message}"); }
}

// ── Herramienta: búsqueda de productos en tiempo real ─────────────────────────
async Task<string> EjecutarBuscarProductos(string query, string? categoria, ILogger<Program> logger)
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();

        var paramQuery = $"%{query}%";
        var sql = @"SELECT nombre, precio, unidades, marca, categoria, modelo, garantia, disponibilidad
                    FROM inventario_productos
                    WHERE disponibilidad = 'Si' AND unidades > 0
                      AND (nombre ILIKE @q OR marca ILIKE @q OR categoria ILIKE @q OR modelo ILIKE @q)";

        if (!string.IsNullOrEmpty(categoria))
            sql += " AND categoria ILIKE @cat";

        sql += " ORDER BY unidades DESC LIMIT 8";

        var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("q", paramQuery);
        if (!string.IsNullOrEmpty(categoria))
            cmd.Parameters.AddWithValue("cat", $"%{categoria}%");

        await using var reader = await cmd.ExecuteReaderAsync();
        var resultados = new System.Text.StringBuilder();
        int count = 0;
        while (await reader.ReadAsync())
        {
            count++;
            var nombre   = reader.IsDBNull(0) ? "" : reader.GetString(0);
            var precio   = reader.IsDBNull(1) ? 0m : reader.GetDecimal(1);
            var unidades = reader.IsDBNull(2) ? 0  : reader.GetInt32(2);
            var marca    = reader.IsDBNull(3) ? "" : reader.GetString(3);
            var cat      = reader.IsDBNull(4) ? "" : reader.GetString(4);
            var modelo   = reader.IsDBNull(5) ? "" : reader.GetString(5);
            var garantia = reader.IsDBNull(6) ? "" : reader.GetString(6);
            resultados.AppendLine($"- {nombre} ({marca} {modelo}) | Precio: ${precio:N0} COP | Stock: {unidades} unidades | Garantía: {garantia} | Categoría: {cat}");
        }

        if (count == 0)
            return $"No se encontraron productos disponibles para '{query}'" + (string.IsNullOrEmpty(categoria) ? "." : $" en categoría '{categoria}'.");

        logger.LogInformation("[CHATBOT TOOL] buscar_productos '{Query}' → {Count} resultados", query, count);
        return $"Productos encontrados para '{query}':\n{resultados}";
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "[CHATBOT TOOL] Error buscando productos");
        return "No se pudo consultar el catálogo en este momento.";
    }
}

// ── Contexto productos para system prompt ─────────────────────────────────────
async Task<string> ObtenerContextoProductos(string mensajeUsuario)
{
    try
    {
        var m = mensajeUsuario.ToLowerInvariant()
            .Replace("á","a").Replace("é","e").Replace("í","i")
            .Replace("ó","o").Replace("ú","u").Replace("ñ","n");

        string? filtro = null;
        if (m.Contains("iphone") || m.Contains("apple") || m.Contains("ios"))
            filtro = "iphone";
        else if (m.Contains("samsung") || m.Contains("galaxy"))
            filtro = "samsung";
        else if (m.Contains("laptop") || m.Contains("computador") || m.Contains("portatil") || m.Contains("notebook"))
            filtro = "laptop";
        else if (m.Contains("tablet") || m.Contains("ipad"))
            filtro = "tablet";
        else if (m.Contains("software") || m.Contains("sistema") || m.Contains("desarrollo") || m.Contains("app") || m.Contains("web"))
            return "SERVICIOS SOFTWARE: Desarrollo a la medida desde $30.000/hora. Primera consulta GRATIS. ISO 27001, Forense Digital, PWA, DevOps, IA.";
        else if (m.Contains("patineta") || m.Contains("segway"))
            filtro = "Patinetas";
        else if (m.Contains("redmi") || m.Contains("xiaomi"))
            filtro = "redmi";
        else if (m.Contains("infinix"))
            filtro = "infinix";

        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();

        string sql;
        NpgsqlCommand cmd;

        if (filtro == null)
        {
            sql = @"SELECT nombre, precio, unidades, marca, garantia, slug
                    FROM inventario_productos
                    WHERE disponibilidad = 'Si' AND unidades > 0
                    ORDER BY precio ASC LIMIT 6";
            cmd = new NpgsqlCommand(sql, conn);
        }
        else
        {
            sql = @"SELECT nombre, precio, unidades, marca, garantia, slug
                    FROM inventario_productos
                    WHERE disponibilidad = 'Si' AND unidades > 0
                      AND (LOWER(nombre) LIKE @f OR LOWER(marca) LIKE @f
                           OR LOWER(categoria) LIKE @f OR LOWER(categoria) = @fexact)
                    ORDER BY precio ASC LIMIT 8";
            cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("f", $"%{filtro.ToLower()}%");
            cmd.Parameters.AddWithValue("fexact", filtro.ToLower());
        }

        var sb = new System.Text.StringBuilder();
        sb.AppendLine(filtro == null
            ? "PRODUCTOS DISPONIBLES (más económicos del catálogo):"
            : $"PRODUCTOS {filtro.ToUpper()} DISPONIBLES (menor a mayor precio):");

        await using var rdr = await cmd.ExecuteReaderAsync();
        bool hayProductos = false;
        while (await rdr.ReadAsync())
        {
            hayProductos = true;
            var nombre   = rdr.IsDBNull(0) ? "" : rdr.GetString(0);
            var precio   = rdr.IsDBNull(1) ? 0m : rdr.GetDecimal(1);
            var unidades = rdr.IsDBNull(2) ? 0  : rdr.GetInt32(2);
            var marca    = rdr.IsDBNull(3) ? "" : rdr.GetString(3);
            var garantia = rdr.IsDBNull(4) ? "" : rdr.GetString(4);
            var slug     = rdr.IsDBNull(5) ? "" : rdr.GetString(5);
            sb.AppendLine($"- {nombre} | ${precio:N0} COP | Stock: {unidades} | Garantía: {garantia} | URL: /productos/{slug}");
        }
        if (!hayProductos)
            sb.AppendLine("(Sin stock en esta categoría en este momento)");

        return sb.ToString();
    }
    catch { return "Catálogo disponible en outiltech.co/tienda."; }
}

// ── Link inteligente al producto más económico de la categoría ────────────────
async Task<string?> GenerarLinkProducto(string mensajeUsuario)
{
    try
    {
        var m = mensajeUsuario.ToLowerInvariant()
            .Replace("á","a").Replace("é","e").Replace("í","i")
            .Replace("ó","o").Replace("ú","u");

        var quiereVer = new[] { "ver","mostrar","tienda","catalogo","precio","cuanto","barato",
            "economico","disponible","stock","comprar","quiero","cual","tienen","muestrame" }
            .Any(p => m.Contains(p));
        if (!quiereVer) return null;

        string? filtro = null;
        if (m.Contains("iphone") || m.Contains("apple")) filtro = "iphone";
        else if (m.Contains("samsung") || m.Contains("galaxy")) filtro = "samsung";
        else if (m.Contains("laptop") || m.Contains("computador")) filtro = "laptop";
        else if (m.Contains("redmi") || m.Contains("xiaomi")) filtro = "redmi";
        else if (m.Contains("infinix")) filtro = "infinix";

        if (filtro == null)
            return "<a href='https://outiltech.co' target='_blank' style='color:#FF6B00;font-weight:700;text-decoration:none;'>🛍️ Ver catálogo completo →</a>";

        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(@"
            SELECT nombre, precio, slug FROM inventario_productos
            WHERE disponibilidad = 'Si' AND unidades > 0
              AND (LOWER(nombre) LIKE @f OR LOWER(marca) LIKE @f OR LOWER(categoria) LIKE @f)
            ORDER BY precio ASC LIMIT 1", conn);
        cmd.Parameters.AddWithValue("f", $"%{filtro}%");
        await using var rdr = await cmd.ExecuteReaderAsync();
        if (await rdr.ReadAsync())
        {
            var nombre = rdr.GetString(0);
            var precio = rdr.GetDecimal(1);
            var slug   = rdr.GetString(2);
            return $"<a href='https://outiltech.co/productos/{slug}' target='_blank' style='color:#FF6B00;font-weight:700;text-decoration:none;'>📱 Ver {nombre} — ${precio:N0} COP →</a>";
        }
        return $"<a href='https://outiltech.co' target='_blank' style='color:#FF6B00;font-weight:700;text-decoration:none;'>🛍️ Ver {filtro} disponibles →</a>";
    }
    catch { return null; }
}

// ── Helpers JhonIA ────────────────────────────────────────────────────────────

// Clasifica intención del mensaje sin llamar a ninguna API
string ClasificarIntencion(string msg)
{
    var m = msg.ToLowerInvariant();
    if (new[] { "precio","cuánto cuesta","cuanto cuesta","cuánto vale","cuanto vale",
                "quiero","disponible","stock","comprar","cuotas","envío","envio",
                "cotización","cotizacion","financiación","financiacion","pagar","adquirir" }
        .Any(k => m.Contains(k))) return "compra";
    if (new[] { "no funciona","dañado","danado","problema","garantía","garantia",
                "reparar","falla","error","servicio técnico","servicio tecnico",
                "avería","averia","reclamar" }
        .Any(k => m.Contains(k))) return "soporte";
    if (new[] { "qué es","que es","cómo funciona","como funciona","diferencia",
                "comparar","características","caracteristicas","especificaciones",
                "cuál","cual","mejor" }
        .Any(k => m.Contains(k))) return "info";
    if (new[] { "gracias","adiós","adios","chao","hasta luego","ya fue",
                "listo","ok gracias","muchas gracias","fin","bye","hasta pronto",
                "nos vemos","chau","hasta mañana","hasta la próxima","ciao","hasta prox" }
        .Any(k => m.Contains(k))) return "salida";
    return "neutro";
}

// Clasifica sentimiento sin llamar a ninguna API
string ClasificarSentimiento(string msg)
{
    var m = msg.ToLowerInvariant();
    if (new[] { "excelente","perfecto","genial","me gusta","bueno","rápido","rapido",
                "recomiendo","feliz","satisfecho","increíble","increible" }
        .Any(k => m.Contains(k))) return "positivo";
    if (new[] { "malo","pésimo","pesimo","lento","caro","no sirve","decepcionado",
                "terrible","horrible","fraude","no funciona","estafa" }
        .Any(k => m.Contains(k))) return "negativo";
    return "neutro";
}

// Verifica cuántas calls se han hecho a Groq en el último minuto
async Task<int> ContarCallsGroqUltimoMinuto()
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(
            "SELECT COUNT(*) FROM control_api WHERE proveedor='groq' AND timestamp_llamada > NOW() - INTERVAL '60 seconds'", conn);
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }
    catch { return 0; }
}

// Registra una llamada a Groq en control_api
async Task RegistrarLlamadaGroq(string sessionId, int? tokens, int duracionMs)
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(
            "INSERT INTO control_api (proveedor, modelo, session_id, tokens_usados, duracion_ms) VALUES ('groq','llama-3.3-70b-versatile',@sid,@tok,@dur)", conn);
        cmd.Parameters.AddWithValue("sid", sessionId);
        cmd.Parameters.AddWithValue("tok", (object?)tokens ?? DBNull.Value);
        cmd.Parameters.AddWithValue("dur", duracionMs);
        await cmd.ExecuteNonQueryAsync();
        _ = Task.Run(() => SyncJhonToSupabase("control_api", new {
            proveedor = "groq", modelo = "llama-3.3-70b-versatile",
            session_id = sessionId, tokens_usados = tokens, duracion_ms = duracionMs,
            timestamp_llamada = DateTime.UtcNow
        }));
    }
    catch { }
}

// Guarda o actualiza perfil del cliente
async Task ActualizarPerfil(string sessionId, string? email, string? nombre, string? producto)
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(@"
            INSERT INTO perfiles_clientes (session_id, email, nombre, ultima_visita)
            VALUES (@sid, @email, @nombre, NOW())
            ON CONFLICT (session_id) DO UPDATE SET
              ultima_visita = NOW(),
              total_visitas = perfiles_clientes.total_visitas + 1,
              email = COALESCE(@email, perfiles_clientes.email),
              nombre = COALESCE(@nombre, perfiles_clientes.nombre),
              productos_consultados = CASE
                WHEN @prod IS NOT NULL
                THEN array_append(perfiles_clientes.productos_consultados, @prod::TEXT)
                ELSE perfiles_clientes.productos_consultados END", conn);
        cmd.Parameters.AddWithValue("sid",   sessionId);
        cmd.Parameters.AddWithValue("email", (object?)email   ?? DBNull.Value);
        cmd.Parameters.AddWithValue("nombre",(object?)nombre  ?? DBNull.Value);
        cmd.Parameters.AddWithValue("prod",  (object?)producto ?? DBNull.Value);
        await cmd.ExecuteNonQueryAsync();
        _ = Task.Run(() => SyncJhonToSupabase("perfiles_clientes", new {
            session_id = sessionId, email, nombre, ultima_visita = DateTime.UtcNow
        }));
    }
    catch { }
}

// Guarda conversación completa (pregunta + respuesta en una fila)
async Task GuardarConversacion(string sessionId, string? email, string? nombre,
    string pregunta, string respuesta, string nivelRespuesta, string intencion, string sentimiento)
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(@"
            INSERT INTO conversaciones
              (session_id, email, nombre_usuario, role, mensaje, pregunta, respuesta,
               nivel_respuesta, intencion, sentimiento, creado_en)
            VALUES (@sid, @email, @nombre, 'assistant', @preg, @preg, @resp, @nivel, @int, @sent, NOW())", conn);
        cmd.Parameters.AddWithValue("sid",   sessionId);
        cmd.Parameters.AddWithValue("email", (object?)email  ?? DBNull.Value);
        cmd.Parameters.AddWithValue("nombre",(object?)nombre ?? DBNull.Value);
        cmd.Parameters.AddWithValue("preg",  pregunta);
        cmd.Parameters.AddWithValue("resp",  respuesta);
        cmd.Parameters.AddWithValue("nivel", nivelRespuesta);
        cmd.Parameters.AddWithValue("int",   intencion);
        cmd.Parameters.AddWithValue("sent",  sentimiento);
        await cmd.ExecuteNonQueryAsync();
        _ = Task.Run(() => SyncJhonToSupabase("conversaciones", new {
            session_id = sessionId, email, nombre_usuario = nombre,
            pregunta, respuesta, nivel_respuesta = nivelRespuesta,
            intencion, sentimiento, creado_en = DateTime.UtcNow
        }));
    }
    catch (Exception ex) { Console.WriteLine($"[CHATBOT DB] Error GuardarConversacion: {ex.Message}"); }
}

// Menú de bienvenida en formato WhatsApp (texto plano con negritas WhatsApp)
const string WA_MENU = @"¡Hola! Soy *Jhon*, el asistente IA de Outiltech 🤖

Escribe el *número* de la opción o hazme tu pregunta directamente:

*1.* 🛍️ Productos (Precios, stock, disponibilidad)
*2.* 💳 Pagos (Tarjetas, Nequi, cuotas)
*3.* 🚚 Envíos (Tiempos, costos, cobertura nacional)
*4.* 🛡️ Garantías (Apple, Samsung, devoluciones, CPO)
*5.* ℹ️ Sobre nosotros / Contáctanos
*6.* 📋 PQRS o Reclamos
*7.* 👤 Hablar con un asesor personalizado
*8.* 🛒 Soy cliente o mayorista
*9.* 🔧 Servicio técnico (seguimiento)
*10.* 💻 Quiero mi software

¿En qué te puedo ayudar? 😊";

// Procesa un mensaje de WhatsApp a través de JhonIA y devuelve respuesta en texto plano
async Task<string> ProcesarMensajeJhonWA(string fromPhone, string? nombre, string texto, ILogger<Program> logger)
{
    try
    {
        var sessionId = $"wa_{fromPhone.Replace("+","").Replace(" ","")}";

        // Saludos → devolver menú de bienvenida (no necesita DB)
        var textoLower = texto.ToLowerInvariant().Trim();
        var esSaludo = new[] { "hola", "buenos días", "buenas tardes", "buenas noches", "buenas", "hi ", "hey", "inicio", "empezar", "start", "quiero ver los productos", "menu", "menú", "ayuda", "help" }
            .Any(g => textoLower.StartsWith(g) || textoLower == g);
        if (esSaludo)
        {
            return nombre != null
                ? WA_MENU.Replace("¡Hola!", $"¡Hola *{nombre}*!")
                : WA_MENU;
        }

        using var jhonClient = new HttpClient { Timeout = TimeSpan.FromSeconds(28) };
        var jhonPayload = new
        {
            mensaje       = texto,
            historial     = Array.Empty<object>(),
            sessionId,
            email         = (string?)null,
            nombreUsuario = nombre
        };
        var port     = Environment.GetEnvironmentVariable("ASPNETCORE_HTTP_PORT") ?? "3002";
        var jhonResp = await jhonClient.PostAsJsonAsync($"http://localhost:{port}/chatbot/mensaje", jhonPayload);
        var jhonJson = await jhonResp.Content.ReadFromJsonAsync<JsonElement>();
        var respuesta = jhonJson.TryGetProperty("respuesta", out var rp) ? rp.GetString() ?? "" : "";

        // Convertir HTML a texto plano amigable para WhatsApp
        respuesta = System.Text.RegularExpressions.Regex.Replace(respuesta, @"<br\s*/?>", "\n", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        respuesta = System.Text.RegularExpressions.Regex.Replace(respuesta, @"<b>(.*?)</b>", "*$1*", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        respuesta = System.Text.RegularExpressions.Regex.Replace(respuesta, @"<i>(.*?)</i>", "_$1_", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        respuesta = System.Text.RegularExpressions.Regex.Replace(respuesta, @"<a\s+href=['""]([^'""]+)['""][^>]*>(.*?)</a>", "$2: $1", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        respuesta = System.Text.RegularExpressions.Regex.Replace(respuesta, "<[^>]+>", "");
        respuesta = System.Net.WebUtility.HtmlDecode(respuesta).Trim();

        // Si la respuesta incluye el banner de guardar, agregar instrucción WA
        if (respuesta.Contains("¡Fue un placer") || respuesta.Contains("Fue un placer"))
            respuesta += "\n\n_Escribe *menu* para volver al menú principal_";

        return respuesta;
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "[WA] Error en ProcesarMensajeJhonWA");
        return "Lo siento, en este momento no puedo responder. Escríbenos a ventas@outiltech.co o al +57 3133082905.";
    }
}

// Registra par de productos consultados juntos en la misma sesión
// Se llama fire-and-forget tras cada respuesta; detecta categorías en el texto de las preguntas
async Task RegistrarProductosRelacionados(string sessionId)
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();

        // Leer preguntas de la sesión en las últimas 2 horas
        var cmdQ = new NpgsqlCommand(@"
            SELECT pregunta FROM conversaciones
            WHERE session_id=@sid AND pregunta IS NOT NULL
              AND creado_en > NOW() - INTERVAL '2 hours'
            LIMIT 30", conn);
        cmdQ.Parameters.AddWithValue("sid", sessionId);
        await using var rdr = await cmdQ.ExecuteReaderAsync();
        var preguntas = new List<string>();
        while (await rdr.ReadAsync()) preguntas.Add(rdr.GetString(0).ToLowerInvariant());
        await rdr.CloseAsync();

        // Detectar qué categoría de producto menciona cada pregunta
        var mapaCategorias = new Dictionary<string, string[]>
        {
            ["iPhone"]   = new[] { "iphone", "apple" },
            ["Samsung"]  = new[] { "samsung", "galaxy" },
            ["MacBook"]  = new[] { "macbook", "mac book", "laptop apple" },
            ["Patinetas"]= new[] { "patineta", "segway" },
            ["iPad"]     = new[] { "ipad", "tablet apple" },
            ["AirPods"]  = new[] { "airpods", "audífonos apple" },
            ["Watch"]    = new[] { "apple watch", "watch" },
            ["Redmi"]    = new[] { "redmi", "xiaomi" },
            ["Infinix"]  = new[] { "infinix" },
            ["Tecno"]    = new[] { "tecno" },
        };

        var categoriasMencionadas = new HashSet<string>();
        foreach (var preg in preguntas)
            foreach (var (cat, palabras) in mapaCategorias)
                if (palabras.Any(p => preg.Contains(p)))
                    categoriasMencionadas.Add(cat);

        if (categoriasMencionadas.Count < 2) return;

        var lista = categoriasMencionadas.ToList();
        for (int i = 0; i < lista.Count; i++)
        for (int j = i + 1; j < lista.Count; j++)
        {
            var a = string.Compare(lista[i], lista[j], StringComparison.Ordinal) <= 0 ? lista[i] : lista[j];
            var b = string.Compare(lista[i], lista[j], StringComparison.Ordinal) <= 0 ? lista[j] : lista[i];
            var cmdPar = new NpgsqlCommand(@"
                INSERT INTO productos_relacionados (producto_a, producto_b, veces_consultados_juntos, actualizado_en)
                VALUES (@a, @b, 1, NOW())
                ON CONFLICT (producto_a, producto_b) DO UPDATE SET
                  veces_consultados_juntos = productos_relacionados.veces_consultados_juntos + 1,
                  actualizado_en = NOW()", conn);
            cmdPar.Parameters.AddWithValue("a", a);
            cmdPar.Parameters.AddWithValue("b", b);
            await cmdPar.ExecuteNonQueryAsync();
        }
    }
    catch { }
}

// Registra gap de conocimiento cuando JhonIA falla
async Task RegistrarGap(string pregunta)
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(@"
            INSERT INTO gaps_conocimiento (pregunta, veces_fallida)
            VALUES (@preg, 1)
            ON CONFLICT (pregunta) DO UPDATE SET
              veces_fallida = gaps_conocimiento.veces_fallida + 1", conn);
        cmd.Parameters.AddWithValue("preg", pregunta);
        await cmd.ExecuteNonQueryAsync();
        _ = Task.Run(() => SyncJhonToSupabase("gaps_conocimiento", new { pregunta, veces_fallida = 1, resuelta = false, creado_en = DateTime.UtcNow }));
    }
    catch { }
}

// ============================================================
// CHATBOT IA — POST /chatbot/mensaje — 4 Niveles (Groq gratis)
// Nivel 0: clasificación local | Nivel 1: conocimiento_jhon
// Nivel 2: cache trigram       | Nivel 3: límite Groq
// Nivel 4: Groq API con Tool Use
// ============================================================
app.MapPost("/chatbot/mensaje", async (HttpRequest request, IConfiguration configuration, IHttpClientFactory factory, ILogger<Program> logger) =>
{
    JsonElement body;
    try { body = await request.ReadFromJsonAsync<JsonElement>(); }
    catch { return Results.BadRequest(new { error = "JSON inválido" }); }

    var mensaje       = body.TryGetProperty("mensaje",       out var mp) ? mp.GetString() ?? "" : "";
    var sessionId     = body.TryGetProperty("sessionId",     out var sp) ? sp.GetString() ?? Guid.NewGuid().ToString() : Guid.NewGuid().ToString();
    var email         = body.TryGetProperty("email",         out var ep) && ep.ValueKind != JsonValueKind.Null ? ep.GetString() : null;
    var nombreUsuario = body.TryGetProperty("nombreUsuario", out var np) && np.ValueKind != JsonValueKind.Null ? np.GetString() : null;
    var emailEsNuevo  = body.TryGetProperty("emailEsNuevo",  out var en) && en.GetBoolean();

    // Extraer historial para detectar último producto mencionado
    var historialMsgs = new List<(string role, string content)>();
    if (body.TryGetProperty("historial", out var hp) && hp.ValueKind == JsonValueKind.Array)
    {
        foreach (var h in hp.EnumerateArray())
        {
            try
            {
                var role    = h.TryGetProperty("role",    out var rp2) ? rp2.GetString() ?? "" : "";
                var content = h.TryGetProperty("content", out var cp2) ? cp2.GetString() ?? "" : "";
                historialMsgs.Add((role, content));
            }
            catch { /* ignorar mensajes con encoding inválido */ }
        }
    }

    if (string.IsNullOrWhiteSpace(mensaje))
        return Results.BadRequest(new { error = "El mensaje no puede estar vacío" });
    if (mensaje.Length > 500)
        return Results.BadRequest(new { error = "El mensaje no puede exceder 500 caracteres" });

    if (emailEsNuevo && !string.IsNullOrEmpty(email))
        _ = Task.Run(async () => {
            await AsociarEmailSesion(sessionId, email, nombreUsuario);
            await EnviarEmailBienvenidaChatbot(email, nombreUsuario, sessionId);
        });

    // ── NIVEL 0: Clasificación local (0ms, sin BD) ────────────────────
    var intencion   = ClasificarIntencion(mensaje);
    var sentimiento = ClasificarSentimiento(mensaje);
    _ = Task.Run(() => ActualizarPerfil(sessionId, email, nombreUsuario, null));

    // Detectar si usuario indicó insatisfacción
    var mensajeLower = mensaje.ToLowerInvariant();
    var esQueja = new[] { "no entendí","eso no","incorrecto","equivocado","no es lo que","mal","no me ayudaste" }
        .Any(k => mensajeLower.Contains(k));

    var apiKey = Environment.GetEnvironmentVariable("GROQ_API_KEY")
              ?? configuration["GROQ_API_KEY"] ?? "";

    // ── HTML del Menú Principal (reutilizado en salida fuera de contexto y bienvenida) ──
    const string MENU_HTML = @"<div style='line-height:2'>
📋 <b>Menú Principal</b><br><br>
Escribe el número de la opción:<br><br>
<b>1.</b> 🛍️ Productos (Precios, stock, disponibilidad)<br>
<b>2.</b> 💳 Pagos (Tarjetas, Nequi, cuotas)<br>
<b>3.</b> 🚚 Envíos (Tiempos, costos, cobertura nacional)<br>
<b>4.</b> 🛡️ Garantías (Apple, Samsung, devoluciones, CPO)<br>
<b>5.</b> ℹ️ Sobre nosotros / Contáctanos<br>
<b>6.</b> 📋 PQRS o Reclamos<br>
<b>7.</b> 👤 Hablar con un asesor personalizado<br>
<b>8.</b> 🛒 Soy cliente o mayorista<br>
<b>9.</b> 🔧 Servicio técnico (seguimiento)<br>
<b>10.</b> 💻 Quiero mi software
</div>";

    // ── "menu" o "menú" → devolver menú principal ────────────────────
    if (System.Text.RegularExpressions.Regex.IsMatch(mensajeLower.Trim(), @"^men[uú]$"))
        return Results.Ok(new { respuesta = MENU_HTML, fuente = "menu", tieneHtml = true, accion = (object?)null, mostrarBannerGuardar = false });

    // ── OPCIONES DEL MENÚ PRINCIPAL (1-10) ───────────────────────────
    var matchMenu = System.Text.RegularExpressions.Regex.Match(mensaje.Trim(), @"^\s*(10|[1-9])\s*$");
    if (matchMenu.Success)
    {
        var opcion = int.Parse(matchMenu.Value.Trim());
        var mockups = new Dictionary<int, string>
        {
            [1] = @"<div style='line-height:1.8'>🛍️ <b>PRODUCTOS — Precios y Disponibilidad</b><br><br>
Tenemos disponibles:<br>
📱 <b>Celulares:</b> iPhone, Samsung, Redmi, Infinix, Tecno, Oppo, Huawei, Motorola<br>
💻 <b>Computadores:</b> MacBook<br>
🎧 <b>Accesorios Apple:</b> AirPods, Apple Watch, iPad<br>
🛴 <b>Patinetas:</b> Segway<br><br>
Pregúntame por cualquier producto. Ejemplo: ¿cuál es el iPhone más barato?<br><br>
➡️ <a href='https://outiltech.co/productos' target='_blank' style='color:#FF6B00;font-weight:700'>Ver catálogo completo →</a></div>",

            [2] = @"<div style='line-height:1.8'>💳 <b>PAGOS — Métodos disponibles</b><br><br>
✅ Tarjetas de crédito/débito (Visa, Mastercard, Amex)<br>
✅ Nequi / Daviplata<br>
✅ Transferencia bancaria<br>
✅ Cuotas sin intereses (con tarjeta de crédito)<br><br>
Todos los pagos son procesados de forma 100% segura por <b>Wompi</b>.<br><br>
¿Tienes alguna duda sobre un pago? Escríbeme.<br>
➡️ <a href='https://outiltech.co/checkout' target='_blank' style='color:#FF6B00;font-weight:700'>Ir al checkout →</a></div>",

            [3] = @"<div style='line-height:1.8'>🚚 <b>ENVÍOS — Tiempos y Costos</b><br><br>
📍 <b>Bogotá:</b> 1-2 días hábiles<br>
📍 <b>Ciudades principales:</b> 2-3 días hábiles<br>
📍 <b>Resto del país:</b> 3-5 días hábiles<br><br>
El costo se calcula automáticamente al ingresar tu dirección en el checkout.<br>
Realizamos envíos a <b>todo Colombia</b>.<br><br>
➡️ <a href='https://outiltech.co/checkout' target='_blank' style='color:#FF6B00;font-weight:700'>Calcular costo de envío →</a></div>",

            [4] = @"<div style='line-height:1.8'>🛡️ <b>GARANTÍAS Y DEVOLUCIONES</b><br><br>
✅ Apple nuevos: <b>1 año</b> de garantía oficial con el fabricante<br>
✅ Apple CPO (Certified Pre-Owned): <b>6 meses</b> de garantía<br>
✅ Samsung nuevos: <b>1 año</b> con red de servicio autorizada<br>
✅ Devoluciones: hasta <b>15 días</b> después de la entrega<br><br>
¿Tienes un problema con tu producto?<br>
📱 WhatsApp: <b>+57 3133082905</b><br>
📧 ventas@outiltech.co</div>",

            [5] = @"<div style='line-height:1.8'>ℹ️ <b>SOBRE OUTILTECH</b><br><br>
Somos una empresa colombiana con más de <b>8 años</b> de experiencia en tecnología y software a la medida.<br><br>
📍 <b>Tienda física:</b> Carrera 2A No 18A-52, Bogotá<br>
⏰ <b>Lunes-Viernes:</b> 9am-7pm | <b>Sábados:</b> 9am-4pm<br>
📧 ventas@outiltech.co<br>
📱 WhatsApp: +57 3133082905<br><br>
➡️ <a href='https://outiltech.co/contacto' target='_blank' style='color:#FF6B00;font-weight:700'>Ver todos los canales de contacto →</a></div>",

            [6] = @"<div style='line-height:1.8'>📋 <b>PQRS Y RECLAMOS</b><br><br>
Para radicar una <b>Petición, Queja, Reclamo o Sugerencia</b>:<br><br>
📱 WhatsApp: <b>+57 3133082905</b><br>
📧 ventas@outiltech.co<br>
Asunto: <i>[PQRS] + describe tu caso</i><br><br>
Nuestro equipo te responderá en máximo <b>3 días hábiles</b>.<br><br>
➡️ <a href='https://outiltech.co/contacto' target='_blank' style='color:#FF6B00;font-weight:700'>Formulario de contacto →</a></div>",

            [7] = @"<div style='line-height:1.8'>👤 <b>HABLAR CON UN ASESOR</b><br><br>
Nuestro equipo está disponible:<br>
⏰ <b>Lunes-Viernes:</b> 8am-5pm<br>
⏰ <b>Sábados:</b> 9am-1pm<br><br>
📱 WhatsApp: <b>+57 3133082905</b><br>
📧 ventas@outiltech.co<br><br>
➡️ <a href='https://wa.me/573133082905?text=Hola%20quiero%20hablar%20con%20un%20asesor' target='_blank' style='color:#FF6B00;font-weight:700'>💬 Chatear con un asesor ahora →</a></div>",

            [8] = @"<div style='line-height:1.8'>🛒 <b>CLIENTES Y MAYORISTAS</b><br><br>
<b>Si eres cliente:</b><br>
➡️ <a href='https://outiltech.co/productos' target='_blank' style='color:#FF6B00;font-weight:700'>Ver catálogo y precios →</a><br><br>
<b>Si eres mayorista o empresa:</b><br>
Manejamos precios especiales por volumen.<br>
📱 WhatsApp: <b>+57 3133082905</b><br>
📧 ventas@outiltech.co<br><br>
Cuéntanos qué productos y cuántas unidades necesitas y te cotizamos.</div>",

            [9] = @"<div style='line-height:1.8'>🔧 <b>SERVICIO TÉCNICO</b><br><br>
Para hacer seguimiento a tu servicio técnico, indícanos:<br><br>
1️⃣ Número de orden o ticket de servicio<br>
2️⃣ Tipo de equipo (marca y modelo)<br>
3️⃣ Descripción del problema<br><br>
📱 WhatsApp: <b>+57 3133082905</b><br>
📧 ventas@outiltech.co<br><br>
Atención: <b>Lunes-Viernes 9am-7pm</b> | <b>Sábados 9am-4pm</b></div>",

            [10] = @"<div style='line-height:1.8'>💻 <b>QUIERO MI SOFTWARE</b><br><br>
Desarrollamos soluciones tecnológicas a la medida:<br><br>
✅ Aplicaciones Web y PWA<br>
✅ Implementación ISO 27001 (Seguridad de la información)<br>
✅ Análisis Forense Digital<br>
✅ Consultoría DevOps<br>
✅ Creación de IA personalizada (como Jhon!)<br>
✅ Desarrollo Angular + .NET<br><br>
📱 WhatsApp: <b>+57 3133082905</b><br>
📧 ventas@outiltech.co<br><br>
➡️ <a href='https://outiltech.co/servicios' target='_blank' style='color:#FF6B00;font-weight:700'>Ver todos los servicios →</a></div>"
        };

        if (mockups.TryGetValue(opcion, out var mockupHtml))
        {
            _ = Task.Run(() => GuardarConversacion(sessionId, email, nombreUsuario, mensaje, mockupHtml, "menu", intencion, sentimiento));
            return Results.Ok(new { respuesta = mockupHtml, fuente = "menu", tieneHtml = true, accion = (object?)null, mostrarBannerGuardar = false });
        }
    }

    // ── SALIDA: Despedida directa sin Groq + banner guardar conversación ──
    if (intencion == "salida")
    {
        var nb = !string.IsNullOrEmpty(nombreUsuario) ? $", {nombreUsuario}" : "";
        var despedida = $"¡Fue un placer ayudarte{nb}! 😊 Espero verte pronto en Outiltech. Si tienes más dudas en el futuro, aquí estaré. ¡Hasta pronto! 👋";
        _ = Task.Run(() => GuardarConversacion(sessionId, email, nombreUsuario, mensaje, despedida, "salida", intencion, sentimiento));
        return Results.Ok(new { respuesta = despedida, fuente = "salida", tieneHtml = false, accion = (object?)null, mostrarBannerGuardar = true, intencion = "salida" });
    }

    // ── INTENTO DE COMPRA: "agregar al carrito", "lo quiero", "comprar" ──
    var intentoCompra = new[] {
        "agregar al carrito", "agrega al carrito", "agregar a carrito",
        "quiero comprarlo", "quiero comprar", "lo quiero", "me lo llevo",
        "lo compro", "comprar este", "comprar eso", "quiero ese", "quiero esta",
        "quiero este", "lo pido", "hacer pedido", "realizar pedido", "pedir este",
        "añadir al carrito", "add to cart", "comprar ahora", "comprar ya",
        "si quiero", "sí quiero", "si lo quiero", "me interesa comprarlo",
        "saber mas y comprar", "saber más y comprar", "saber mas y compra",
        "quiero comprarlo ahora", "llevarlo", "me lo llevo", "donde compro",
        "como compro", "cómo compro", "quiero ese producto", "hacer la compra",
        "proceder a comprar", "continuar con la compra"
    }.Any(k => mensajeLower.Contains(k));

    if (intentoCompra)
    {
        // Buscar el último enlace de producto en el historial (outiltech.co/productos/slug)
        var slugRegex = new System.Text.RegularExpressions.Regex(@"outiltech\.co/productos/([a-z0-9\-]+)", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        string? ultimoSlug = null;
        string? ultimoNombre = null;

        // Revisar historial de más reciente a más antiguo
        foreach (var msg in historialMsgs.Reverse<(string role, string content)>())
        {
            if (msg.role == "assistant")
            {
                var match = slugRegex.Match(msg.content);
                if (match.Success)
                {
                    ultimoSlug = match.Groups[1].Value;
                    // Extraer nombre del producto del texto (buscar entre * o **)
                    var nombreMatch = System.Text.RegularExpressions.Regex.Match(msg.content, @"\*{1,2}([^*]{3,60}?)\*{1,2}");
                    if (nombreMatch.Success) ultimoNombre = nombreMatch.Groups[1].Value.Trim();
                    break;
                }
            }
        }

        if (ultimoSlug != null)
        {
            var nombre = ultimoNombre ?? ultimoSlug.Replace("-", " ");
            var respCompra = $"¡Perfecto! Puedes ver el producto y realizar tu compra aquí:<br><br>" +
                $"<a href='https://outiltech.co/productos/{ultimoSlug}' target='_blank' " +
                $"style='display:inline-block;background:#FF6B00;color:#fff;padding:10px 18px;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px;'>" +
                $"🛒 Comprar {nombre} →</a><br><br>" +
                $"<span style='font-size:12px;color:rgba(255,255,255,0.6)'>En la página del producto puedes seleccionar cantidad y proceder al pago con tarjeta, Nequi o PSE.</span>";
            return Results.Ok(new { respuesta = respCompra, fuente = "compra", tieneHtml = true, accion = (object?)null, mostrarBannerGuardar = false });
        }
        else
        {
            // No hay producto previo — dirigir al catálogo
            var respSinProducto = $"Para realizar una compra, primero dime qué producto te interesa y te doy el enlace directo 😊<br><br>" +
                $"<a href='https://outiltech.co/productos' target='_blank' style='color:#FF6B00;font-weight:700'>🛍️ Ver catálogo completo →</a>";
            return Results.Ok(new { respuesta = respSinProducto, fuente = "compra", tieneHtml = true, accion = (object?)null, mostrarBannerGuardar = false });
        }
    }

    // ── FUERA DE CONTEXTO: redirigir al menú principal ───────────────
    var keywordsContexto = new[]
    {
        "iphone","samsung","apple","mac","ipad","watch","airpods","celular","telefono","movil","telefono",
        "patineta","segway","precio","cuanto","barato","caro","disponible","stock","envio","enviar",
        "entrega","garantia","devolucion","cambio","pago","nequi","tarjeta","cuota","cuenta","pedido",
        "compra","orden","software","iso","forense","devops","pwa","outiltech","tienda","asesor","whatsapp",
        "servicio","soporte","tecnico","reclamo","pqrs","mayorista","credito","debito","wompi","descuento",
        "oferta","promocion","factura","seguro","dato","correo","email","direccion","ciudad","colombia","envíos",
        "infinix","tecno","redmi","xiaomi","oppo","huawei","motorola","samsung","recibo","garantía","devolución",
        "gratis","producto","catalogo","portafolio","calidad","marca","nuevo","segunda","exhibicion","reacondicionado",
        "hola","buenas","buenos dias","buenas tardes","buenas noches","quien eres","qué puedes","ayuda","necesito",
        "carrito","agregar","agrega","quiero","llevar","pedir","pedido","comprar","interesa","me lo","lo quiero","si quiero",
        "fold","zfold","z fold","flip","galaxy fold","galaxy flip","reno","s25","s24","s23","a79","a80"
    };
    bool esContexto = intencion != "neutro" || keywordsContexto.Any(k => mensajeLower.Contains(k));
    if (!esContexto && mensaje.Trim().Length >= 10)
    {
        var respFuera = "Tu pregunta está fuera de contexto, por favor pregúntame sobre Outiltech y sus servicios o escoge alguna de las opciones del menú principal:<br><br>" + MENU_HTML;
        return Results.Ok(new { respuesta = respFuera, fuente = "menu", tieneHtml = true, accion = (object?)null, mostrarBannerGuardar = false });
    }

    // ── NIVEL 0.5: Consulta dinámica inventario (~15ms, sin Groq) ────
    // Responde preguntas de precio/disponibilidad con datos en tiempo real
    try
    {
        var m05 = mensajeLower
            .Replace("á","a").Replace("é","e").Replace("í","i")
            .Replace("ó","o").Replace("ú","u").Replace("ñ","n");

        var tieneProducto = new[] {
            "iphone","samsung","macbook","laptop","mac ","patineta","ipad",
            "airpods","apple watch","watch","redmi","infinix","tecno","oppo",
            "android","celular","movil","telefono","tablet","galaxy","segway",
            "huawei","motorola","a79","a80","a58","reno","s25","s24","s23",
            "iphone 15","iphone 14","iphone 13","iphone 12","iphone 11",
            "fold","zfold","z fold","galaxy fold","s fold","flip","galaxy flip"
        }.Any(k => m05.Contains(k));

        var tieneIntentoPrecio = new[] {
            "precio","cuanto","cuanto","vale","cuesta","costo","barat","econom",
            "disponible","tienen","stock","cual tienen","muestrame","ver los",
            "catalogo","listar","que tienen","mas barat","mas econom",
            "comprar","adquirir","llevar","quiero el","pedir","ordenar","compro",
            "necesito","busco","necesitas","muestra","dame","quiero ver","mostrar","cual es","quiero un","quiero una"
        }.Any(k => m05.Contains(k));

        if (tieneProducto && tieneIntentoPrecio)
        {
            // Detectar categoría
            string? cat05 = null;
            if (m05.Contains("iphone") || (m05.Contains("apple") && !m05.Contains("watch") && !m05.Contains("mac") && !m05.Contains("ipad")))
                cat05 = "iPhone";
            else if (m05.Contains("samsung") || m05.Contains("galaxy"))
                cat05 = "Samsung";
            else if (m05.Contains("macbook") || m05.Contains("laptop") || (m05.Contains("mac ") && !m05.Contains("samsung")))
                cat05 = "Mac";
            else if (m05.Contains("patineta") || m05.Contains("segway"))
                cat05 = "Patinetas";
            else if (m05.Contains("ipad") || (m05.Contains("tablet") && m05.Contains("apple")))
                cat05 = "iPad";
            else if (m05.Contains("airpods"))
                cat05 = "AirPods";
            else if (m05.Contains("watch") || m05.Contains("reloj"))
                cat05 = "Watch";
            else if (m05.Contains("redmi") || m05.Contains("xiaomi"))
                cat05 = "Redmi";
            else if (m05.Contains("infinix"))
                cat05 = "Infinix";
            else if (m05.Contains("tecno"))
                cat05 = "Tecno";
            else if (m05.Contains("samsung"))
                cat05 = "Samsung";

            // ── Búsqueda por modelo específico (A79, Reno 12, S25, etc.) ──
            // Si el usuario menciona un modelo concreto, buscar directo en DB
            {
                await using var connMod = new NpgsqlConnection(pgConnectionString);
                await connMod.OpenAsync();
                var cmdMod = new NpgsqlCommand(@"
                    SELECT nombre, precio, garantia, slug, disponibilidad, unidades
                    FROM inventario_productos
                    WHERE LOWER(nombre) ILIKE '%' || LOWER(@q) || '%'
                       OR LOWER(modelo) ILIKE '%' || LOWER(@q) || '%'
                       OR LOWER(REPLACE(nombre,' ','')) ILIKE '%' || LOWER(@q) || '%'
                    ORDER BY unidades DESC LIMIT 3", connMod);
                // Extraer palabras clave del mensaje (mínimo 3 letras, no stopwords)
                var stopwords = new HashSet<string>{"que","del","los","las","una","uno","con","por","para","quiero","comprar","tiene","tienen","esta","disponible","precio","cuanto","cuesta","vale","el","la","de","en","un","su","ver","mas","me","hay","si","necesito","busco","muestra","dame","necesitas","mostrar","cual"};
                var palabrasBusqueda = m05.Split(new[]{' ',',','.',';','?','!'}, StringSplitOptions.RemoveEmptyEntries)
                    .Where(p => p.Length >= 3 && !stopwords.Contains(p))
                    .OrderByDescending(p => p.Length)
                    .FirstOrDefault();
                if (palabrasBusqueda != null)
                {
                    cmdMod.Parameters.AddWithValue("q", palabrasBusqueda);
                    await using var rdrMod = await cmdMod.ExecuteReaderAsync();
                    if (await rdrMod.ReadAsync())
                    {
                        var nomM = rdrMod.GetString(0);
                        var preM = rdrMod.GetDecimal(1);
                        var garM = rdrMod.GetString(2);
                        var slgM = rdrMod.GetString(3);
                        var dispM = rdrMod.GetString(4);
                        var uniM = rdrMod.GetInt32(5);
                        string respMod;
                        if (dispM == "Si" && uniM > 0)
                            respMod = $"✅ Sí tenemos el *{nomM}* disponible a **${preM:N0} COP** con garantía de {garM}.\n\n¿Te gustaría comprarlo? <a href='https://outiltech.co/productos/{slgM}' target='_blank' style='color:#FF6B00;font-weight:700'>📱 Ver {nomM} →</a>";
                        else
                            respMod = $"Lo siento, el *{nomM}* no está disponible en este momento. ¿Te puedo mostrar productos similares?";
                        await rdrMod.CloseAsync();
                        _ = Task.Run(() => GuardarConversacion(sessionId, email, nombreUsuario, mensaje, respMod, "inventario", intencion, sentimiento));
                        logger.LogInformation("[JHON N0.5mod] Búsqueda por modelo '{Palabra}' → {Nombre}", palabrasBusqueda, nomM);
                        return Results.Ok(new { respuesta = respMod, fuente = "inventario", tieneHtml = true, accion = (object?)null });
                    }
                }
            }

            if (cat05 != null)
            {
                await using var conn05 = new NpgsqlConnection(pgConnectionString);
                await conn05.OpenAsync();

                // ¿Pregunta por el más barato?
                bool quiereMasBarato = new[] { "barat","econom","menor precio","mas bajo","minimo" }
                    .Any(k => m05.Contains(k));

                if (quiereMasBarato)
                {
                    var cmdMin = new NpgsqlCommand(@"
                        SELECT nombre, precio, garantia, slug FROM inventario_productos
                        WHERE disponibilidad='Si' AND unidades>0 AND LOWER(categoria)=LOWER(@cat)
                        ORDER BY precio ASC LIMIT 1", conn05);
                    cmdMin.Parameters.AddWithValue("cat", cat05);
                    await using var rdrMin = await cmdMin.ExecuteReaderAsync();
                    if (await rdrMin.ReadAsync())
                    {
                        var nom = rdrMin.GetString(0);
                        var pre = rdrMin.GetDecimal(1);
                        var gar = rdrMin.GetString(2);
                        var slg = rdrMin.GetString(3);
                        var resp05 = $"El {cat05} más económico que tenemos es el **{nom}** a **${pre:N0} COP** con garantía de {gar}. " +
                                     $"\n\n<a href='https://outiltech.co/productos/{slg}' target='_blank' style='color:#FF6B00;font-weight:700;text-decoration:none;'>📱 Ver {nom} — ${pre:N0} COP →</a>";
                        _ = Task.Run(() => GuardarConversacion(sessionId, email, nombreUsuario, mensaje, resp05, "inventario", intencion, sentimiento));
                        logger.LogInformation("[JHON N0.5] Respuesta directa inventario — más barato {Cat}", cat05);
                        return Results.Ok(new { respuesta = resp05, fuente = "inventario", tieneHtml = true, accion = (object?)null });
                    }
                }
                else
                {
                    // Listar los primeros 6 ordenados por precio
                    var cmdLst = new NpgsqlCommand(@"
                        SELECT nombre, precio, garantia, slug FROM inventario_productos
                        WHERE disponibilidad='Si' AND unidades>0 AND LOWER(categoria)=LOWER(@cat)
                        ORDER BY precio ASC LIMIT 6", conn05);
                    cmdLst.Parameters.AddWithValue("cat", cat05);
                    await using var rdrLst = await cmdLst.ExecuteReaderAsync();
                    var sb05 = new System.Text.StringBuilder();
                    sb05.AppendLine($"Tenemos estos {cat05} disponibles:\n");
                    bool hay05 = false;
                    string? primerSlug = null; string? primerNombre = null; decimal primerPrecio = 0;
                    while (await rdrLst.ReadAsync())
                    {
                        hay05 = true;
                        var nom = rdrLst.GetString(0);
                        var pre = rdrLst.GetDecimal(1);
                        var gar = rdrLst.GetString(2);
                        var slg = rdrLst.GetString(3);
                        sb05.AppendLine($"• {nom} — ${pre:N0} COP | Garantía: {gar}");
                        if (primerSlug == null) { primerSlug = slg; primerNombre = nom; primerPrecio = pre; }
                    }
                    if (hay05)
                    {
                        sb05.AppendLine($"\n<a href='https://outiltech.co/productos/{primerSlug}' target='_blank' style='color:#FF6B00;font-weight:700;text-decoration:none;'>🛍️ Ver {primerNombre} desde ${primerPrecio:N0} COP →</a>");
                        var resp05 = sb05.ToString();
                        _ = Task.Run(() => GuardarConversacion(sessionId, email, nombreUsuario, mensaje, resp05, "inventario", intencion, sentimiento));
                        logger.LogInformation("[JHON N0.5] Respuesta directa inventario — lista {Cat}", cat05);
                        return Results.Ok(new { respuesta = resp05, fuente = "inventario", tieneHtml = true, accion = (object?)null });
                    }
                }
            }
        }
    }
    catch (Exception ex) { logger.LogWarning("[JHON N0.5] Error: {M}", ex.Message); }

    // ── NIVEL 1: Conocimiento entrenado por admin (0ms Groq) ──────────
    try
    {
        await using var connN1 = new NpgsqlConnection(pgConnectionString);
        await connN1.OpenAsync();
        var cmdN1 = new NpgsqlCommand(
            "SELECT respuesta_oficial, categoria FROM buscar_en_conocimiento_jhon(@preg, 0.70)", connN1);
        cmdN1.Parameters.AddWithValue("preg", mensaje);
        await using var rdrN1 = await cmdN1.ExecuteReaderAsync();
        if (await rdrN1.ReadAsync())
        {
            var respN1 = rdrN1.GetString(0);
            await rdrN1.CloseAsync();
            var cmdUpd = new NpgsqlCommand(
                "UPDATE conocimiento_jhon SET veces_usada = veces_usada + 1 WHERE similarity(pregunta_clave, @preg) > 0.70 AND activo = TRUE", connN1);
            cmdUpd.Parameters.AddWithValue("preg", mensaje);
            await cmdUpd.ExecuteNonQueryAsync();
            _ = Task.Run(() => GuardarConversacion(sessionId, email, nombreUsuario, mensaje, respN1, "entrenamiento", intencion, sentimiento));
            _ = Task.Run(() => RegistrarProductosRelacionados(sessionId));
            logger.LogInformation("[JHON N1] Respuesta desde conocimiento_jhon");
            return Results.Ok(new { respuesta = respN1, fuente = "entrenamiento", accion = (object?)null });
        }
    }
    catch (Exception ex) { logger.LogWarning("[JHON N1] Error: {M}", ex.Message); }

    // ── NIVEL 2: Cache semántico trigram (0ms Groq) ───────────────────
    try
    {
        await using var connN2 = new NpgsqlConnection(pgConnectionString);
        await connN2.OpenAsync();
        var cmdN2 = new NpgsqlCommand(
            "SELECT pregunta_original, respuesta, similitud FROM buscar_respuesta_similar(@preg, 0.65)", connN2);
        cmdN2.Parameters.AddWithValue("preg", mensaje);
        await using var rdrN2 = await cmdN2.ExecuteReaderAsync();
        if (await rdrN2.ReadAsync())
        {
            var respN2 = rdrN2.GetString(1);
            var simN2  = rdrN2.GetFloat(2);
            await rdrN2.CloseAsync();
            var cmdReg = new NpgsqlCommand(
                "SELECT registrar_uso_cache(@sid, @preg, @resp, @sim)", connN2);
            cmdReg.Parameters.AddWithValue("sid",  sessionId);
            cmdReg.Parameters.AddWithValue("preg", mensaje);
            cmdReg.Parameters.AddWithValue("resp", respN2);
            cmdReg.Parameters.AddWithValue("sim",  simN2);
            await cmdReg.ExecuteNonQueryAsync();
            logger.LogInformation("[JHON N2] Respuesta desde cache trigram sim={S:F2}", simN2);
            return Results.Ok(new { respuesta = respN2, fuente = "cache", similitud = simN2, accion = (object?)null });
        }
    }
    catch (Exception ex) { logger.LogWarning("[JHON N2] Error: {M}", ex.Message); }

    // ── NIVEL 3: Verificar límite Groq ───────────────────────────────
    if (string.IsNullOrEmpty(apiKey))
    {
        logger.LogWarning("[CHATBOT] GROQ_API_KEY no configurada");
        return Results.Ok(new { respuesta = "Lo siento, en este momento no puedo responder. Escríbenos a contactanos@outiltech.co o WhatsApp +57 3133082905", accion = (object?)null });
    }

    for (int intento = 0; intento < 3; intento++)
    {
        var callsMinuto = await ContarCallsGroqUltimoMinuto();
        if (callsMinuto < 28) break;
        if (intento == 2)
        {
            logger.LogWarning("[JHON N3] Rate limit Groq alcanzado, retornando mensaje de espera");
            return Results.Ok(new { respuesta = "Jhon está procesando muchas consultas. En unos segundos respondo ⏳ También puedes escribirnos directamente a contactanos@outiltech.co", accion = (object?)null });
        }
        await Task.Delay(2000);
    }

    // ── NIVEL 4: Groq API con Tool Use ───────────────────────────────
    var tzId    = OperatingSystem.IsWindows() ? "SA Pacific Standard Time" : "America/Bogota";
    var horaCol = TimeZoneInfo.ConvertTime(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById(tzId));
    var saludo  = horaCol.Hour switch { >= 5 and < 12 => "buenos días", >= 12 and < 18 => "buenas tardes", _ => "buenas noches" };
    var nombreCtx = string.IsNullOrEmpty(nombreUsuario) ? "" : $" El cliente se llama {nombreUsuario}.";

    // Prefijo por sentimiento
    var prefijo = sentimiento switch {
        "negativo" => "Entiendo tu frustración. Permíteme ayudarte de la mejor manera posible. ",
        _ => ""
    };

    // Inyectar inventario real en el contexto
    var contextoProductos = await ObtenerContextoProductos(mensaje);

    var systemPrompt = $@"Eres Jhon, el asistente IA de Outiltech (outiltech.co). Respondes en español colombiano, tono amable, natural y profesional. Son las {horaCol:HH:mm} ({saludo}).{nombreCtx}

REGLAS OBLIGATORIAS — NUNCA LAS ROMPAS:
1. NUNCA digas 'lo siento', 'no puedo', 'no tengo acceso', 'no encontré' ni ninguna disculpa. SIEMPRE da una respuesta útil.
2. Cuando el cliente pregunta por precios o disponibilidad, usa los datos reales del INVENTARIO que tienes abajo.
3. Si no tienes el dato exacto, orienta al cliente con tu conocimiento de tecnología y sugiere contactarnos.
4. Usa la herramienta buscar_productos para búsquedas más detalladas o cuando el inventario abajo no sea suficiente.
5. Máximo 4 líneas de respuesta. Sé directo y concreto.

INVENTARIO ACTUAL EN TIEMPO REAL:
{contextoProductos}
SERVICIOS OUTILTECH:
- Tienda E-Commerce: 114+ productos (Apple, Samsung, Redmi, Infinix)
- Software a la medida: desde $30.000 COP/hora | Primera consulta GRATIS
- ISO 27001, Forense Digital, PWA, DevOps, Creación de IA y chatbots
- Horario: Lun-Vie 8am-5pm, Sáb 9am-1pm
- Envíos: todo Colombia 1-3 días | Garantías: Apple/Samsung 1 año
- Pagos: tarjeta (Wompi), PSE, Nequi, Efecty, Addi cuotas
- Contacto: contactanos@outiltech.co | WhatsApp +57 3133082905";

    var messagesArr = new System.Text.Json.Nodes.JsonArray();
    messagesArr.Add(new System.Text.Json.Nodes.JsonObject { ["role"] = "system", ["content"] = systemPrompt });

    if (body.TryGetProperty("historial", out var hist) && hist.ValueKind == JsonValueKind.Array)
    {
        foreach (var item in hist.EnumerateArray())
        {
            var r = item.TryGetProperty("role",    out var rp) ? rp.GetString() ?? "" : "";
            var c = item.TryGetProperty("content", out var cp) ? cp.GetString() ?? "" : "";
            if (!string.IsNullOrEmpty(r) && !string.IsNullOrEmpty(c))
                messagesArr.Add(new System.Text.Json.Nodes.JsonObject { ["role"] = r, ["content"] = c });
        }
    }
    messagesArr.Add(new System.Text.Json.Nodes.JsonObject { ["role"] = "user", ["content"] = mensaje });

    var tools = new System.Text.Json.Nodes.JsonArray
    {
        new System.Text.Json.Nodes.JsonObject
        {
            ["type"] = "function",
            ["function"] = new System.Text.Json.Nodes.JsonObject
            {
                ["name"] = "buscar_productos",
                ["description"] = "Busca productos en el catálogo de Outiltech.",
                ["parameters"] = System.Text.Json.Nodes.JsonNode.Parse(@"{""type"":""object"",""properties"":{""query"":{""type"":""string"",""description"":""Nombre, marca o categoría""},""categoria"":{""type"":""string"",""description"":""Apple, Samsung, Redmi, Infinix, etc""}},""required"":[""query""]}")
            }
        },
        new System.Text.Json.Nodes.JsonObject
        {
            ["type"] = "function",
            ["function"] = new System.Text.Json.Nodes.JsonObject
            {
                ["name"] = "redirigir_pagina",
                ["description"] = "Navega al usuario a una sección del sitio web de Outiltech.",
                ["parameters"] = System.Text.Json.Nodes.JsonNode.Parse(@"{""type"":""object"",""properties"":{""seccion"":{""type"":""string"",""description"":""tienda, servicios, contacto, portafolio, iso27001, software, seguridad""}},""required"":[""seccion""]}")
            }
        }
    };

    var swGroq = System.Diagnostics.Stopwatch.StartNew();
    try
    {
        using var client = factory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(45);
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

        var payload = new System.Text.Json.Nodes.JsonObject
        {
            ["model"] = "llama-3.3-70b-versatile", ["max_tokens"] = 1024,
            ["temperature"] = 0.7, ["tools"] = tools, ["tool_choice"] = "auto",
            ["messages"] = messagesArr
        };

        var resp = await client.PostAsJsonAsync("https://api.groq.com/openai/v1/chat/completions", payload);
        var json = await resp.Content.ReadAsStringAsync();
        swGroq.Stop();

        _ = Task.Run(() => RegistrarLlamadaGroq(sessionId, null, (int)swGroq.ElapsedMilliseconds));

        if (!resp.IsSuccessStatusCode)
        {
            logger.LogError("[CHATBOT] Groq error {Status}: {Body}", resp.StatusCode, json);
            _ = Task.Run(() => RegistrarGap(mensaje));
            return Results.Ok(new { respuesta = "Lo siento, en este momento no puedo responder. Escríbenos a contactanos@outiltech.co", accion = (object?)null });
        }

        var parsed       = System.Text.Json.Nodes.JsonNode.Parse(json)!;
        var choice       = parsed["choices"]?[0];
        var finishReason = choice?["finish_reason"]?.GetValue<string>() ?? "";
        var aiMessage    = choice?["message"];

        string respuestaFinal;
        object? accionFinal = null;

        if (finishReason == "tool_calls")
        {
            var toolCall   = aiMessage?["tool_calls"]?.AsArray()?[0];
            var toolCallId = toolCall?["id"]?.GetValue<string>() ?? "";
            var toolName   = toolCall?["function"]?["name"]?.GetValue<string>() ?? "";
            var argsStr    = toolCall?["function"]?["arguments"]?.GetValue<string>() ?? "{}";
            var toolArgs   = System.Text.Json.Nodes.JsonNode.Parse(argsStr);

            string toolResult;
            if (toolName == "buscar_productos")
            {
                var query     = toolArgs?["query"]?.GetValue<string>() ?? "";
                var categoria = toolArgs?["categoria"]?.GetValue<string>() ?? "";
                toolResult = await EjecutarBuscarProductos(query, categoria, logger);
                _ = Task.Run(() => ActualizarPerfil(sessionId, email, nombreUsuario, query));
            }
            else if (toolName == "redirigir_pagina")
            {
                var seccion = toolArgs?["seccion"]?.GetValue<string>() ?? "";
                var urlMap  = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                { ["tienda"]="/",["servicios"]="/servicios",["contacto"]="/contacto",
                  ["portafolio"]="/portafolio",["iso27001"]="/iso27001",
                  ["software"]="/software-medida",["seguridad"]="/seguridad-forense" };
                var url = urlMap.TryGetValue(seccion, out var u) ? u : "/";
                accionFinal = new { tipo = "navegar", url };
                toolResult  = $"Redirigiendo a '{seccion}' ({url}).";
            }
            else { toolResult = "Herramienta no disponible."; }

            var messages2 = messagesArr.DeepClone().AsArray();
            messages2.Add(new System.Text.Json.Nodes.JsonObject
            {
                ["role"] = "assistant",
                ["tool_calls"] = new System.Text.Json.Nodes.JsonArray {
                    new System.Text.Json.Nodes.JsonObject {
                        ["id"]="",["type"]="function",
                        ["function"]=new System.Text.Json.Nodes.JsonObject{["name"]=toolName,["arguments"]=argsStr}
                    }
                }
            });
            messages2.Add(new System.Text.Json.Nodes.JsonObject
            { ["role"]="tool", ["tool_call_id"]=toolCallId, ["content"]=toolResult });

            var payload2 = new System.Text.Json.Nodes.JsonObject
            { ["model"]="llama-3.3-70b-versatile",["max_tokens"]=1024,
              ["temperature"]=0.7,["tool_choice"]="none",["tools"]=tools.DeepClone(),["messages"]=messages2 };

            _ = Task.Run(() => RegistrarLlamadaGroq(sessionId, null, 0));
            var resp2 = await client.PostAsJsonAsync("https://api.groq.com/openai/v1/chat/completions", payload2);
            var json2 = await resp2.Content.ReadAsStringAsync();

            if (!resp2.IsSuccessStatusCode)
            {
                logger.LogError("[CHATBOT] Groq error 2da llamada: {Body}", json2);
                return Results.Ok(new { respuesta = "Lo siento, en este momento no puedo responder. Escríbenos a contactanos@outiltech.co", accion = (object?)null });
            }
            var parsed2 = System.Text.Json.Nodes.JsonNode.Parse(json2)!;
            respuestaFinal = parsed2["choices"]?[0]?["message"]?["content"]?.GetValue<string>() ?? "";
        }
        else
        {
            respuestaFinal = aiMessage?["content"]?.GetValue<string>() ?? "";
        }

        // Sufijo por intención y sentimiento
        if (intencion == "salida")
            respuestaFinal += "\n\n¡Fue un placer ayudarte! ¿Te ayudé hoy? 👍 👎";
        else if (sentimiento == "positivo")
            respuestaFinal += "\n\n¡Me alegra poder ayudarte! ¿Hay algo más en lo que pueda orientarte?";

        bool esFallback = respuestaFinal.Contains("contactanos@outiltech.co") && respuestaFinal.Length < 120;
        if (esFallback || esQueja)
        {
            _ = Task.Run(() => RegistrarGap(mensaje));
            _ = Task.Run(async () => {
                await using var connF = new NpgsqlConnection(pgConnectionString);
                await connF.OpenAsync();
                var cmdF = new NpgsqlCommand(
                    "INSERT INTO conversaciones_fallidas (session_id,pregunta,respuesta_jhon,motivo_falla) VALUES (@s,@p,@r,@m)", connF);
                cmdF.Parameters.AddWithValue("s", sessionId);
                cmdF.Parameters.AddWithValue("p", mensaje);
                cmdF.Parameters.AddWithValue("r", respuestaFinal);
                cmdF.Parameters.AddWithValue("m", esQueja ? "insatisfecho" : "fallback");
                await cmdF.ExecuteNonQueryAsync();
            });
        }

        // ── Post-proceso: markdown → HTML + link producto ─────────────
        // Convertir [texto](url) a <a href>
        respuestaFinal = System.Text.RegularExpressions.Regex.Replace(
            respuestaFinal,
            @"\[([^\]]+)\]\((https?://[^\)]+)\)",
            "<a href='$2' target='_blank' style='color:#FF6B00;font-weight:700;text-decoration:none;'>$1</a>");

        // Agregar link directo al producto si Groq respondió sobre uno concreto
        if (!respuestaFinal.Contains("outiltech.co/productos/"))
        {
            bool respHablaProducto = respuestaFinal.Contains("COP") ||
                new[] {"iphone","samsung","galaxy","macbook","redmi","infinix","tecno",
                       "fold","flip","airpods","ipad","motorola","oppo","huawei","reno"}
                .Any(k => respuestaFinal.ToLowerInvariant().Contains(k));

            if (respHablaProducto)
            {
                try
                {
                    var stopwordsLnk = new HashSet<string>{"que","del","los","las","una","uno","con","por","para","quiero",
                        "comprar","tiene","tienen","esta","disponible","precio","cuanto","cuesta","vale","el","la","de",
                        "en","un","su","ver","mas","me","hay","si","hola","buenas","necesito","dame","puedes","podrias",
                        "favor","alguno","algun","tengo","saber","sobre","acerca","cual","como","donde","cuando"};
                    var m05lnk = mensajeLower.Replace("á","a").Replace("é","e").Replace("í","i").Replace("ó","o").Replace("ú","u");
                    var palabrasBusq = m05lnk.Split(new[]{' ',',','.',';','?','!'}, StringSplitOptions.RemoveEmptyEntries)
                        .Where(p => p.Length >= 3 && !stopwordsLnk.Contains(p))
                        .OrderByDescending(p => p.Length)
                        .ToList();
                    bool linkEncontrado = false;
                    foreach (var palabraBusq in palabrasBusq)
                    {
                        if (linkEncontrado) break;
                        await using var connLnk = new NpgsqlConnection(pgConnectionString);
                        await connLnk.OpenAsync();
                        var cmdLnk = new NpgsqlCommand(@"
                            SELECT nombre, precio, slug FROM inventario_productos
                            WHERE disponibilidad='Si' AND unidades>0
                              AND (LOWER(nombre) ILIKE '%'||@q||'%'
                                OR LOWER(modelo) ILIKE '%'||@q||'%'
                                OR LOWER(REPLACE(nombre,' ','')) ILIKE '%'||@q||'%')
                            ORDER BY unidades DESC LIMIT 1", connLnk);
                        cmdLnk.Parameters.AddWithValue("q", palabraBusq);
                        await using var rdrLnk = await cmdLnk.ExecuteReaderAsync();
                        if (await rdrLnk.ReadAsync())
                        {
                            var nomLnk = rdrLnk.GetString(0);
                            var preLnk = rdrLnk.GetDecimal(1);
                            var slgLnk = rdrLnk.GetString(2);
                            respuestaFinal += $"\n\n<a href='https://outiltech.co/productos/{slgLnk}' target='_blank' " +
                                $"style='display:inline-block;background:#FF6B00;color:#fff;padding:9px 16px;" +
                                $"border-radius:8px;font-weight:700;text-decoration:none;font-size:13px;'>" +
                                $"🛒 Ver y comprar {nomLnk} →</a>";
                            linkEncontrado = true;
                        }
                    }
                    if (!linkEncontrado)
                    {
                        var linkProducto = await GenerarLinkProducto(mensaje);
                        if (linkProducto != null) respuestaFinal += $"\n\n{linkProducto}";
                    }
                }
                catch
                {
                    var linkProducto = await GenerarLinkProducto(mensaje);
                    if (linkProducto != null) respuestaFinal += $"\n\n{linkProducto}";
                }
            }
        }

        bool tieneHtml = respuestaFinal.Contains("<a href");

        // ── Auto-aprendizaje: guardar respuestas valiosas en conocimiento_jhon ──
        bool esRespuestaNegativa =
            respuestaFinal.Contains("no tenemos") || respuestaFinal.Contains("no contamos") ||
            respuestaFinal.Contains("no disponible") || respuestaFinal.Contains("no están disponible") ||
            respuestaFinal.Contains("no se encuentra") || respuestaFinal.Contains("no hay stock");

        bool esRespuestaValiosa =
            !esRespuestaNegativa &&
            (respuestaFinal.Contains("COP") || respuestaFinal.Contains("stock") ||
             respuestaFinal.Contains("disponible") || respuestaFinal.Contains("precio") ||
             respuestaFinal.Contains("garantía") || respuestaFinal.Contains("garantia") ||
             respuestaFinal.Contains("envío") || respuestaFinal.Contains("envio"));

        if (esRespuestaValiosa && (intencion == "info" || intencion == "compra"))
        {
            _ = Task.Run(async () => {
                try
                {
                    await using var connAL = new NpgsqlConnection(pgConnectionString);
                    await connAL.OpenAsync();
                    var respLimpia = System.Text.RegularExpressions.Regex.Replace(respuestaFinal, "<[^>]+>", "").Trim();
                    var cmdAL = new NpgsqlCommand(@"
                        INSERT INTO conocimiento_jhon (pregunta_clave, respuesta_oficial, categoria, creado_por)
                        VALUES (@preg, @resp, @cat, 'jhon_autolearn')
                        ON CONFLICT DO NOTHING", connAL);
                    cmdAL.Parameters.AddWithValue("preg", mensaje);
                    cmdAL.Parameters.AddWithValue("resp", respLimpia[..Math.Min(respLimpia.Length, 800)]);
                    cmdAL.Parameters.AddWithValue("cat",  intencion == "compra" ? "PRODUCTOS" : "INFO");
                    await cmdAL.ExecuteNonQueryAsync();
                }
                catch { }
            });
        }

        _ = Task.Run(() => GuardarConversacion(sessionId, email, nombreUsuario, mensaje, respuestaFinal, "groq_api", intencion, sentimiento));
        _ = Task.Run(() => RegistrarProductosRelacionados(sessionId));
        logger.LogInformation("[CHATBOT N4] Groq OK — sesión {Sid} intencion={I} sent={S}", sessionId.Length >= 8 ? sessionId[..8] : sessionId, intencion, sentimiento);

        var mostrarEscaladaWA = (intencion == "soporte") ||
            (sentimiento == "negativo");
        return Results.Ok(new { respuesta = prefijo + respuestaFinal, fuente = "groq", accion = accionFinal, mostrarEscaladaWA, intencion, tieneHtml });
    }
    catch (TaskCanceledException)
    {
        logger.LogWarning("[CHATBOT] Timeout Groq API");
        return Results.Ok(new { respuesta = "Lo siento, la respuesta tardó demasiado. Escríbenos a contactanos@outiltech.co", accion = (object?)null });
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "[CHATBOT] Error inesperado");
        return Results.Ok(new { respuesta = "Lo siento, en este momento no puedo responder. Escríbenos a contactanos@outiltech.co", accion = (object?)null });
    }
});

// ── GET /chatbot/historial/{sessionId} ────────────────────────────────────────
app.MapGet("/chatbot/historial/{sessionId}", async (string sessionId, ILogger<Program> logger) =>
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        // Devuelve tanto filas role/mensaje antiguas como nuevas pregunta/respuesta
        var cmd = new NpgsqlCommand(@"
            SELECT
              COALESCE(role, 'user')           AS role,
              COALESCE(mensaje, pregunta, '')  AS content,
              creado_en
            FROM conversaciones
            WHERE session_id = @sid
              AND (mensaje IS NOT NULL OR pregunta IS NOT NULL)
            ORDER BY creado_en ASC LIMIT 50", conn);
        cmd.Parameters.AddWithValue("sid", sessionId);
        await using var reader = await cmd.ExecuteReaderAsync();
        var mensajes = new List<object>();
        while (await reader.ReadAsync())
            mensajes.Add(new { role = reader.GetString(0), content = reader.GetString(1), creadoEn = reader.GetDateTime(2) });
        return Results.Ok(new { mensajes });
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "[CHATBOT] Error cargando historial");
        return Results.Ok(new { mensajes = new List<object>() });
    }
});

// ── GET /chatbot/perfil/{sessionId} ───────────────────────────────────────────
app.MapGet("/chatbot/perfil/{sessionId}", async (string sessionId) =>
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(
            "SELECT session_id,email,nombre,productos_consultados,total_visitas,satisfaccion_promedio,segmento,ultima_visita,primera_visita FROM perfiles_clientes WHERE session_id=@sid", conn);
        cmd.Parameters.AddWithValue("sid", sessionId);
        await using var r = await cmd.ExecuteReaderAsync();
        if (!await r.ReadAsync()) return Results.Ok(new { perfil = (object?)null });
        return Results.Ok(new { perfil = new {
            sessionId       = r.GetString(0),
            email           = r.IsDBNull(1) ? null : r.GetString(1),
            nombre          = r.IsDBNull(2) ? null : r.GetString(2),
            totalVisitas    = r.GetInt32(4),
            satisfaccion    = r.IsDBNull(5) ? 0m : r.GetDecimal(5),
            segmento        = r.GetString(6),
            ultimaVisita    = r.GetDateTime(7),
            primeraVisita   = r.GetDateTime(8)
        }});
    }
    catch { return Results.Ok(new { perfil = (object?)null }); }
});

// ── GET /chatbot/estadisticas/hoy ─────────────────────────────────────────────
app.MapGet("/chatbot/estadisticas/hoy", async () =>
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmdStat = new NpgsqlCommand(
            "SELECT total_conversaciones,respuestas_desde_cache,respuestas_desde_groq,respuestas_desde_entrenamiento,total_escalaciones_wa FROM estadisticas_jhon WHERE fecha=CURRENT_DATE", conn);
        await using var r = await cmdStat.ExecuteReaderAsync();
        int total=0,cache=0,groq=0,ent=0,esc=0;
        if (await r.ReadAsync()) { total=r.GetInt32(0);cache=r.GetInt32(1);groq=r.GetInt32(2);ent=r.GetInt32(3);esc=r.GetInt32(4); }
        await r.CloseAsync();
        var cmdGroq = new NpgsqlCommand("SELECT calls_ultimo_minuto,limite_por_minuto,calls_hoy,limite_diario,porcentaje_usado_hoy FROM v_estado_groq", conn);
        await using var r2 = await cmdGroq.ExecuteReaderAsync();
        long callsMin=0,limMin=30,callsHoy=0,limDia=14400; decimal pct=0;
        if (await r2.ReadAsync()) { callsMin=r2.GetInt64(0);limMin=r2.GetInt64(1);callsHoy=r2.GetInt64(2);limDia=r2.GetInt64(3);pct=r2.IsDBNull(4)?0m:r2.GetDecimal(4); }
        return Results.Ok(new { total,cache,groq,entrenamiento=ent,escalacionesWA=esc,
            ahorroSinGroq=total>0?Math.Round((cache+ent)*100.0/total,1):0.0,
            groqHoy=callsHoy,groqLimiteDiario=limDia,groqPorcentajeUsado=pct,
            groqUltimoMinuto=callsMin,groqLimiteMinuto=limMin });
    }
    catch { return Results.Ok(new { error = "Sin datos" }); }
});

// ── GET /chatbot/rendimiento ───────────────────────────────────────────────────
app.MapGet("/chatbot/rendimiento", async () =>
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(
            "SELECT fecha,total_conversaciones,respuestas_desde_cache,respuestas_desde_groq,respuestas_desde_entrenamiento FROM estadisticas_jhon WHERE fecha >= CURRENT_DATE - INTERVAL '7 days' ORDER BY fecha ASC", conn);
        await using var r = await cmd.ExecuteReaderAsync();
        var datos = new List<object>();
        while (await r.ReadAsync())
            datos.Add(new { fecha=r.GetDateTime(0).ToString("yyyy-MM-dd"),total=r.GetInt32(1),cache=r.GetInt32(2),groq=r.GetInt32(3),entrenamiento=r.GetInt32(4) });
        return Results.Ok(new { datos });
    }
    catch { return Results.Ok(new { datos = new List<object>() }); }
});

// ── GET /chatbot/gaps ──────────────────────────────────────────────────────────
app.MapGet("/chatbot/gaps", async () =>
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(
            "SELECT id,pregunta,veces_fallida,resuelta,creado_en FROM gaps_conocimiento WHERE resuelta=FALSE ORDER BY veces_fallida DESC LIMIT 50", conn);
        await using var r = await cmd.ExecuteReaderAsync();
        var gaps = new List<object>();
        while (await r.ReadAsync())
            gaps.Add(new { id=r.GetInt32(0),pregunta=r.GetString(1),vecesFallida=r.GetInt32(2),resuelta=r.GetBoolean(3),creadoEn=r.GetDateTime(4) });
        return Results.Ok(new { gaps });
    }
    catch { return Results.Ok(new { gaps = new List<object>() }); }
});

// ── POST /chatbot/entrenar ─────────────────────────────────────────────────────
app.MapPost("/chatbot/entrenar", async (HttpRequest request) =>
{
    JsonElement body;
    try { body = await request.ReadFromJsonAsync<JsonElement>(); }
    catch { return Results.BadRequest(); }
    var pregunta  = body.TryGetProperty("pregunta_clave",    out var pp) ? pp.GetString() ?? "" : "";
    var respuesta = body.TryGetProperty("respuesta_oficial", out var rp) ? rp.GetString() ?? "" : "";
    var categoria = body.TryGetProperty("categoria",         out var cp) ? cp.GetString() ?? "OTROS" : "OTROS";
    var gapId     = body.TryGetProperty("gapId",             out var gp) && gp.ValueKind != JsonValueKind.Null ? (int?)gp.GetInt32() : null;
    if (string.IsNullOrWhiteSpace(pregunta) || string.IsNullOrWhiteSpace(respuesta))
        return Results.BadRequest(new { error = "pregunta_clave y respuesta_oficial son obligatorios" });
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(
            "INSERT INTO conocimiento_jhon (pregunta_clave,respuesta_oficial,categoria) VALUES (@preg,@resp,@cat)", conn);
        cmd.Parameters.AddWithValue("preg", pregunta);
        cmd.Parameters.AddWithValue("resp", respuesta);
        cmd.Parameters.AddWithValue("cat",  categoria);
        await cmd.ExecuteNonQueryAsync();
        _ = Task.Run(() => SyncJhonToSupabase("conocimiento_jhon", new {
            pregunta_clave = pregunta, respuesta_oficial = respuesta, categoria, activo = true, creado_en = DateTime.UtcNow
        }));
        if (gapId.HasValue)
        {
            var cmdGap = new NpgsqlCommand(
                "UPDATE gaps_conocimiento SET resuelta=TRUE,respuesta_admin=@resp,resuelta_en=NOW() WHERE id=@id", conn);
            cmdGap.Parameters.AddWithValue("resp", respuesta);
            cmdGap.Parameters.AddWithValue("id",   gapId.Value);
            await cmdGap.ExecuteNonQueryAsync();
        }
        return Results.Ok(new { ok = true, mensaje = "Conocimiento agregado a JhonIA" });
    }
    catch (Exception ex) { return Results.Problem(ex.Message); }
});

// ── GET /chatbot/conocimiento ──────────────────────────────────────────────────
app.MapGet("/chatbot/conocimiento", async () =>
{
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(
            "SELECT id,pregunta_clave,respuesta_oficial,categoria,veces_usada,activo,creado_en FROM conocimiento_jhon WHERE activo=TRUE ORDER BY veces_usada DESC", conn);
        await using var r = await cmd.ExecuteReaderAsync();
        var items = new List<object>();
        while (await r.ReadAsync())
            items.Add(new { id=r.GetInt32(0),preguntaClave=r.GetString(1),respuestaOficial=r.GetString(2),
                categoria=r.IsDBNull(3)?null:r.GetString(3),vecesUsada=r.GetInt32(4),activo=r.GetBoolean(5),creadoEn=r.GetDateTime(6) });
        return Results.Ok(new { items });
    }
    catch { return Results.Ok(new { items = new List<object>() }); }
});

// ── PUT /chatbot/conocimiento/{id} ────────────────────────────────────────────
app.MapPut("/chatbot/conocimiento/{id:int}", async (int id, HttpRequest request) =>
{
    JsonElement body;
    try { body = await request.ReadFromJsonAsync<JsonElement>(); }
    catch { return Results.BadRequest(); }
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        if (body.TryGetProperty("activo", out var ap) && ap.ValueKind == JsonValueKind.False)
        {
            var cmd = new NpgsqlCommand("UPDATE conocimiento_jhon SET activo=FALSE,actualizado_en=NOW() WHERE id=@id", conn);
            cmd.Parameters.AddWithValue("id", id);
            await cmd.ExecuteNonQueryAsync();
            return Results.Ok(new { ok = true });
        }
        if (body.TryGetProperty("respuesta_oficial", out var rp))
        {
            var cmd = new NpgsqlCommand("UPDATE conocimiento_jhon SET respuesta_oficial=@r,actualizado_en=NOW() WHERE id=@id", conn);
            cmd.Parameters.AddWithValue("r", rp.GetString() ?? "");
            cmd.Parameters.AddWithValue("id", id);
            await cmd.ExecuteNonQueryAsync();
        }
        return Results.Ok(new { ok = true });
    }
    catch (Exception ex) { return Results.Problem(ex.Message); }
});

// ── POST /chatbot/satisfaccion ─────────────────────────────────────────────────
app.MapPost("/chatbot/satisfaccion", async (HttpRequest request) =>
{
    JsonElement body;
    try { body = await request.ReadFromJsonAsync<JsonElement>(); }
    catch { return Results.BadRequest(); }
    var sessionId = body.TryGetProperty("sessionId", out var sp) ? sp.GetString() ?? "" : "";
    var voto      = body.TryGetProperty("voto",      out var vp) ? vp.GetString() ?? "" : "";
    var valor     = voto == "positivo" ? 1.0m : 0.0m;
    try
    {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        var cmd = new NpgsqlCommand(@"
            INSERT INTO perfiles_clientes (session_id, satisfaccion_promedio)
            VALUES (@sid, @val)
            ON CONFLICT (session_id) DO UPDATE SET
              satisfaccion_promedio = (perfiles_clientes.satisfaccion_promedio + @val) / 2.0,
              ultima_visita = NOW()", conn);
        cmd.Parameters.AddWithValue("sid", sessionId);
        cmd.Parameters.AddWithValue("val", valor);
        await cmd.ExecuteNonQueryAsync();
        return Results.Ok(new { ok = true });
    }
    catch { return Results.Ok(new { ok = false }); }
});

// ── POST /chatbot/fin-sesion ───────────────────────────────────────────────────
app.MapPost("/chatbot/fin-sesion", async (HttpRequest request, ILogger<Program> logger) =>
{
    JsonElement body;
    try { body = await request.ReadFromJsonAsync<JsonElement>(); }
    catch { return Results.Ok(); }

    var sessionId = body.TryGetProperty("sessionId", out var sp) ? sp.GetString() ?? "" : "";
    var email     = body.TryGetProperty("email",     out var ep) && ep.ValueKind != JsonValueKind.Null ? ep.GetString() : null;
    var nombre    = body.TryGetProperty("nombre",    out var np) && np.ValueKind != JsonValueKind.Null ? np.GetString() : null;

    if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(sessionId))
    {
        var total = await ContarMensajesSesion(sessionId);
        if (total >= 4)
            _ = Task.Run(() => EnviarTranscriptoEmail(email, nombre, sessionId));
    }

    logger.LogInformation("[CHATBOT] Sesión cerrada: {Sid}", sessionId.Length > 8 ? sessionId[..8] : sessionId);
    return Results.Ok();
});

// ════════════════════════════════════════════════════════════════
// WHATSAPP BUSINESS CLOUD API — JhonIA en WhatsApp
// Credenciales: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN
// ════════════════════════════════════════════════════════════════

// ── GET /webhook/whatsapp — Verificación Meta ─────────────────
app.MapGet("/webhook/whatsapp", (HttpRequest request) =>
{
    var mode      = request.Query["hub.mode"].FirstOrDefault()         ?? "";
    var token     = request.Query["hub.verify_token"].FirstOrDefault() ?? "";
    var challenge = request.Query["hub.challenge"].FirstOrDefault()    ?? "";

    var verifyToken = Environment.GetEnvironmentVariable("WHATSAPP_VERIFY_TOKEN") ?? "jhon_outiltech_2026";

    if (mode == "subscribe" && token == verifyToken)
        return Results.Text(challenge, "text/plain");

    return Results.Forbid();
});

// ── POST /webhook/whatsapp — Mensajes entrantes (Meta Cloud API) ──
app.MapPost("/webhook/whatsapp", async (HttpRequest request, ILogger<Program> logger) =>
{
    JsonElement body;
    try { body = await request.ReadFromJsonAsync<JsonElement>(); }
    catch { return Results.Ok(); }

    try
    {
        var waToken = Environment.GetEnvironmentVariable("WHATSAPP_TOKEN")           ?? "";
        var phoneId = Environment.GetEnvironmentVariable("WHATSAPP_PHONE_NUMBER_ID") ?? "";
        if (string.IsNullOrEmpty(waToken) || string.IsNullOrEmpty(phoneId))
        { logger.LogWarning("[WA-META] Variables no configuradas"); return Results.Ok(); }

        if (!body.TryGetProperty("entry", out var entries) || entries.GetArrayLength() == 0) return Results.Ok();
        var change = entries[0].GetProperty("changes")[0].GetProperty("value");
        if (!change.TryGetProperty("messages", out var msgs) || msgs.GetArrayLength() == 0) return Results.Ok();

        var msgObj = msgs[0];
        if (msgObj.TryGetProperty("type", out var t) && t.GetString() != "text") return Results.Ok();
        var fromPhone = msgObj.GetProperty("from").GetString() ?? "";
        var texto     = msgObj.GetProperty("text").GetProperty("body").GetString() ?? "";
        string? nombreWa = null;
        if (change.TryGetProperty("contacts", out var contacts) && contacts.GetArrayLength() > 0)
            nombreWa = contacts[0].TryGetProperty("profile", out var prof) && prof.TryGetProperty("name", out var n) ? n.GetString() : null;

        var respuesta = await ProcesarMensajeJhonWA(fromPhone, nombreWa, texto, logger);

        using var waClient = new HttpClient();
        waClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {waToken}");
        var waResp = await waClient.PostAsJsonAsync($"https://graph.facebook.com/v20.0/{phoneId}/messages",
            new { messaging_product = "whatsapp", to = fromPhone, type = "text", text = new { body = respuesta } });
        var waRespBody = await waResp.Content.ReadAsStringAsync();
        if (waResp.IsSuccessStatusCode)
            logger.LogInformation("[WA-META] OK enviado a {Phone}: {Body}", fromPhone, waRespBody);
        else
            logger.LogError("[WA-META] ERROR enviando a {Phone} ({Status}): {Body}", fromPhone, (int)waResp.StatusCode, waRespBody);
    }
    catch (Exception ex) { logger.LogError(ex, "[WA-META] Error"); }
    return Results.Ok();
});

// ── POST /webhook/whatsapp/twilio — Mensajes entrantes (Twilio) ──
// Twilio envía form-urlencoded: From=whatsapp:+57XXX, Body=texto
app.MapPost("/webhook/whatsapp/twilio", async (HttpRequest request, ILogger<Program> logger) =>
{
    try
    {
        var twilioSid   = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID")  ?? "";
        var twilioToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN")   ?? "";
        var twilioFrom  = Environment.GetEnvironmentVariable("TWILIO_WHATSAPP_FROM") ?? ""; // ej: whatsapp:+14155238886

        if (string.IsNullOrEmpty(twilioSid) || string.IsNullOrEmpty(twilioToken))
        { logger.LogWarning("[WA-TWILIO] Variables TWILIO_* no configuradas"); return Results.Ok(); }

        var form        = await request.ReadFormAsync();
        var fromRaw     = form["From"].FirstOrDefault()        ?? ""; // "whatsapp:+573133082905"
        var texto       = form["Body"].FirstOrDefault()        ?? "";
        var profileName = form["ProfileName"].FirstOrDefault() ?? "";
        var fromPhone   = fromRaw.Replace("whatsapp:", "").Trim();
        var nombreWaTwilio = string.IsNullOrWhiteSpace(profileName) ? (string?)null : profileName;

        if (string.IsNullOrWhiteSpace(fromPhone) || string.IsNullOrWhiteSpace(texto))
            return Results.Ok();

        logger.LogInformation("[WA-TWILIO] Mensaje de {Phone} ({Nombre}): {Txt}", fromPhone, profileName, texto[..Math.Min(texto.Length, 60)]);

        var respuesta = await ProcesarMensajeJhonWA(fromPhone, nombreWaTwilio, texto, logger);
        logger.LogInformation("[WA-TWILIO] Enviando respuesta ({Len} chars): {Preview}", respuesta.Length, respuesta[..Math.Min(respuesta.Length, 80)]);

        // Enviar respuesta vía API Twilio con retry para 429
        using var client = new HttpClient();
        var credentials = Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"{twilioSid}:{twilioToken}"));
        client.DefaultRequestHeaders.Add("Authorization", $"Basic {credentials}");

        var toWa   = $"whatsapp:{fromPhone}";
        var fromWa = twilioFrom.StartsWith("whatsapp:") ? twilioFrom : $"whatsapp:{twilioFrom}";

        int[] retryDelays = [1000, 2000, 4000];
        HttpResponseMessage? resp = null;
        foreach (var delay in retryDelays.Prepend(0))
        {
            if (delay > 0) await Task.Delay(delay);
            var payload = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string,string>("From", fromWa),
                new KeyValuePair<string,string>("To",   toWa),
                new KeyValuePair<string,string>("Body", respuesta)
            });
            resp = await client.PostAsync(
                $"https://api.twilio.com/2010-04-01/Accounts/{twilioSid}/Messages.json", payload);
            if ((int)resp.StatusCode != 429) break;
            var errorBody = await resp.Content.ReadAsStringAsync();
            logger.LogWarning("[WA-TWILIO] 429 — body: {Body}", errorBody[..Math.Min(errorBody.Length, 200)]);
        }
        var statusCode = resp == null ? 0 : (int)resp.StatusCode;
        logger.LogInformation("[WA-TWILIO] Respuesta enviada a {Phone} — HTTP {Status}", fromPhone, statusCode);
    }
    catch (Exception ex) { logger.LogError(ex, "[WA-TWILIO] Error"); }

    // Twilio espera TwiML vacío o 200 OK
    return Results.Content("<?xml version='1.0' encoding='UTF-8'?><Response></Response>", "text/xml");
});

// ============================================================
// SCANNER MÓVIL — SESIONES DE ESCANEO REMOTO
// Las sesiones son de corta vida (15 min) y sin autenticación JWT
// protegidas solo por el token de sesión (UUID)
// ============================================================
var scanSessions = new ConcurrentDictionary<string, (string? Codigo, DateTime Creado)>();
var cleanupTimer = new System.Threading.Timer(_ => {
    var cutoff = DateTime.UtcNow.AddHours(-8);
    foreach (var k in scanSessions.Keys.ToArray())
        if (scanSessions.TryGetValue(k, out var s) && s.Creado < cutoff)
            scanSessions.TryRemove(k, out var _removed);
}, null, TimeSpan.FromMinutes(30), TimeSpan.FromHours(1));

// POST /scan/session — cajera crea sesión (requiere auth)
app.MapPost("/scan/session", () => {
    var token = Guid.NewGuid().ToString("N")[..20];
    scanSessions[token] = (null, DateTime.UtcNow);
    return Results.Ok(new { token });
}).RequireAuthorization();

// GET /scan/session/{token} — cajera consulta resultado (requiere auth)
app.MapGet("/scan/session/{token}", (string token) => {
    if (!scanSessions.TryGetValue(token, out var session))
        return Results.NotFound(new { error = "Sesión no encontrada o expirada" });
    return Results.Ok(new { token, resultado = session.Codigo, pendiente = session.Codigo == null });
}).RequireAuthorization();

// POST /scan/session/{token}/resultado — móvil envía el código (SIN auth)
app.MapPost("/scan/session/{token}/resultado", async (string token, HttpContext ctx) => {
    JsonElement body;
    try { body = await JsonSerializer.DeserializeAsync<JsonElement>(ctx.Request.Body); }
    catch { return Results.BadRequest(new { error = "JSON inválido" }); }
    var codigo = body.TryGetProperty("codigo", out var c) ? c.GetString() : null;
    if (string.IsNullOrEmpty(codigo)) return Results.BadRequest(new { error = "Código requerido" });
    if (!scanSessions.ContainsKey(token)) return Results.NotFound(new { error = "Sesión no encontrada" });
    scanSessions[token] = (codigo, scanSessions[token].Creado);
    return Results.Ok(new { ok = true, mensaje = "Código recibido. Puedes cerrar esta página." });
});

// DELETE /scan/session/{token} — cajera cancela sesión (requiere auth)
app.MapDelete("/scan/session/{token}", (string token) => {
    scanSessions.TryRemove(token, out var _removed);
    return Results.Ok();
}).RequireAuthorization();

// POST /scan/session/{token}/foto — móvil sube foto de producto no encontrado (SIN auth)
app.MapPost("/scan/session/{token}/foto", async (string token, HttpContext ctx) => {
    JsonElement body;
    try { body = await JsonSerializer.DeserializeAsync<JsonElement>(ctx.Request.Body, new JsonSerializerOptions(), ctx.RequestAborted); }
    catch { return Results.BadRequest(new { error = "JSON inválido" }); }

    var referencia  = body.TryGetProperty("referencia", out var rp)  ? rp.GetString() ?? "" : "";
    var notas       = body.TryGetProperty("notas",       out var np)  ? np.GetString() ?? "" : "";
    var imagenB64   = body.TryGetProperty("imagen",      out var ip)  ? ip.GetString() ?? "" : "";
    var mimeType    = body.TryGetProperty("mimeType",    out var mp)  ? mp.GetString() ?? "image/jpeg" : "image/jpeg";
    var tokenSesion = token;

    if (string.IsNullOrEmpty(imagenB64))
        return Results.BadRequest(new { error = "Imagen requerida" });

    try {
        await using var conn = new NpgsqlConnection(pgConnectionString);
        await conn.OpenAsync();
        await using var cmd = new NpgsqlCommand(@"
            INSERT INTO inventario_por_imagen (referencia, notas, imagen_base64, mime_type, token_sesion)
            VALUES (@ref, @notas, @img, @mime, @tok)
            RETURNING id", conn);
        cmd.Parameters.AddWithValue("@ref",   referencia);
        cmd.Parameters.AddWithValue("@notas", notas);
        cmd.Parameters.AddWithValue("@img",   imagenB64);
        cmd.Parameters.AddWithValue("@mime",  mimeType);
        cmd.Parameters.AddWithValue("@tok",   tokenSesion);
        var id = (int)(cmd.ExecuteScalar() ?? 0);
        return Results.Ok(new { ok = true, id, mensaje = "Foto guardada. La cajera la revisará pronto." });
    } catch (Exception ex) {
        Console.WriteLine($"[SCAN FOTO] Error: {ex.Message}");
        return Results.StatusCode(500);
    }
});

// GET /scan/inventario-por-imagen — cajera lista fotos pendientes (requiere auth)
app.MapGet("/scan/inventario-por-imagen", async (bool? revisado) => {
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    var filtro = revisado.HasValue ? "WHERE revisado = @rev" : "";
    await using var cmd = new NpgsqlCommand($@"
        SELECT id, referencia, notas, mime_type, fecha, cajera, token_sesion, revisado,
               LEFT(imagen_base64, 100) as preview
        FROM inventario_por_imagen
        {filtro}
        ORDER BY fecha DESC LIMIT 100", conn);
    if (revisado.HasValue) cmd.Parameters.AddWithValue("@rev", revisado.Value);
    await using var reader = await cmd.ExecuteReaderAsync();
    var lista = new List<object>();
    while (await reader.ReadAsync()) {
        lista.Add(new {
            id          = reader.GetInt32(0),
            referencia  = reader.IsDBNull(1) ? "" : reader.GetString(1),
            notas       = reader.IsDBNull(2) ? "" : reader.GetString(2),
            mimeType    = reader.IsDBNull(3) ? "" : reader.GetString(3),
            fecha       = reader.GetDateTime(4),
            cajera      = reader.IsDBNull(5) ? "" : reader.GetString(5),
            tokenSesion = reader.IsDBNull(6) ? "" : reader.GetString(6),
            revisado    = reader.GetBoolean(7)
        });
    }
    return Results.Ok(lista);
}).RequireAuthorization();

// GET /scan/inventario-por-imagen/{id}/imagen — retorna imagen base64 (requiere auth)
app.MapGet("/scan/inventario-por-imagen/{id}/imagen", async (int id) => {
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    await using var cmd = new NpgsqlCommand(
        "SELECT imagen_base64, mime_type FROM inventario_por_imagen WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);
    await using var r = await cmd.ExecuteReaderAsync();
    if (!await r.ReadAsync()) return Results.NotFound();
    var img  = r.IsDBNull(0) ? "" : r.GetString(0);
    var mime = r.IsDBNull(1) ? "image/jpeg" : r.GetString(1);
    return Results.Ok(new { imagen = img, mimeType = mime });
}).RequireAuthorization();

// PATCH /scan/inventario-por-imagen/{id}/revisar — marcar como revisado (requiere auth)
app.MapPatch("/scan/inventario-por-imagen/{id}/revisar", async (int id) => {
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    await using var cmd = new NpgsqlCommand(
        "UPDATE inventario_por_imagen SET revisado = TRUE WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);
    await cmd.ExecuteNonQueryAsync();
    return Results.Ok(new { ok = true });
}).RequireAuthorization();

// ============================================================
// SCAN — ANALIZAR IMÁGENES SIN REFERENCIA (JHONIA MULTI-NIVEL)
// POST /scan/inventario-por-imagen/analizar-sin-referencia
//
// NIVEL 0 — Obtener imágenes pendientes de BD
// NIVEL 1 — Groq Vision identifica referencia/código/marca del producto
// NIVEL 2 — Buscar en inventario_stock + inventario_productos + fotos ya revisadas
//            Si match fuerte (similarity > 0.60): usa datos REALES de BD
//            Si match débil (0.35-0.60): enriquece datos Groq con precio real
//            Sin match: guarda estimación Groq con fuente='ia_groq'
// NIVEL 3 — Guardar resultado en inventario_por_imagen con campo fuente
// ============================================================
app.MapPost("/scan/inventario-por-imagen/analizar-sin-referencia", async (IConfiguration configuration, IHttpClientFactory factory, ILogger<Program> logger) =>
{
    // ── NIVEL 0: Leer imágenes pendientes de BD ─────────────────────────
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();

    var imagenes = new List<(int id, string base64, string mimeType, string? notas)>();
    await using (var r = await new NpgsqlCommand(@"
        SELECT id, imagen_base64, mime_type, notas
        FROM inventario_por_imagen
        WHERE (referencia IS NULL OR TRIM(referencia) = '')
          AND revisado = FALSE
          AND imagen_base64 IS NOT NULL
        ORDER BY fecha ASC LIMIT 5", conn).ExecuteReaderAsync())
    {
        while (await r.ReadAsync())
            imagenes.Add((r.GetInt32(0), r.GetString(1),
                r.IsDBNull(2) ? "image/jpeg" : r.GetString(2),
                r.IsDBNull(3) ? null : r.GetString(3)));
    }

    if (imagenes.Count == 0)
        return Results.Ok(new { analizadas = 0, mensaje = "No hay imágenes sin referencia pendientes." });

    var groqKey = Environment.GetEnvironmentVariable("GROQ_API_KEY") ?? configuration["GROQ_API_KEY"] ?? "";
    if (string.IsNullOrEmpty(groqKey))
        return Results.BadRequest(new { error = "GROQ_API_KEY no configurada en el servidor." });

    var resultados = new List<object>();

    foreach (var (id, base64, mimeType, notasExist) in imagenes)
    {
        try
        {
            // ── NIVEL 1: Groq Vision — identificar producto en la imagen ────
            using var visionClient = factory.CreateClient();
            visionClient.Timeout = TimeSpan.FromSeconds(45);
            visionClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", groqKey);

            var promptVision = @"Eres un sistema de inventario de OutilTech, tienda de tecnología en Colombia. Analiza esta imagen y extrae información del producto visible. Responde ÚNICAMENTE JSON sin texto adicional ni ```:
{""referencia"":""codigo o modelo exacto visible (ej: JQ-14, ATUD-05, iPhone 13)"",""posibles_codigos"":[""cod1"",""cod2""],""marca"":""marca visible o null"",""tipo"":""cable|cargador|audifonos|parlante|adaptador|soporte|power_bank|funda|celular|computador|mouse|teclado|otro"",""precio_estimado_cop"":numero_o_null,""descripcion"":""descripcion breve con caracteristicas tecnicas"",""confianza"":""alta|media|baja""}";

            var visionPayload = new System.Text.Json.Nodes.JsonObject
            {
                ["model"] = "meta-llama/llama-4-scout-17b-16e-instruct",
                ["max_tokens"] = 400,
                ["messages"] = new System.Text.Json.Nodes.JsonArray
                {
                    new System.Text.Json.Nodes.JsonObject
                    {
                        ["role"] = "user",
                        ["content"] = new System.Text.Json.Nodes.JsonArray
                        {
                            new System.Text.Json.Nodes.JsonObject
                            {
                                ["type"] = "image_url",
                                ["image_url"] = new System.Text.Json.Nodes.JsonObject { ["url"] = $"data:{mimeType};base64,{base64}" }
                            },
                            new System.Text.Json.Nodes.JsonObject { ["type"] = "text", ["text"] = promptVision }
                        }
                    }
                }
            };

            var visionResp = await visionClient.PostAsJsonAsync("https://api.groq.com/openai/v1/chat/completions", visionPayload);
            var visionText = await visionResp.Content.ReadAsStringAsync();

            if (!visionResp.IsSuccessStatusCode)
            {
                string errMsg = "Error Groq Vision";
                try {
                    var errJ = JsonSerializer.Deserialize<JsonElement>(visionText);
                    if (errJ.TryGetProperty("error", out var eo) && eo.TryGetProperty("message", out var em))
                        errMsg = em.GetString() ?? errMsg;
                } catch { }
                logger.LogError("[VISION N1] Groq error id={Id}: {Msg}", id, errMsg);
                resultados.Add(new { id, ok = false, error = errMsg });
                continue;
            }

            // Parsear respuesta de Groq Vision
            var visionJson = JsonSerializer.Deserialize<JsonElement>(visionText);
            var rawContent = visionJson.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "{}";
            rawContent = rawContent.Trim();
            if (rawContent.StartsWith("```json")) rawContent = rawContent[7..];
            if (rawContent.StartsWith("```"))     rawContent = rawContent[3..];
            if (rawContent.EndsWith("```"))       rawContent = rawContent[..^3];
            rawContent = rawContent.Trim();

            var info = JsonSerializer.Deserialize<JsonElement>(rawContent);

            var referenciaGroq = info.TryGetProperty("referencia",      out var rv) ? rv.GetString()?.Trim() : null;
            var marcaGroq      = info.TryGetProperty("marca",           out var mv) && mv.ValueKind != JsonValueKind.Null ? mv.GetString() : null;
            var tipoGroq       = info.TryGetProperty("tipo",            out var tv) ? tv.GetString() : null;
            var descripGroq    = info.TryGetProperty("descripcion",     out var dv) ? dv.GetString() : null;
            var confianzaGroq  = info.TryGetProperty("confianza",       out var cv) ? cv.GetString() : "media";
            decimal? precioGroq = null;
            if (info.TryGetProperty("precio_estimado_cop", out var pv) && pv.ValueKind == JsonValueKind.Number)
                precioGroq = pv.GetDecimal();

            // Extraer posibles códigos adicionales que sugirió Groq
            var posiblesCodigos = new List<string>();
            if (!string.IsNullOrEmpty(referenciaGroq)) posiblesCodigos.Add(referenciaGroq);
            if (info.TryGetProperty("posibles_codigos", out var pcArr) && pcArr.ValueKind == JsonValueKind.Array)
                foreach (var pc in pcArr.EnumerateArray())
                    if (pc.GetString() is string s && !string.IsNullOrEmpty(s)) posiblesCodigos.Add(s);

            logger.LogInformation("[VISION N1] id={Id} Groq identificó: '{Ref}' ({Conf})", id, referenciaGroq, confianzaGroq);

            // ── NIVEL 2: Buscar en nuestras BDs antes de confiar en Groq ────
            string? referenciaFinal = referenciaGroq;
            string? descripcionFinal = descripGroq;
            decimal? precioFinal = precioGroq;
            string? marcaFinal = marcaGroq;
            string fuente = "ia_groq";
            string? matchOrigen = null;

            if (posiblesCodigos.Count > 0 || !string.IsNullOrEmpty(descripGroq))
            {
                // Usar referencia Y descripción de Groq como términos de búsqueda.
                // Groq describe en español, nuestra BD usa inglés/mixto, por eso la
                // similarity de trigramas falla entre idiomas. La solución es extraer
                // las siglas técnicas que son universales (OTG, USB, Type-C, AUX, etc.)
                // y buscar esos términos cortos que sí aparecen igual en ambos idiomas.
                string refBusq  = referenciaGroq ?? "";
                string descBusq = descripGroq ?? "";
                string terminoLike = $"%{refBusq.ToLower()}%";

                // Extraer términos técnicos universales de referencia y descripción
                var textoCompleto = $"{refBusq} {descBusq} {marcaGroq} {tipoGroq}".ToLower();
                var terminosTecnicos = System.Text.RegularExpressions.Regex.Matches(
                    textoCompleto,
                    @"\b(otg|usb[\-\s]?[a-z0-9]*|type[\-\s]?[a-z]|lightning|hdmi|aux|sdcard|sd|micro|wireless|bluetooth|wifi|3\.5mm|nfc|rf|ir|power bank|powerbank|tws|anc|fm|led|lcd|amoled|4g|5g|hub)\b",
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase)
                    .Select(m => m.Value.Trim().ToLower())
                    .Distinct().Take(4).ToList();
                // También incluir palabras largas (≥6 chars) del refBusq si no son código puro
                if (!string.IsNullOrEmpty(refBusq) && refBusq.Length >= 4 && !System.Text.RegularExpressions.Regex.IsMatch(refBusq, @"^[A-Z]{2,}-\d+$"))
                    terminosTecnicos.Insert(0, refBusq.ToLower());

                // keywords para LIKE — primer término técnico encontrado, o fallback
                string terminoDescLike = terminosTecnicos.Count > 0
                    ? $"%{terminosTecnicos[0]}%"
                    : $"%{descBusq.ToLower().Split(' ').FirstOrDefault(w => w.Length >= 4) ?? ""}%";

                // Buscar en inventario_stock — 2 estrategias:
                // A) Similarity trigram (misma idioma) — umbral >0.45
                // B) Keyword técnico LIKE + conteo único (cross-idioma) — si ≤3 resultados,
                //    el término es lo suficientemente específico para confiar en el match

                // Estrategia A: similarity
                var cmdStockSim = new NpgsqlCommand(@"
                    SELECT codigo_producto, descripcion, precio_venta, stock_actual,
                           GREATEST(
                               similarity(LOWER(descripcion), LOWER(@ref)),
                               similarity(LOWER(descripcion), LOWER(@desc))
                           ) AS sim
                    FROM inventario_stock
                    WHERE LOWER(codigo_producto) LIKE @like
                       OR similarity(LOWER(descripcion), LOWER(@ref))  > 0.40
                       OR similarity(LOWER(descripcion), LOWER(@desc)) > 0.40
                    ORDER BY sim DESC LIMIT 1", conn);
                cmdStockSim.Parameters.AddWithValue("ref",  refBusq);
                cmdStockSim.Parameters.AddWithValue("desc", descBusq);
                cmdStockSim.Parameters.AddWithValue("like", terminoLike);

                await using var rStockSim = await cmdStockSim.ExecuteReaderAsync();
                if (await rStockSim.ReadAsync())
                {
                    var simStock = rStockSim.IsDBNull(4) ? 0f : (float)rStockSim.GetDouble(4);
                    if (simStock > 0.45 || rStockSim.GetString(0).Equals(refBusq, StringComparison.OrdinalIgnoreCase))
                    {
                        referenciaFinal = rStockSim.GetString(0);
                        descripcionFinal = rStockSim.GetString(1);
                        precioFinal     = rStockSim.GetDecimal(2);
                        fuente = "bd_stock";
                        matchOrigen = $"inventario_stock sim={simStock:F2}";
                        logger.LogInformation("[VISION N2-A] id={Id} match stock sim: '{Cod}' sim={Sim:F2}", id, referenciaFinal, simStock);
                    }
                }
                await rStockSim.CloseAsync();

                // Estrategia B: keywords técnicos con combinación progresiva
                // Si un término es genérico (>4 matches), combina con el siguiente para afinar
                if (fuente == "ia_groq" && terminosTecnicos.Count > 0)
                {
                    string? kwPatternFinal = null;
                    long totalKwFinal = 0;
                    var usedKws = new List<string>();

                    for (int ki = 0; ki < Math.Min(terminosTecnicos.Count, 3); ki++)
                    {
                        usedKws.Add(terminosTecnicos[ki]);
                        // Combinar todos los terms usados hasta ahora con AND LIKE
                        var whereKw = string.Join(" AND ", usedKws.Select((k, i) => $"LOWER(descripcion) LIKE @kw{i}"));
                        // Solo productos con precio real (precio > 0): ignora placeholders sin precio
                        var cmdCountKw = new NpgsqlCommand($"SELECT COUNT(*) FROM inventario_stock WHERE {whereKw} AND precio_venta > 0", conn);
                        for (int i = 0; i < usedKws.Count; i++)
                            cmdCountKw.Parameters.AddWithValue($"kw{i}", $"%{usedKws[i]}%");
                        var cnt = (long)(await cmdCountKw.ExecuteScalarAsync() ?? 0L);

                        if (cnt == 0) break; // combinación demasiado restrictiva
                        totalKwFinal = cnt;
                        kwPatternFinal = whereKw; // guardar la combinación actual

                        if (cnt <= 4) break; // suficientemente específico
                        // si cnt > 4 y hay más términos, seguir combinando
                    }

                    if (kwPatternFinal != null && totalKwFinal > 0 && totalKwFinal <= 4)
                    {
                        var cmdKw = new NpgsqlCommand($@"
                            SELECT codigo_producto, descripcion, precio_venta, stock_actual,
                                   similarity(LOWER(descripcion), LOWER(@desc)) AS sim
                            FROM inventario_stock
                            WHERE {kwPatternFinal} AND precio_venta > 0
                            ORDER BY stock_actual DESC, sim DESC LIMIT 1", conn);
                        cmdKw.Parameters.AddWithValue("desc", descBusq);
                        for (int i = 0; i < usedKws.Count; i++)
                            cmdKw.Parameters.AddWithValue($"kw{i}", $"%{usedKws[i]}%");

                        await using var rKw = await cmdKw.ExecuteReaderAsync();
                        if (await rKw.ReadAsync())
                        {
                            var precioKw = rKw.GetDecimal(2);
                            if (precioKw > 0)
                            {
                                precioFinal = precioKw;
                                fuente = "ia_groq+bd_stock";
                                var kwLabel = string.Join("+", usedKws);
                                matchOrigen = $"keywords '{kwLabel}' → {totalKwFinal} match(es) en stock";
                                logger.LogInformation("[VISION N2-B] id={Id} keywords '{Kw}' ({Total}) → precio real ${P}", id, kwLabel, totalKwFinal, precioKw);
                            }
                        }
                        await rKw.CloseAsync();
                    }
                    else if (kwPatternFinal != null && totalKwFinal > 4)
                    {
                        logger.LogInformation("[VISION N2-B] id={Id} keywords '{Kws}' aún genérico ({Total} matches), saltando BD", id, string.Join("+", usedKws), totalKwFinal);
                    }
                }

                // Si aún no hay match fuerte, buscar en inventario_productos (catálogo JUQU)
                if (fuente == "ia_groq" || fuente.StartsWith("ia_groq+"))
                {
                    var cmdCat = new NpgsqlCommand(@"
                        SELECT producto_id, nombre, precio,
                               GREATEST(
                                   similarity(LOWER(nombre), LOWER(@ref)),
                                   similarity(LOWER(nombre), LOWER(@desc))
                               ) AS sim
                        FROM inventario_productos
                        WHERE UPPER(disponibilidad) = 'SI'
                          AND (LOWER(nombre) LIKE @like
                           OR LOWER(nombre)  LIKE @desclike
                           OR similarity(LOWER(nombre), LOWER(@ref))  > 0.25
                           OR similarity(LOWER(nombre), LOWER(@desc)) > 0.25)
                        ORDER BY sim DESC
                        LIMIT 1", conn);
                    cmdCat.Parameters.AddWithValue("ref",      refBusq);
                    cmdCat.Parameters.AddWithValue("desc",     descBusq);
                    cmdCat.Parameters.AddWithValue("like",     terminoLike);
                    cmdCat.Parameters.AddWithValue("desclike", terminoDescLike);

                    await using var rCat = await cmdCat.ExecuteReaderAsync();
                    if (await rCat.ReadAsync())
                    {
                        var simCat = rCat.IsDBNull(3) ? 0f : (float)rCat.GetDouble(3);
                        if (simCat > 0.45)
                        {
                            referenciaFinal = rCat.GetString(0);
                            descripcionFinal = rCat.GetString(1);
                            precioFinal     = rCat.GetDecimal(2);
                            fuente = "bd_catalogo";
                            matchOrigen = $"inventario_productos sim={simCat:F2}";
                            logger.LogInformation("[VISION N2] id={Id} match en catálogo: '{Nom}' sim={Sim:F2}", id, referenciaFinal, simCat);
                        }
                        else if (simCat > 0.25 && fuente == "ia_groq")
                        {
                            precioFinal = rCat.GetDecimal(2);
                            fuente = "ia_groq+bd_catalogo";
                            matchOrigen = $"catálogo parcial sim={simCat:F2}";
                        }
                    }
                    await rCat.CloseAsync();
                }

                // Si sigue sin match, revisar fotos ya analizadas (aprendizaje de análisis previos)
                if (fuente == "ia_groq" && (!string.IsNullOrEmpty(referenciaGroq) || !string.IsNullOrEmpty(descripGroq)))
                {
                    var cmdFotos = new NpgsqlCommand(@"
                        SELECT referencia, notas,
                               GREATEST(
                                   similarity(LOWER(referencia), LOWER(@ref)),
                                   similarity(LOWER(notas),      LOWER(@desc))
                               ) AS sim
                        FROM inventario_por_imagen
                        WHERE referencia IS NOT NULL AND TRIM(referencia) != ''
                          AND revisado = TRUE
                          AND (similarity(LOWER(referencia), LOWER(@ref))  > 0.45
                            OR similarity(LOWER(notas),      LOWER(@desc)) > 0.40)
                        ORDER BY sim DESC
                        LIMIT 1", conn);
                    cmdFotos.Parameters.AddWithValue("ref",  referenciaGroq ?? "");
                    cmdFotos.Parameters.AddWithValue("desc", descripGroq ?? "");

                    await using var rFotos = await cmdFotos.ExecuteReaderAsync();
                    if (await rFotos.ReadAsync())
                    {
                        var simFoto = rFotos.IsDBNull(2) ? 0f : (float)rFotos.GetDouble(2);
                        referenciaFinal = rFotos.GetString(0);
                        fuente = "bd_fotos_previas";
                        matchOrigen = $"foto ya revisada sim={simFoto:F2}";
                        logger.LogInformation("[VISION N2] id={Id} match en fotos previas: '{Ref}' sim={Sim:F2}", id, referenciaFinal, simFoto);
                    }
                    await rFotos.CloseAsync();
                }
            }

            // ── NIVEL 3: Construir notas y guardar en BD ─────────────────────
            var partesNotas = new List<string>();
            if (matchOrigen != null)           partesNotas.Add($"[BD: {matchOrigen}]");
            if (!string.IsNullOrEmpty(tipoGroq))  partesNotas.Add($"Tipo: {tipoGroq}");
            if (!string.IsNullOrEmpty(marcaFinal)) partesNotas.Add($"Marca: {marcaFinal}");
            if (precioFinal.HasValue)             partesNotas.Add($"Precio: ${precioFinal:N0}");
            if (!string.IsNullOrEmpty(descripcionFinal)) partesNotas.Add(descripcionFinal);
            partesNotas.Add($"[IA: confianza {confianzaGroq} | fuente: {fuente}]");
            var notasFinales = string.Join(". ", partesNotas);

            var updCmd = new NpgsqlCommand(@"
                UPDATE inventario_por_imagen
                SET referencia = @ref, notas = @notas
                WHERE id = @id", conn);
            updCmd.Parameters.AddWithValue("ref",   (object?)referenciaFinal ?? DBNull.Value);
            updCmd.Parameters.AddWithValue("notas", notasFinales);
            updCmd.Parameters.AddWithValue("id",    id);
            await updCmd.ExecuteNonQueryAsync();

            logger.LogInformation("[VISION N3] id={Id} guardado: '{Ref}' | fuente={Fuente}", id, referenciaFinal, fuente);
            resultados.Add(new {
                id, ok = true,
                referencia  = referenciaFinal,
                tipo        = tipoGroq,
                marca       = marcaFinal,
                precio      = precioFinal,
                descripcion = descripcionFinal,
                confianza   = confianzaGroq,
                fuente,
                matchOrigen
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[VISION] Error analizando imagen id={Id}", id);
            resultados.Add(new { id, ok = false, error = ex.Message });
        }
    }

    return Results.Ok(new { analizadas = resultados.Count, resultados });
}).RequireAuthorization();

// ============================================================
// POS — BÚSQUEDA DE PRODUCTOS
// GET /pos/buscar?q=texto — busca en inventario_stock e inventario_productos
// ============================================================
app.MapGet("/pos/buscar", async (string? q) =>
{
    var query = (q ?? "").Trim().ToLower();
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    var resultados = new List<object>();

    // 1. Inventario físico (stock)
    var cmdStock = new NpgsqlCommand(@"
        SELECT codigo_producto, descripcion, stock_actual, precio_venta, costo_unitario
        FROM inventario_stock
        WHERE LOWER(descripcion) LIKE @q OR LOWER(codigo_producto) LIKE @q
        ORDER BY descripcion LIMIT 60", conn);
    cmdStock.Parameters.AddWithValue("q", $"%{query}%");
    await using var rStock = await cmdStock.ExecuteReaderAsync();
    while (await rStock.ReadAsync())
        resultados.Add(new {
            codigo = rStock.GetString(0), descripcion = rStock.GetString(1),
            stock = rStock.GetInt32(2), precio = rStock.GetDecimal(3),
            costo = rStock.GetDecimal(4), fuente = "stock"
        });
    await rStock.CloseAsync();

    // 2. Catálogo web
    var cmdProd = new NpgsqlCommand(@"
        SELECT producto_id, nombre, unidades, precio
        FROM inventario_productos
        WHERE UPPER(disponibilidad) = 'SI'
          AND (LOWER(nombre) LIKE @q OR LOWER(producto_id) LIKE @q
               OR LOWER(modelo) LIKE @q OR LOWER(categoria) LIKE @q)
        ORDER BY nombre LIMIT 40", conn);
    cmdProd.Parameters.AddWithValue("q", $"%{query}%");
    await using var rProd = await cmdProd.ExecuteReaderAsync();
    while (await rProd.ReadAsync())
        resultados.Add(new {
            codigo = rProd.GetString(0), descripcion = rProd.GetString(1),
            stock = rProd.GetInt32(2), precio = rProd.GetDecimal(3),
            costo = (decimal)0, fuente = "catalogo"
        });
    await rProd.CloseAsync();

    // 3. Inventario por imagen (fotos tomadas con celular, no encontradas por código)
    var cmdImg = new NpgsqlCommand(@"
        SELECT id::text, COALESCE(referencia,'Sin referencia'), 0, 0, 0
        FROM inventario_por_imagen
        WHERE revisado = FALSE
          AND (LOWER(COALESCE(referencia,'')) LIKE @q OR LOWER(COALESCE(notas,'')) LIKE @q)
        ORDER BY fecha DESC LIMIT 10", conn);
    cmdImg.Parameters.AddWithValue("q", $"%{query}%");
    await using var rImg = await cmdImg.ExecuteReaderAsync();
    while (await rImg.ReadAsync())
        resultados.Add(new {
            codigo = "IMG-" + rImg.GetString(0),
            descripcion = "📸 " + rImg.GetString(1) + " (foto pendiente)",
            stock = 0, precio = (decimal)0, costo = (decimal)0, fuente = "imagen"
        });

    return Results.Ok(resultados);
}).RequireAuthorization();

// ============================================================
// POS — LISTAR TODOS LOS PRODUCTOS SIN FILTRO
// GET /pos/todos — devuelve inventario_stock + inventario_productos completos
// ============================================================
app.MapGet("/pos/todos", async () =>
{
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    var resultados = new List<object>();

    // 1. Inventario físico (stock)
    var cmdStock = new NpgsqlCommand(@"
        SELECT codigo_producto, descripcion, stock_actual, precio_venta, costo_unitario
        FROM inventario_stock
        ORDER BY descripcion", conn);
    await using var rStock = await cmdStock.ExecuteReaderAsync();
    while (await rStock.ReadAsync())
        resultados.Add(new {
            codigo = rStock.GetString(0), descripcion = rStock.GetString(1),
            stock = rStock.GetInt32(2), precio = rStock.GetDecimal(3),
            costo = rStock.GetDecimal(4), fuente = "stock"
        });
    await rStock.CloseAsync();

    // 2. Catálogo web
    var cmdProd = new NpgsqlCommand(@"
        SELECT producto_id, nombre, unidades, precio
        FROM inventario_productos
        WHERE UPPER(disponibilidad) = 'SI'
        ORDER BY nombre", conn);
    await using var rProd = await cmdProd.ExecuteReaderAsync();
    while (await rProd.ReadAsync())
        resultados.Add(new {
            codigo = rProd.GetString(0), descripcion = rProd.GetString(1),
            stock = rProd.GetInt32(2), precio = rProd.GetDecimal(3),
            costo = (decimal)0, fuente = "catalogo"
        });

    return Results.Ok(resultados);
}).RequireAuthorization();

// ============================================================
// INVENTARIO — AGREGAR PRODUCTO NUEVO (desde código de barras desconocido)
// POST /inventario/nuevo-producto
// ============================================================
app.MapPost("/inventario/nuevo-producto", async (HttpContext ctx) => {
    JsonElement body;
    try { body = await JsonSerializer.DeserializeAsync<JsonElement>(ctx.Request.Body); }
    catch { return Results.BadRequest(new { error = "JSON inválido" }); }

    var codigoBarras = body.TryGetProperty("codigoBarras", out var cb) ? cb.GetString() ?? "" : "";
    var descripcion  = body.TryGetProperty("descripcion",  out var d)  ? d.GetString()  ?? "" : "";
    var precio       = body.TryGetProperty("precio",       out var p)  ? p.GetDecimal() : 0m;
    var costo        = body.TryGetProperty("costo",        out var co) ? co.GetDecimal() : 0m;
    var categoria    = body.TryGetProperty("categoria",    out var ca) ? ca.GetString()  ?? "Accesorio" : "Accesorio";
    var cajera       = body.TryGetProperty("cajera",       out var cj) ? cj.GetString()  ?? "" : "";

    if (string.IsNullOrEmpty(descripcion))
        return Results.BadRequest(new { error = "La descripción es obligatoria" });

    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();

    // Verificar si ya existe en alguna tabla
    string? tablaExistente = null;
    if (!string.IsNullOrEmpty(codigoBarras)) {
        var chkStock = new NpgsqlCommand(
            "SELECT codigo_producto FROM inventario_stock WHERE codigo_producto = @c OR LOWER(descripcion) LIKE @q LIMIT 1", conn);
        chkStock.Parameters.AddWithValue("@c", codigoBarras);
        chkStock.Parameters.AddWithValue("@q", $"%{codigoBarras.ToLower()}%");
        var existeStock = await chkStock.ExecuteScalarAsync();
        if (existeStock != null) tablaExistente = "stock";

        if (tablaExistente == null) {
            var chkProd = new NpgsqlCommand(
                "SELECT producto_id FROM inventario_productos WHERE producto_id = @c OR LOWER(nombre) LIKE @q LIMIT 1", conn);
            chkProd.Parameters.AddWithValue("@c", codigoBarras);
            chkProd.Parameters.AddWithValue("@q", $"%{descripcion.ToLower()}%");
            var existeProd = await chkProd.ExecuteScalarAsync();
            if (existeProd != null) tablaExistente = "catalogo";
        }
    }

    // Guardar en inventario_stock (con stock=1 para poder facturar de inmediato)
    try {
        await using var cmd = new NpgsqlCommand(@"
            INSERT INTO inventario_stock
              (codigo_producto, descripcion, stock_actual, precio_venta, costo_unitario, entradas)
            VALUES (@cod, @desc, 1, @precio, @costo, 1)
            ON CONFLICT (codigo_producto) DO UPDATE
              SET descripcion    = EXCLUDED.descripcion,
                  precio_venta   = EXCLUDED.precio_venta,
                  costo_unitario = EXCLUDED.costo_unitario,
                  stock_actual   = inventario_stock.stock_actual + 1,
                  entradas       = inventario_stock.entradas + 1,
                  updated_at     = NOW()
            RETURNING codigo_producto, stock_actual", conn);

        var codigo = string.IsNullOrEmpty(codigoBarras) ? $"MAN-{Guid.NewGuid().ToString("N")[..8].ToUpper()}" : codigoBarras;
        cmd.Parameters.AddWithValue("@cod",    codigo);
        cmd.Parameters.AddWithValue("@desc",   descripcion);
        cmd.Parameters.AddWithValue("@precio", precio);
        cmd.Parameters.AddWithValue("@costo",  costo);
        await using var r = await cmd.ExecuteReaderAsync();
        await r.ReadAsync();
        var codGuardado = r.GetString(0);
        var stockFinal  = r.GetInt32(1);

        return Results.Ok(new {
            ok = true,
            codigo = codGuardado,
            descripcion,
            precio,
            stock = stockFinal,
            tablaExistente,
            mensaje = tablaExistente != null
                ? $"Producto vinculado al existente en {tablaExistente}. Stock actualizado."
                : "Producto creado exitosamente en inventario."
        });
    } catch (Exception ex) {
        Console.WriteLine($"[NUEVO PRODUCTO] {ex.Message}");
        return Results.StatusCode(500);
    }
}).RequireAuthorization();

// ============================================================
// FACTURACIÓN — SIGUIENTE NÚMERO
// GET /facturacion/siguiente-numero
// ============================================================
app.MapGet("/facturacion/siguiente-numero", async () =>
{
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    var cmd = new NpgsqlCommand("SELECT fn_generar_numero_factura()", conn);
    var numero = (string)(await cmd.ExecuteScalarAsync())!;
    return Results.Ok(new { numero });
}).RequireAuthorization();

// ============================================================
// FACTURACIÓN — CREAR FACTURA
// POST /facturacion
// ============================================================
app.MapPost("/facturacion", async (HttpContext ctx) =>
{
    JsonElement body;
    try { body = await JsonSerializer.DeserializeAsync<JsonElement>(ctx.Request.Body); }
    catch { return Results.BadRequest(new { error = "JSON inválido" }); }

    var cajera        = body.TryGetProperty("cajera",          out var c)  ? c.GetString()  ?? "Cajera" : "Cajera";
    var clienteNombre = body.TryGetProperty("clienteNombre",   out var cn) ? cn.GetString() : null;
    var clienteId     = body.TryGetProperty("clienteId",       out var ci) ? ci.GetString() : null;
    var clienteEmail  = body.TryGetProperty("clienteEmail",    out var ce) ? ce.GetString() : null;
    var clienteTel    = body.TryGetProperty("clienteTelefono", out var ct) ? ct.GetString() : null;
    var descuento     = body.TryGetProperty("descuento",       out var d)  ? d.GetDecimal() : 0m;
    var notas         = body.TryGetProperty("notas",           out var n)  ? n.GetString()  : null;

    if (!body.TryGetProperty("items", out var items) || items.ValueKind != JsonValueKind.Array || items.GetArrayLength() == 0)
        return Results.BadRequest(new { error = "La factura debe tener al menos un ítem" });

    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    await using var tx = await conn.BeginTransactionAsync();
    try
    {
        var cmdNum = new NpgsqlCommand("SELECT fn_generar_numero_factura()", conn, tx);
        var numeroFactura = (string)(await cmdNum.ExecuteScalarAsync())!;

        decimal subtotal = 0m;
        var itemsList = new List<(string cod, string desc, int cant, decimal precio, string fuente)>();
        foreach (var item in items.EnumerateArray())
        {
            var cod    = item.GetProperty("codigo").GetString()!;
            var desc   = item.GetProperty("descripcion").GetString()!;
            var cant   = item.GetProperty("cantidad").GetInt32();
            var precio = item.GetProperty("precio").GetDecimal();
            var fuente = item.TryGetProperty("fuente", out var f) ? f.GetString() ?? "stock" : "stock";
            subtotal += precio * cant;
            itemsList.Add((cod, desc, cant, precio, fuente));
        }
        decimal total = subtotal - descuento;

        var cmdF = new NpgsqlCommand(@"
            INSERT INTO facturas
              (numero_factura, cajera, cliente_nombre, cliente_id, cliente_email, cliente_telefono,
               subtotal, descuento, total, notas, estado)
            VALUES (@num,@cajera,@cn,@ci,@ce,@ct,@sub,@desc,@total,@notas,'emitida')
            RETURNING id", conn, tx);
        cmdF.Parameters.AddWithValue("num",   numeroFactura);
        cmdF.Parameters.AddWithValue("cajera",cajera);
        cmdF.Parameters.AddWithValue("cn",    (object?)clienteNombre ?? DBNull.Value);
        cmdF.Parameters.AddWithValue("ci",    (object?)clienteId     ?? DBNull.Value);
        cmdF.Parameters.AddWithValue("ce",    (object?)clienteEmail  ?? DBNull.Value);
        cmdF.Parameters.AddWithValue("ct",    (object?)clienteTel    ?? DBNull.Value);
        cmdF.Parameters.AddWithValue("sub",   subtotal);
        cmdF.Parameters.AddWithValue("desc",  descuento);
        cmdF.Parameters.AddWithValue("total", total);
        cmdF.Parameters.AddWithValue("notas", (object?)notas ?? DBNull.Value);
        var facturaId = (int)(await cmdF.ExecuteScalarAsync())!;

        foreach (var (cod, desc, cant, precio, fuente) in itemsList)
        {
            var cmdI = new NpgsqlCommand(@"
                INSERT INTO factura_items (factura_id, codigo_producto, descripcion, cantidad, precio_unitario, subtotal, fuente)
                VALUES (@fid,@cod,@desc,@cant,@precio,@sub,@fuente)", conn, tx);
            cmdI.Parameters.AddWithValue("fid",    facturaId);
            cmdI.Parameters.AddWithValue("cod",    cod);
            cmdI.Parameters.AddWithValue("desc",   desc);
            cmdI.Parameters.AddWithValue("cant",   cant);
            cmdI.Parameters.AddWithValue("precio", precio);
            cmdI.Parameters.AddWithValue("sub",    precio * cant);
            cmdI.Parameters.AddWithValue("fuente", fuente);
            await cmdI.ExecuteNonQueryAsync();
        }
        await tx.CommitAsync();
        return Results.Ok(new { id = facturaId, numeroFactura, subtotal, descuento, total, estado = "emitida" });
    }
    catch (Exception ex)
    {
        await tx.RollbackAsync();
        Console.WriteLine($"[FACTURACION] Error crear: {ex.Message}");
        return Results.Problem(ex.Message);
    }
}).RequireAuthorization();

// ============================================================
// FACTURACIÓN — LISTAR
// GET /facturacion?estado=pagada&fecha=2026-05-13&page=1
// ============================================================
app.MapGet("/facturacion", async (string? estado, string? fecha, int page = 1) =>
{
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    var whereParts = new List<string>();
    var cmd = new NpgsqlCommand(); cmd.Connection = conn;
    if (!string.IsNullOrEmpty(estado)) { whereParts.Add("f.estado = @estado"); cmd.Parameters.AddWithValue("estado", estado); }
    if (!string.IsNullOrEmpty(fecha))  { whereParts.Add("DATE(f.fecha) = @fecha"); cmd.Parameters.AddWithValue("fecha", DateOnly.Parse(fecha)); }
    var where = whereParts.Count > 0 ? "WHERE " + string.Join(" AND ", whereParts) : "";
    int limit = 25, offset = (page - 1) * limit;
    cmd.CommandText = $@"
        SELECT f.id, f.numero_factura, f.fecha, f.cajera, f.cliente_nombre,
               f.total, f.metodo_pago, f.estado, COUNT(fi.id) AS items
        FROM facturas f LEFT JOIN factura_items fi ON fi.factura_id = f.id
        {where}
        GROUP BY f.id ORDER BY f.fecha DESC LIMIT {limit} OFFSET {offset}";
    await using var r = await cmd.ExecuteReaderAsync();
    var list = new List<object>();
    while (await r.ReadAsync())
        list.Add(new {
            id = r.GetInt32(0), numeroFactura = r.GetString(1), fecha = r.GetDateTime(2),
            cajera = r.GetString(3), clienteNombre = r.IsDBNull(4) ? null : r.GetString(4),
            total = r.GetDecimal(5), metodoPago = r.IsDBNull(6) ? null : r.GetString(6),
            estado = r.GetString(7), totalItems = r.GetInt64(8)
        });
    return Results.Ok(list);
}).RequireAuthorization();

// ============================================================
// FACTURACIÓN — DETALLE
// GET /facturacion/{id}
// ============================================================
app.MapGet("/facturacion/{id:int}", async (int id) =>
{
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    var cmdF = new NpgsqlCommand(@"
        SELECT id, numero_factura, fecha, cajera, cliente_nombre, cliente_id,
               cliente_email, cliente_telefono, subtotal, descuento, total,
               metodo_pago, estado, notas, wompi_referencia, created_at
        FROM facturas WHERE id = @id", conn);
    cmdF.Parameters.AddWithValue("id", id);
    await using var rF = await cmdF.ExecuteReaderAsync();
    if (!await rF.ReadAsync()) return Results.NotFound(new { error = "Factura no encontrada" });
    var factura = new {
        id = rF.GetInt32(0), numeroFactura = rF.GetString(1), fecha = rF.GetDateTime(2),
        cajera = rF.GetString(3), clienteNombre = rF.IsDBNull(4) ? null : rF.GetString(4),
        clienteId = rF.IsDBNull(5) ? null : rF.GetString(5),
        clienteEmail = rF.IsDBNull(6) ? null : rF.GetString(6),
        clienteTelefono = rF.IsDBNull(7) ? null : rF.GetString(7),
        subtotal = rF.GetDecimal(8), descuento = rF.GetDecimal(9), total = rF.GetDecimal(10),
        metodoPago = rF.IsDBNull(11) ? null : rF.GetString(11),
        estado = rF.GetString(12), notas = rF.IsDBNull(13) ? null : rF.GetString(13),
        wompiReferencia = rF.IsDBNull(14) ? null : rF.GetString(14), creadoEn = rF.GetDateTime(15)
    };
    await rF.CloseAsync();
    var cmdI = new NpgsqlCommand(@"
        SELECT id, codigo_producto, descripcion, cantidad, precio_unitario, subtotal, fuente
        FROM factura_items WHERE factura_id = @fid ORDER BY id", conn);
    cmdI.Parameters.AddWithValue("fid", id);
    await using var rI = await cmdI.ExecuteReaderAsync();
    var items = new List<object>();
    while (await rI.ReadAsync())
        items.Add(new {
            id = rI.GetInt32(0), codigo = rI.GetString(1), descripcion = rI.GetString(2),
            cantidad = rI.GetInt32(3), precioUnitario = rI.GetDecimal(4),
            subtotal = rI.GetDecimal(5), fuente = rI.GetString(6)
        });
    return Results.Ok(new { factura, items });
}).RequireAuthorization();

// ============================================================
// FACTURACIÓN — PAGAR
// PATCH /facturacion/{id}/pagar
// ============================================================
app.MapMethods("/facturacion/{id:int}/pagar", new[] { "PATCH" }, async (int id, HttpContext ctx) =>
{
    JsonElement body;
    try { body = await JsonSerializer.DeserializeAsync<JsonElement>(ctx.Request.Body); }
    catch { body = default; }
    var metodoPago = body.ValueKind == JsonValueKind.Object && body.TryGetProperty("metodoPago", out var mp)
        ? mp.GetString() ?? "efectivo" : "efectivo";

    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    await using var tx = await conn.BeginTransactionAsync();
    try
    {
        var cmdChk = new NpgsqlCommand("SELECT estado FROM facturas WHERE id = @id", conn, tx);
        cmdChk.Parameters.AddWithValue("id", id);
        var estadoActual = (string?)await cmdChk.ExecuteScalarAsync();
        if (estadoActual == null)   return Results.NotFound(new { error = "Factura no encontrada" });
        if (estadoActual == "pagada")  return Results.BadRequest(new { error = "La factura ya fue pagada" });
        if (estadoActual == "anulada") return Results.BadRequest(new { error = "La factura está anulada" });

        var cmdVal = new NpgsqlCommand(@"
            SELECT fi.descripcion, fi.cantidad, s.stock_actual
            FROM factura_items fi
            JOIN inventario_stock s ON s.codigo_producto = fi.codigo_producto
            WHERE fi.factura_id = @fid AND s.stock_actual < fi.cantidad", conn, tx);
        cmdVal.Parameters.AddWithValue("fid", id);
        await using var rVal = await cmdVal.ExecuteReaderAsync();
        var sinStock = new List<string>();
        while (await rVal.ReadAsync())
            sinStock.Add($"{rVal.GetString(0)}: disponible={rVal.GetInt32(2)}, solicitado={rVal.GetInt32(1)}");
        await rVal.CloseAsync();
        if (sinStock.Count > 0) return Results.BadRequest(new { error = "Stock insuficiente", detalle = sinStock });

        var cmdPag = new NpgsqlCommand(@"
            UPDATE facturas SET estado='pagada', metodo_pago=@mp, updated_at=NOW() WHERE id=@id", conn, tx);
        cmdPag.Parameters.AddWithValue("mp", metodoPago);
        cmdPag.Parameters.AddWithValue("id", id);
        await cmdPag.ExecuteNonQueryAsync();
        await tx.CommitAsync();
        return Results.Ok(new { mensaje = "Factura pagada. Stock descontado.", id, metodoPago });
    }
    catch (PostgresException pgEx)
    {
        await tx.RollbackAsync();
        return Results.BadRequest(new { error = pgEx.MessageText });
    }
    catch (Exception ex)
    {
        await tx.RollbackAsync();
        Console.WriteLine($"[FACTURACION] Error pagar: {ex.Message}");
        return Results.Problem(ex.Message);
    }
}).RequireAuthorization();

// ============================================================
// FACTURACIÓN — ANULAR
// PATCH /facturacion/{id}/anular
// ============================================================
app.MapMethods("/facturacion/{id:int}/anular", new[] { "PATCH" }, async (int id) =>
{
    await using var conn = new NpgsqlConnection(pgConnectionString);
    await conn.OpenAsync();
    var cmdChk = new NpgsqlCommand("SELECT estado FROM facturas WHERE id = @id", conn);
    cmdChk.Parameters.AddWithValue("id", id);
    var estadoActual = (string?)await cmdChk.ExecuteScalarAsync();
    if (estadoActual == null)   return Results.NotFound(new { error = "Factura no encontrada" });
    if (estadoActual == "pagada")  return Results.BadRequest(new { error = "No se puede anular una factura ya pagada" });
    if (estadoActual == "anulada") return Results.BadRequest(new { error = "La factura ya está anulada" });
    var cmdAnu = new NpgsqlCommand("UPDATE facturas SET estado='anulada', updated_at=NOW() WHERE id=@id", conn);
    cmdAnu.Parameters.AddWithValue("id", id);
    await cmdAnu.ExecuteNonQueryAsync();
    return Results.Ok(new { mensaje = "Factura anulada", id });
}).RequireAuthorization();

app.UseSwagger();
app.UseSwaggerUI();
app.Run();

// ── Servicio de email ──────────────────────────────────────────────
static string BuildEmailHtml(Pedido p, string tipoEvento)
{
    var metodoPagoLabel = tipoEvento == "nequi_comprobante"
        ? "Nequi/Daviplata (comprobante recibido)"
        : p.MetodoPago switch {
            "tarjeta"  => "Tarjeta de Crédito/Débito",
            "pse"      => "PSE / Mercado Pago",
            "nequi"    => "Nequi / Daviplata",
            "efectivo" => "Efectivo (Efecty/Baloto)",
            "addi"     => "Addi – Cuotas",
            _          => p.MetodoPago
          };

    var estadoLabel = tipoEvento == "nequi_comprobante"
        ? "<span style='background:#f59e0b;color:#000;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:700'>⏳ Pendiente de verificación</span>"
        : "<span style='background:#22c55e;color:#fff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:700'>✅ Confirmado</span>";

    var comprobanteHtml = !string.IsNullOrEmpty(p.ComprobanteNequi)
        ? $@"<tr><td style='padding:12px 0;border-bottom:1px solid #2a2a2a'>
               <strong style='color:#ff6b00'>Comprobante Nequi</strong><br/>
               <span style='color:#ccc;font-size:13px'>{p.ComprobanteNequi}</span>
             </td></tr>"
        : "";

    string itemsHtml;
    try
    {
        var items = JsonSerializer.Deserialize<JsonElement[]>(p.ItemsJson) ?? [];
        var rows = new System.Text.StringBuilder();
        foreach (var item in items)
        {
            var nombre   = item.TryGetProperty("nombre",       out var n) ? n.GetString() : "-";
            var marca    = item.TryGetProperty("marca",        out var m) ? m.GetString() : "";
            var variante = item.TryGetProperty("variante",     out var v) ? v.GetString() : "";
            var cantidad = item.TryGetProperty("cantidad",     out var c) ? c.GetInt32()  : 1;
            var subtotal = item.TryGetProperty("subtotal",     out var s) ? s.GetDecimal() : 0;
            rows.Append($@"
              <tr>
                <td style='padding:10px 8px;border-bottom:1px solid #2a2a2a;color:#ddd;font-size:14px'>
                  <strong>{marca}</strong> {nombre}
                  {(string.IsNullOrEmpty(variante) ? "" : $"<br/><span style='color:#999;font-size:12px'>{variante}</span>")}
                </td>
                <td style='padding:10px 8px;border-bottom:1px solid #2a2a2a;text-align:center;color:#ddd;font-size:14px'>{cantidad}</td>
                <td style='padding:10px 8px;border-bottom:1px solid #2a2a2a;text-align:right;color:#4ade80;font-size:14px;font-weight:700'>
                  {subtotal:N0} COP
                </td>
              </tr>");
        }
        itemsHtml = rows.Length > 0 ? rows.ToString() : "<tr><td colspan='3' style='color:#999;padding:12px'>Sin detalle de productos</td></tr>";
    }
    catch
    {
        itemsHtml = "<tr><td colspan='3' style='color:#999;padding:12px'>Sin detalle de productos</td></tr>";
    }

    var mensajeEstado = tipoEvento == "nequi_comprobante"
        ? "Hemos recibido tu comprobante de pago. Lo verificaremos en las próximas horas y te confirmaremos el envío de tu pedido."
        : "Tu pedido ha sido registrado correctamente. Nos pondremos en contacto contigo para coordinar el envío.";

    return $@"<!DOCTYPE html>
<html lang='es'>
<head><meta charset='UTF-8'/><meta name='viewport' content='width=device-width,initial-scale=1.0'/></head>
<body style='margin:0;padding:0;background:#0f0f0f;font-family:Arial,sans-serif'>
  <div style='max-width:600px;margin:0 auto;background:#1a1a1a;border-radius:12px;overflow:hidden'>
    <div style='background:linear-gradient(135deg,#1a1a1a 0%,#2a1500 100%);padding:32px 40px;border-bottom:3px solid #ff6b00'>
      <div style='font-family:Arial Black,sans-serif;font-size:28px;font-weight:900;letter-spacing:-1px'>
        <span style='color:#fff'>OUTIL</span><span style='color:#ff6b00'>TECH</span>
      </div>
      <p style='color:rgba(255,255,255,0.5);font-size:13px;margin:4px 0 0 0'>outiltech.co · Tecnología de calidad</p>
    </div>
    <div style='padding:28px 40px;background:#1f1f1f;border-bottom:1px solid #2a2a2a;text-align:center'>
      <div style='font-size:40px;margin-bottom:8px'>{(tipoEvento == "nequi_comprobante" ? "📋" : "🎉")}</div>
      <h1 style='color:#fff;margin:0 0 8px 0;font-size:22px'>
        {(tipoEvento == "nequi_comprobante" ? "Comprobante recibido" : "¡Pedido confirmado!")}
      </h1>
      <p style='color:rgba(255,255,255,0.6);margin:0 0 12px 0;font-size:14px'>{mensajeEstado}</p>
      {estadoLabel}
    </div>
    <div style='padding:20px 40px;background:#161616;border-bottom:1px solid #2a2a2a'>
      <span style='color:rgba(255,255,255,0.5);font-size:13px'>Número de pedido</span>
      <span style='color:#ff6b00;font-size:20px;font-weight:900;letter-spacing:1px'>#{p.Id}</span>
    </div>
    <div style='padding:24px 40px;border-bottom:1px solid #2a2a2a'>
      <h2 style='color:#ff6b00;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px 0'>Datos del cliente</h2>
      <table style='width:100%;border-collapse:collapse'>
        <tr><td style='padding:6px 0;color:rgba(255,255,255,0.5);font-size:13px;width:140px'>Nombre</td>
            <td style='padding:6px 0;color:#fff;font-size:13px'>{p.Nombre} {p.Apellido}</td></tr>
        <tr><td style='padding:6px 0;color:rgba(255,255,255,0.5);font-size:13px'>Email</td>
            <td style='padding:6px 0;color:#fff;font-size:13px'>{p.Email}</td></tr>
        <tr><td style='padding:6px 0;color:rgba(255,255,255,0.5);font-size:13px'>Teléfono</td>
            <td style='padding:6px 0;color:#fff;font-size:13px'>{p.Telefono}</td></tr>
        <tr><td style='padding:6px 0;color:rgba(255,255,255,0.5);font-size:13px'>Identificación</td>
            <td style='padding:6px 0;color:#fff;font-size:13px'>{p.TipoId} {p.NumeroId}</td></tr>
      </table>
    </div>
    <div style='padding:24px 40px;border-bottom:1px solid #2a2a2a'>
      <h2 style='color:#ff6b00;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px 0'>Dirección de envío</h2>
      <p style='color:#fff;font-size:14px;margin:0 0 4px 0'>{p.Nombre} {p.Apellido}</p>
      <p style='color:#ccc;font-size:13px;margin:0 0 2px 0'>{p.Direccion}{(string.IsNullOrEmpty(p.Barrio) ? "" : $", {p.Barrio}")}</p>
      <p style='color:#ccc;font-size:13px;margin:0 0 2px 0'>{p.Ciudad}, Colombia</p>
    </div>
    <div style='padding:24px 40px;border-bottom:1px solid #2a2a2a'>
      <h2 style='color:#ff6b00;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px 0'>Productos</h2>
      <table style='width:100%;border-collapse:collapse'>
        <thead>
          <tr style='background:#252525'>
            <th style='padding:10px 8px;text-align:left;color:rgba(255,255,255,0.5);font-size:12px;font-weight:600'>PRODUCTO</th>
            <th style='padding:10px 8px;text-align:center;color:rgba(255,255,255,0.5);font-size:12px;font-weight:600'>CANT.</th>
            <th style='padding:10px 8px;text-align:right;color:rgba(255,255,255,0.5);font-size:12px;font-weight:600'>SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>{itemsHtml}</tbody>
        <tfoot>
          <tr style='background:#252525'>
            <td colspan='2' style='padding:14px 8px;color:#fff;font-size:16px;font-weight:700'>TOTAL A PAGAR</td>
            <td style='padding:14px 8px;text-align:right;color:#4ade80;font-size:18px;font-weight:900'>{p.Total:N0} COP</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div style='padding:24px 40px;border-bottom:1px solid #2a2a2a'>
      <h2 style='color:#ff6b00;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px 0'>Información de pago</h2>
      <table style='width:100%;border-collapse:collapse'>
        <tr><td style='padding:6px 0;color:rgba(255,255,255,0.5);font-size:13px;width:140px'>Método de pago</td>
            <td style='padding:6px 0;color:#fff;font-size:13px'>{metodoPagoLabel}</td></tr>
        <tr><td style='padding:6px 0;color:rgba(255,255,255,0.5);font-size:13px'>Estado</td>
            <td style='padding:6px 0;color:#fff;font-size:13px'>{p.Estado}</td></tr>
        {comprobanteHtml}
      </table>
    </div>
    <div style='padding:28px 40px;text-align:center'>
      <a href='https://wa.me/573045928793' style='display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;margin-bottom:12px'>
        💬 WhatsApp: 3045928793
      </a><br/>
      <a href='https://outiltech.co' style='display:inline-block;background:#ff6b00;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px'>
        🛍️ Seguir comprando en outiltech.co
      </a>
    </div>
    <div style='padding:20px 40px;background:#111;text-align:center'>
      <p style='color:rgba(255,255,255,0.3);font-size:12px;margin:0'>
        © 2026 Outiltech · Cra 2A No 18A-52, Bogotá · Lunes a Sábado 9am-7pm
      </p>
    </div>
  </div>
</body>
</html>";
}

async Task EnviarEmail(Pedido pedido, string tipoEvento)
{
    if (string.IsNullOrEmpty(emailUser) || string.IsNullOrEmpty(emailPass) ||
        emailPass == "PONER_APP_PASSWORD_AQUI")
    {
        Console.WriteLine("[EMAIL] Credenciales no configuradas — saltando envío.");
        return;
    }

    var asunto = tipoEvento == "nequi_comprobante"
        ? $"📋 Comprobante recibido — Pedido #{pedido.Id} · Outiltech"
        : $"✅ Confirmación de tu pedido #{pedido.Id} · Outiltech";

    var htmlBody = BuildEmailHtml(pedido, tipoEvento);

    try
    {
#pragma warning disable SYSLIB0006
        using var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl  = true,
            Credentials = new System.Net.NetworkCredential(emailUser, emailPass)
        };
#pragma warning restore SYSLIB0006

        if (!string.IsNullOrEmpty(pedido.Email))
        {
            var mailCliente = new System.Net.Mail.MailMessage(emailUser, pedido.Email, asunto, htmlBody) { IsBodyHtml = true };
            await smtp.SendMailAsync(mailCliente);
            Console.WriteLine($"[EMAIL] Enviado al cliente {pedido.Email}");
        }

        var mailAdmin = new System.Net.Mail.MailMessage(emailUser, emailAdmin,
            $"[Admin] {asunto}", htmlBody) { IsBodyHtml = true };
        await smtp.SendMailAsync(mailAdmin);
        Console.WriteLine($"[EMAIL] Copia enviada al admin {emailAdmin}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[EMAIL] Error (no crítico): {ex.Message}");
    }
}

// ── DTOs Wompi ──
record WompiTransactionRequestDto(string Reference, decimal AmountCop, string RedirectUrl, string Email, string FullName, string Phone);
