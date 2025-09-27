using UseItApi.Data;
using UseItApi.Models;

namespace UseItApi.Services;

public interface IEmailService
{
    Task SendReservationCreatedAsync(User owner, Tool tool, Reservation reservation, User renter, CancellationToken ct = default);
}
