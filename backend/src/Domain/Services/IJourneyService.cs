namespace Dispatch.Trucking.Domain.Services;

public interface IJourneyService
{
    Task<Journey> CreateJourneyAsync(CreateJourneyRequest request);
    Task<Journey> StartJourneyAsync(Guid journeyId);
    Task<Journey> EndJourneyAsync(Guid journeyId, decimal fuelUsed);
    Task<Journey> CancelJourneyAsync(Guid journeyId, string reason);
    Task<Journey> GetJourneyAsync(Guid journeyId);
    Task<List<Journey>> GetActiveJourneysAsync(Guid driverId);
    Task<List<Journey>> GetJourneyHistoryAsync(Guid driverId, DateTime? startDate, DateTime? endDate);
    Task<Journey> AddHoursOfServiceLogAsync(Guid journeyId, HoursOfServiceLog log);
    Task<USMCAComplianceResult> ValidateJourneyComplianceAsync(Guid journeyId);
}

public class CreateJourneyRequest
{
    public Guid DriverId { get; set; }
    public Guid VehicleId { get; set; }
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public USMCACountry OriginCountry { get; set; }
    public USMCACountry DestinationCountry { get; set; }
    public decimal Distance { get; set; }
    public string LoadDescription { get; set; } = string.Empty;
    public decimal LoadWeight { get; set; }
    public bool RequiresCrossBorderPermit { get; set; }
}
