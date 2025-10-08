namespace UseItApi.Data;

public class Tool
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public Guid OwnerId { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string Category { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public string Price { get; set; } = "";
    public string PostalCode { get; set; } = "";
    public string Area { get; set; } = "";
    public string Deposit { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Model { get; set; } = "";
}
