using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using PagosAPI.Repositories;
using PagosAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Repository
builder.Services.AddSingleton<IPagoRepository, PagoRepository>();

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
app.MapGet("/api/pagos", async (IPagoRepository repo) => Results.Ok(await repo.GetAllAsync())).RequireAuthorization();
app.MapPost("/api/pagos", async (Pago pago, IPagoRepository repo) => {
    await repo.CreateAsync(pago);
    return Results.Created($"/api/pagos/{pago.Id}", pago);
}).RequireAuthorization();

app.UseSwagger();
app.UseSwaggerUI();
app.Run();