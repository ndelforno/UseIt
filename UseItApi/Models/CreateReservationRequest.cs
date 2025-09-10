namespace UseItApi.Controllers;


public class CreateReservationRequest
{
    public Guid ToolId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
