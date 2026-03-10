using DispatchStack.Api.Data;
using DispatchStack.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Database=dispatchstack;Username=postgres;Password=postgres";

builder.Services.AddDbContext<DispatchStackDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IDriverService, DriverService>();
builder.Services.AddScoped<ITruckService, TruckService>();
builder.Services.AddScoped<IExportingCompanyService, ExportingCompanyService>();
builder.Services.AddScoped<IImportingCompanyService, ImportingCompanyService>();

var app = builder.Build();

app.UseCors();
app.MapControllers();

app.Run();
