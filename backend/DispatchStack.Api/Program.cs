using DispatchStack.Api.Services;
using Microsoft.AspNetCore.Builder;
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

builder.Services.AddSingleton<IDriverService, DriverService>();
builder.Services.AddSingleton<ITruckService, TruckService>();
builder.Services.AddSingleton<IExportingCompanyService, ExportingCompanyService>();
builder.Services.AddSingleton<IImportingCompanyService, ImportingCompanyService>();

var app = builder.Build();

app.UseCors();
app.MapControllers();

app.Run();
