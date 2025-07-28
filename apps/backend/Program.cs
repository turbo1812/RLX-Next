using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WMS.Backend.Functions;
using Microsoft.EntityFrameworkCore;
using WMS.Backend.Models;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

// Register function classes explicitly to prevent duplicate loading
builder.Services.AddScoped<InventoryFunction>();
builder.Services.AddScoped<OrdersFunction>();
builder.Services.AddScoped<FleetFunction>();
builder.Services.AddScoped<WarehouseFunction>();
builder.Services.AddScoped<WMS.Backend.Functions.ServicesFunction>();
builder.Services.AddSingleton<WMS.Backend.Services.ServiceBusService>();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

var app = builder.Build();

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        var connectionString = Environment.GetEnvironmentVariable("SqlConnection");
        services.AddDbContext<WmsDbContext>(options =>
            options.UseSqlServer(connectionString));
    })
    .Build();

host.Run();
