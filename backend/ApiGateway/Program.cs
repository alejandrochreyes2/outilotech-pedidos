var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = new[]
{
    "https://outiltech.co",
    "https://www.outiltech.co",
    "https://api.outiltech.co",
    "http://localhost:4200",
    "http://localhost:5000",
    "http://localhost:80",
    "http://localhost"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
builder.Services.AddHealthChecks();

var app = builder.Build();

// CORS debe ir ANTES de todo — incluyendo YARP
app.UseCors("AllowFrontend");

// Manejar OPTIONS preflight explícitamente antes de que YARP lo intercepte
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        var origin = context.Request.Headers.Origin.ToString();
        if (allowedOrigins.Contains(origin))
        {
            context.Response.Headers["Access-Control-Allow-Origin"]      = origin;
            context.Response.Headers["Access-Control-Allow-Methods"]     = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
            context.Response.Headers["Access-Control-Allow-Headers"]     = "Content-Type, Authorization, X-Requested-With";
            context.Response.Headers["Access-Control-Allow-Credentials"] = "true";
            context.Response.Headers["Access-Control-Max-Age"]           = "86400";
            context.Response.StatusCode = 204;
            return;
        }
    }
    await next();
});

app.MapHealthChecks("/health");
app.MapReverseProxy();

Console.WriteLine("╔══════════════════════════════════════════════════╗");
Console.WriteLine("║  API Gateway Outiltech — puerto 5000             ║");
Console.WriteLine("║  CORS: outiltech.co + localhost                  ║");
Console.WriteLine("╚══════════════════════════════════════════════════╝");

app.Run();
