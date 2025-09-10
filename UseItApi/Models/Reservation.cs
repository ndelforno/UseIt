namespace UseItApi.Data;

public class Reservation
{
    public int Id { get; set; }
    public int ToolId { get; set; }
    public string RenterId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Pending";
}

