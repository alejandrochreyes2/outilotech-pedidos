using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
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
    ?? "Host=postgres;Port=5432;Database=outiltech;Username=postgres;Password=postgres";

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
        conn.Close();
        Console.WriteLine("[DB] Tabla inventario_productos verificada/creada correctamente.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB WARNING] {ex.Message}");
    }
}

// ============================================================
// SUPABASE SYNC — helper que corre en background
// ============================================================
const string SUPABASE_URL = "https://gklxdzhmpjwwmffjdmwv.supabase.co/rest/v1/pedidos";
const string SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHhkemhtcGp3d21mZmpkbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTM0MDEsImV4cCI6MjA5MTQyOTQwMX0.Es3YyKtLnx9lKiA_xyTHxK_IDSICb9kGf5-nu2XE_jg";

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

    <!-- HEADER -->
    <div style='background:linear-gradient(135deg,#1a1a1a 0%,#2a1500 100%);padding:32px 40px;border-bottom:3px solid #ff6b00'>
      <div style='font-family:Arial Black,sans-serif;font-size:28px;font-weight:900;letter-spacing:-1px'>
        <span style='color:#fff'>OUTIL</span><span style='color:#ff6b00'>TECH</span>
      </div>
      <p style='color:rgba(255,255,255,0.5);font-size:13px;margin:4px 0 0 0'>outiltech.co · Tecnología de calidad</p>
    </div>

    <!-- ESTADO -->
    <div style='padding:28px 40px;background:#1f1f1f;border-bottom:1px solid #2a2a2a;text-align:center'>
      <div style='font-size:40px;margin-bottom:8px'>{(tipoEvento == "nequi_comprobante" ? "📋" : "🎉")}</div>
      <h1 style='color:#fff;margin:0 0 8px 0;font-size:22px'>
        {(tipoEvento == "nequi_comprobante" ? "Comprobante recibido" : "¡Pedido confirmado!")}
      </h1>
      <p style='color:rgba(255,255,255,0.6);margin:0 0 12px 0;font-size:14px'>{mensajeEstado}</p>
      {estadoLabel}
    </div>

    <!-- NÚMERO DE PEDIDO -->
    <div style='padding:20px 40px;background:#161616;border-bottom:1px solid #2a2a2a;display:flex;justify-content:space-between;align-items:center'>
      <span style='color:rgba(255,255,255,0.5);font-size:13px'>Número de pedido</span>
      <span style='color:#ff6b00;font-size:20px;font-weight:900;letter-spacing:1px'>#{p.Id}</span>
    </div>

    <!-- DATOS DEL CLIENTE -->
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

    <!-- DIRECCIÓN DE ENVÍO -->
    <div style='padding:24px 40px;border-bottom:1px solid #2a2a2a'>
      <h2 style='color:#ff6b00;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px 0'>Dirección de envío</h2>
      <p style='color:#fff;font-size:14px;margin:0 0 4px 0'>{p.Nombre} {p.Apellido}</p>
      <p style='color:#ccc;font-size:13px;margin:0 0 2px 0'>{p.Direccion}{(string.IsNullOrEmpty(p.Barrio) ? "" : $", {p.Barrio}")}</p>
      <p style='color:#ccc;font-size:13px;margin:0 0 2px 0'>{p.Ciudad}, Colombia</p>
      <p style='color:#ccc;font-size:13px;margin:8px 0 0 0'>
        📦 Método de envío: <strong style='color:#fff'>{(p.MetodoEnvio == "tienda" ? "Recoger en tienda" : "Envío a domicilio (1-3 días hábiles)")}</strong>
      </p>
    </div>

    <!-- PRODUCTOS -->
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

    <!-- PAGO -->
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

    <!-- CTA -->
    <div style='padding:28px 40px;text-align:center'>
      <p style='color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 16px 0'>¿Tienes preguntas? Contáctanos:</p>
      <a href='https://wa.me/573045928793' style='display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;margin-bottom:12px'>
        💬 WhatsApp: 3045928793
      </a>
      <br/>
      <a href='https://outiltech.co' style='display:inline-block;background:#ff6b00;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px'>
        🛍️ Seguir comprando en outiltech.co
      </a>
    </div>

    <!-- FOOTER -->
    <div style='padding:20px 40px;background:#111;text-align:center'>
      <p style='color:rgba(255,255,255,0.3);font-size:12px;margin:0'>
        © 2026 Outiltech · Cra 2A No 18A-52, Bogotá · Lunes a Sábado 9am-7pm<br/>
        Este es un correo automático, por favor no respondas a este mensaje.
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

        // Email al cliente (si tiene correo)
        if (!string.IsNullOrEmpty(pedido.Email))
        {
            var mailCliente = new System.Net.Mail.MailMessage(emailUser, pedido.Email, asunto, htmlBody) { IsBodyHtml = true };
            await smtp.SendMailAsync(mailCliente);
            Console.WriteLine($"[EMAIL] Enviado al cliente {pedido.Email}");
        }

        // Copia al admin siempre
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
