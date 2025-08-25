using Microsoft.EntityFrameworkCore;
using UseItApi.Data;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Environment.IsDevelopment()
    ? ["http://localhost:5173"]
    : new[] { "https://useit.app" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=useit.db"));

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
dbContext.Database.Migrate();
DbSeeder.Seed(dbContext);

app.UseHttpsRedirection();

app.MapControllers();
app.UseCors("AllowFrontend");

app.Run();
