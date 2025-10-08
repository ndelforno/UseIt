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
            .RuleFor(t => t.OwnerId, f => Guid.NewGuid())
            .RuleFor(t => t.Description, f => f.Commerce.ProductDescription())
            .RuleFor(t => t.IsAvailable, f => f.Random.Bool())
            .RuleFor(t => t.Category, f => f.PickRandom(new[] { "Woodworking", "Gardening", "Renovation", "Mechanic" }))
            .RuleFor(t => t.ImageUrl, f => f.Image.PicsumUrl())
            .RuleFor(t => t.PostalCode, f => f.Address.ZipCode())
            .RuleFor(t => t.Area, f => f.Address.City())
            .RuleFor(t => t.Price, f => f.Commerce.Price(5, 100) + " USD")
            .RuleFor(t => t.Deposit, f => f.Random.Bool() ? f.Commerce.Price(20, 200) + " USD" : string.Empty)
            .RuleFor(t => t.Brand, f => f.Company.CompanyName())
            .RuleFor(t => t.Model, f => f.Commerce.ProductMaterial());

        var tools = faker.Generate(50);
        context.Tools.AddRange(tools);
        context.SaveChanges();
    }
}
