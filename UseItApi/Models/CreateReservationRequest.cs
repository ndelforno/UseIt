namespace UseItApi.Controllers;


public class CreateReservationRequest
{
    public int ToolId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
