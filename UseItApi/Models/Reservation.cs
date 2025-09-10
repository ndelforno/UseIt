namespace UseItApi.Data;

public class Reservation
{
    public Guid Id { get; set; }
    public Guid ToolId { get; set; }
    public Guid RenterId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Pending";
}
