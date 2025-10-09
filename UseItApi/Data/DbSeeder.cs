namespace UseItApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Tools.Any())
        {
            context.RemoveRange(context.Tools);
        }

        var sampleTools = new List<Tool>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "DeWalt 20V Max Drill",
                Description = "Compact cordless drill/driver with 2-speed transmission—perfect for cabinetry, framing, and quick household fixes.",
                OwnerId = Guid.NewGuid(),
                IsAvailable = true,
                Category = "Woodworking",
                ImageUrl = "/images/seeds/drill.svg",
                Price = "$18 / day",
                Deposit = "$50",
                PostalCode = "M5V 2T6",
                Area = "Downtown Toronto",
                Brand = "DeWalt",
                Model = "DCD709C2"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Makita Circular Saw",
                Description = "6-1/2\" cordless circular saw with brushless motor and bevel capacity up to 50°—ideal for trim and decking projects.",
                OwnerId = Guid.NewGuid(),
                IsAvailable = true,
                Category = "Renovation",
                ImageUrl = "/images/seeds/circular-saw.svg",
                Price = "$15 / day",
                Deposit = "$40",
                PostalCode = "M4C 1A1",
                Area = "East York",
                Brand = "Makita",
                Model = "XSS02Z"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Sun Joe Pressure Washer",
                Description = "2,030 PSI electric pressure washer with quick-connect nozzles—great for siding, patios, and vehicles.",
                OwnerId = Guid.NewGuid(),
                IsAvailable = true,
                Category = "Gardening",
                ImageUrl = "/images/seeds/pressure-washer.svg",
                Price = "$22 / day",
                Deposit = "$75",
                PostalCode = "M6R 1X2",
                Area = "Roncesvalles",
                Brand = "Sun Joe",
                Model = "SPX3000"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Bosch Laser Level",
                Description = "Self-leveling 360° cross-line laser with tripod—perfect for tiling, cabinet installs, and framing.",
                OwnerId = Guid.NewGuid(),
                IsAvailable = true,
                Category = "Renovation",
                ImageUrl = "/images/seeds/laser-level.svg",
                Price = "$20 / day",
                Deposit = "$60",
                PostalCode = "M5S 2E4",
                Area = "Annex",
                Brand = "Bosch",
                Model = "GLL 3-330CG"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Milwaukee Impact Wrench",
                Description = "High torque 1/2\" cordless impact wrench with friction ring—built for automotive & heavy equipment work.",
                OwnerId = Guid.NewGuid(),
                IsAvailable = false,
                Category = "Mechanic",
                ImageUrl = "/images/seeds/impact-wrench.svg",
                Price = "$28 / day",
                Deposit = "$90",
                PostalCode = "M9B 0A7",
                Area = "Etobicoke",
                Brand = "Milwaukee",
                Model = "2767-20"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Stihl Gas Hedge Trimmer",
                Description = "24\" professional hedge trimmer with double-sided blades—ideal for shaping mature hedges and shrubs.",
                OwnerId = Guid.NewGuid(),
                IsAvailable = true,
                Category = "Gardening",
                ImageUrl = "/images/seeds/hedge-trimmer.svg",
                Price = "$24 / day",
                Deposit = "$80",
                PostalCode = "M1M 1M1",
                Area = "Scarborough Bluffs",
                Brand = "Stihl",
                Model = "HS 45"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Ridgid Wet Tile Saw",
                Description = "7\" tabletop tile saw with sliding table and water management system—great for backsplash or bathroom renovations.",
                OwnerId = Guid.NewGuid(),
                IsAvailable = true,
                Category = "Renovation",
                ImageUrl = "/images/seeds/tile-saw.svg",
                Price = "$26 / day",
                Deposit = "$100",
                PostalCode = "M2N 5W9",
                Area = "North York",
                Brand = "Ridgid",
                Model = "R4031"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Ryobi 6-Gallon Air Compressor",
                Description = "Quiet 6-gallon oil-free compressor with hose kit—perfect for brad nailers, staplers, and finish guns.",
                OwnerId = Guid.NewGuid(),
                IsAvailable = true,
                Category = "Woodworking",
                ImageUrl = "/images/seeds/air-compressor.svg",
                Price = "$16 / day",
                Deposit = "$50",
                PostalCode = "M5P 1N6",
                Area = "Forest Hill",
                Brand = "Ryobi",
                Model = "P739"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Honda EU2200i Generator",
                Description = "Super-quiet inverter generator—2,200 watts for job-site power or weekend camping.",
                OwnerId = Guid.NewGuid(),
                IsAvailable = true,
                Category = "Renovation",
                ImageUrl = "/images/seeds/generator.svg",
                Price = "$32 / day",
                Deposit = "$150",
                PostalCode = "M6H 2W1",
                Area = "Bloordale",
                Brand = "Honda",
                Model = "EU2200i"
            }
        };

        context.Tools.AddRange(sampleTools);
        context.SaveChanges();
    }
}
