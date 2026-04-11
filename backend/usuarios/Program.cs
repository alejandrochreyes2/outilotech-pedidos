using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using UsuariosAPI.Models;
using UsuariosAPI.Data;
using UsuariosAPI.Repositories;
using UsuariosAPI.DTOs;
using UsuariosAPI.Mappings;
using Microsoft.EntityFrameworkCore.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// DB Context — PostgreSQL local o InMemory para cloud demo
var useInMemory = builder.Configuration["USE_INMEMORY"] == "true";
if (useInMemory)
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseInMemoryDatabase("UsuariosCloud"));
}
else
{
    var connectionString = builder.Configuration.GetConnectionString("PostgreSQL")
        ?? "Host=postgres;Port=5432;Database=outiltech_db;Username=toyota_user;Password=Toyota2026!";
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(connectionString));
}

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Usuarios API", Version = "v1" });
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

// Seed
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
    try {
        var creator = db.GetService<Microsoft.EntityFrameworkCore.Storage.IRelationalDatabaseCreator>();
        creator.CreateTables();
    } catch { }

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    // Crear roles
    var seedRoles = new[] { "Admin", "Vendedor", "User" };
    foreach (var role in seedRoles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }

    // Crear usuarios
    var seedUsers = new[]
    {
        (Email: "alejandrochreyes2@gmail.com",    UserName: "alejandro_admin",    FullName: "Jhonatan Hernandez",         Password: "Kx9#mT4$vR2n", Role: "Admin"),
        (Email: "contactanos@outiltech.co",        UserName: "jhonatan_admin",     FullName: "Jhonnathan Hernández Medina", Password: "Admin1327",     Role: "Admin"),
        (Email: "jhonatanhtech@gmail.com",         UserName: "jhonatanhtech",      FullName: "Jhonnathan Hernández Medina", Password: "Admin1327",     Role: "Admin"),
        (Email: "vendedor@toyota-pedidos.com",    UserName: "vendedor_pedidos",   FullName: "Vendedor Toyota",             Password: "Bw3$pL7#qN5j", Role: "Vendedor"),
        (Email: "usuario@toyota-pedidos.com",     UserName: "usuario_pedidos",    FullName: "Usuario Toyota",              Password: "Ym6#cF1$hK8s", Role: "User"),
    };

    foreach (var (Email, UserName, FullName, Password, Role) in seedUsers)
    {
        if (await userManager.FindByEmailAsync(Email) == null)
        {
            var u = new ApplicationUser { UserName = UserName, Email = Email, FullName = FullName, EmailConfirmed = true };
            var result = await userManager.CreateAsync(u, Password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(u, Role);
                Console.WriteLine($"[SEED] {Email} → {Role}");
            }
            else
            {
                Console.WriteLine($"[SEED ERROR] {Email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"[SEED ERROR] {ex.Message}");
}

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

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
app.MapControllers();
app.MapHealthChecks("/health");

// Login
app.MapPost("/auth/login", async (UserLoginDto req, IUserRepository repo, UserManager<ApplicationUser> userManager, IConfiguration config) =>
{
    var identifier = (req.Email ?? string.Empty).Trim();

    ApplicationUser? user = null;
    if (!string.IsNullOrWhiteSpace(identifier))
    {
        user = await userManager.FindByEmailAsync(identifier);
        user ??= await userManager.FindByNameAsync(identifier);
    }

    if (user == null) return Results.Unauthorized();

    if (!await repo.CheckPasswordAsync(user, req.Password)) return Results.Unauthorized();

    var roles = await userManager.GetRolesAsync(user);
    var userRole = roles.FirstOrDefault() ?? "User";

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Email, user.Email!),
        new Claim(ClaimTypes.Role, userRole),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var token = new JwtSecurityToken(
        issuer: config["Jwt:Issuer"],
        audience: config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(8),
        signingCredentials: creds
    );

    Console.WriteLine($"[LOGIN] {user.Email} role={userRole}");

    return Results.Ok(new UserResponseDto(
        user.Email!,
        user.FullName,
        userRole,
        new JwtSecurityTokenHandler().WriteToken(token)
    ));
});

// Register
app.MapPost("/auth/register", async (UserRegistrationDto req, IUserRepository repo) =>
{
    var user = new ApplicationUser { UserName = req.Email, Email = req.Email, FullName = req.FullName };
    var success = await repo.CreateAsync(user, req.Password);
    return success ? Results.Ok(new { message = "Usuario creado" }) : Results.BadRequest("Error al crear usuario");
});

app.UseSwagger();
app.UseSwaggerUI();

Console.WriteLine("========================================");
Console.WriteLine("Usuarios API - Puerto 3001");
Console.WriteLine("  Swagger: http://localhost:3001/swagger");
Console.WriteLine("========================================");

app.Run();
