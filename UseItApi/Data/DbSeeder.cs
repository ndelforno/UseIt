using Bogus;

namespace UseItApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Tools.Any())
        {
            context.RemoveRange(context.Tools);
        }

        var faker = new Faker<Tool>()
            .RuleFor(t => t.Name, f => f.Commerce.ProductName())
            .RuleFor(t => t.Owner, f => f.Person.FullName)
            .RuleFor(t => t.Description, f => f.Commerce.ProductDescription())
            .RuleFor(t => t.IsAvailable, f => f.Random.Bool());

        var tools = faker.Generate(50);
        context.Tools.AddRange(tools);
        context.SaveChanges();
    }
}