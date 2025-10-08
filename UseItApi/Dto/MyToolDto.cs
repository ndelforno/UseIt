namespace UseItApi.Dto;

public class MyToolDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Deposit { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
    public int PendingCount { get; set; }
}
