using Microsoft.EntityFrameworkCore;
using UseItApi.Models;

namespace UseItApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Tool> Tools => Set<Tool>();
    public DbSet<User> Users => Set<User>();
}

