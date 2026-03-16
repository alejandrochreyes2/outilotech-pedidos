using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using PedidosAPI.Repositories;
using PedidosAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Repository
builder.Services.AddSingleton<IPedidoRepository, PedidoRepository>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.MapHealthChecks("/health");

// Endpoints
app.MapGet("/api/pedidos", async (IPedidoRepository repo) => Results.Ok(await repo.GetAllAsync())).RequireAuthorization();
app.MapPost("/api/pedidos", async (Pedido pedido, IPedidoRepository repo) => {
    await repo.CreateAsync(pedido);
    return Results.Created($"/api/pedidos/{pedido.Id}", pedido);
}).RequireAuthorization();

app.UseSwagger();
app.UseSwaggerUI();
app.Run();