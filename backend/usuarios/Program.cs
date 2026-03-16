using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UsuariosAPI.Data;
using UsuariosAPI.Models;
using UsuariosAPI.Repositories;
using UsuariosAPI.DTOs;
using AutoMapper;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

// DB Context (In-Memory for simplicity)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("UsuariosDb"));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Repository
builder.Services.AddScoped<IUserRepository, UserRepository>();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "ClaveSuperSecretaDe32CaracteresMinimo!";
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "ProyectoPedidos",
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "UsuariosAPI",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed Roles
using (var scope = app.Services.CreateScope()) {
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    if (!await roleManager.RoleExistsAsync("User")) await roleManager.CreateAsync(new IdentityRole("User"));
    if (!await roleManager.RoleExistsAsync("Admin")) await roleManager.CreateAsync(new IdentityRole("Admin"));
}

app.UseAuthentication();
app.UseAuthorization();
app.MapHealthChecks("/health");

// Auth Endpoints
app.MapPost("/auth/register", async (UserRegistrationDto dto, IUserRepository repo, IMapper mapper) => {
    var user = mapper.Map<ApplicationUser>(dto);
    var result = await repo.CreateAsync(user, dto.Password);
    return result.Succeeded ? Results.Ok(mapper.Map<UserResponseDto>(user) with { Role = "User" }) : Results.BadRequest(result.Errors);
});

app.MapPost("/auth/login", async (UserLoginDto dto, IUserRepository repo, IConfiguration config) => {
    var user = await repo.GetByEmailAsync(dto.Email);
    if (user != null && await repo.CheckPasswordAsync(user, dto.Password)) {
        var roles = await repo.GetRolesAsync(user);
        var claims = new List<Claim> {
            new Claim(ClaimTypes.Name, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim("role", roles.FirstOrDefault() ?? "User")
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"] ?? "ClaveSuperSecretaDe32CaracteresMinimo!"));
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"] ?? "ProyectoPedidos",
            audience: config["Jwt:Audience"] ?? "UsuariosAPI",
            claims: claims,
            expires: DateTime.Now.AddHours(3),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );
        return Results.Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token), Role = roles.FirstOrDefault() ?? "User" });
    }
    return Results.Unauthorized();
});

app.UseSwagger();
app.UseSwaggerUI();
app.Run();