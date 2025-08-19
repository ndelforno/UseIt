namespace UseItApi.Data;

public class Tool
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Owner { get; set; } = "";
    public bool IsAvailable { get; set; } = true;
}
