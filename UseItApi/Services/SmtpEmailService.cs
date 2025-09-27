using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using UseItApi.Data;
using UseItApi.Models;

namespace UseItApi.Services;

public sealed class SmtpEmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public SmtpEmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendReservationCreatedAsync(User owner, Tool tool, Reservation reservation, User renter, CancellationToken ct = default)
    {
        using var client = new SmtpClient(_settings.Host, _settings.Port)
        {
            EnableSsl = _settings.EnableSsl,
            Credentials = GetCredentials()
        };

        var message = new MailMessage
        {
            From = new MailAddress(_settings.From, _settings.DisplayName),
            Subject = $"New reservation request for {tool.Name}",
            Body = $"""
                    Hi {owner.Name},

                    {renter.Name} ({renter.Email}) requested {tool.Name} from {reservation.StartDate:d} to {reservation.EndDate:d}.

                    Review the reservation in UseIt to accept or decline.

                    Thanks,
                    UseIt Team
                    """,
            IsBodyHtml = false
        };

        message.To.Add(owner.Email);

        await client.SendMailAsync(message, ct);
    }

    private ICredentialsByHost GetCredentials()
    {
        if (string.IsNullOrWhiteSpace(_settings.User))
        {
            return CredentialCache.DefaultNetworkCredentials;
        }

        return new NetworkCredential(_settings.User, _settings.Password);
    }
}
