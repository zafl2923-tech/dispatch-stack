namespace Dispatch.Trucking.Domain.Entities;

public class Journey
{
    public Guid Id { get; private set; }
    public Guid DriverId { get; private set; }
    public Guid VehicleId { get; private set; }
    public Guid? RouteId { get; private set; }
    public string Origin { get; private set; } = string.Empty;
    public string Destination { get; private set; } = string.Empty;
    public USMCACountry OriginCountry { get; private set; }
    public USMCACountry DestinationCountry { get; private set; }
    public DateTime StartTime { get; private set; }
    public DateTime? EndTime { get; private set; }
    public TimeSpan? Duration => EndTime - StartTime;
    public decimal Distance { get; private set; } // miles
    public decimal FuelUsed { get; private set; } // gallons
    public decimal FuelEconomy => Distance > 0 && FuelUsed > 0 ? Distance / FuelUsed : 0;
    public JourneyStatus Status { get; private set; }
    public string LoadDescription { get; private set; } = string.Empty;
    public decimal LoadWeight { get; private set; } // lbs
    public string Remarks { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public Driver Driver { get; private set; } = null!;
    public Vehicle Vehicle { get; private set; } = null!;
    public Route? Route { get; private set; }
    public CrossBorderPermit? CrossBorderPermit { get; private set; }

    private readonly List<HoursOfServiceLog> _hoursOfServiceLogs = new();
    public IReadOnlyCollection<HoursOfServiceLog> HoursOfServiceLogs => _hoursOfServiceLogs.AsReadOnly();

    public Journey(
        Guid driverId,
        Guid vehicleId,
        string origin,
        string destination,
        USMCACountry originCountry,
        USMCACountry destinationCountry,
        decimal distance,
        string loadDescription,
        decimal loadWeight)
    {
        Id = Guid.NewGuid();
        DriverId = driverId;
        VehicleId = vehicleId;
        Origin = origin;
        Destination = destination;
        OriginCountry = originCountry;
        DestinationCountry = destinationCountry;
        Distance = distance;
        LoadDescription = loadDescription;
        LoadWeight = loadWeight;
        Status = JourneyStatus.Planned;
        StartTime = DateTime.UtcNow;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;

        Validate();
    }

    private void Validate()
    {
        if (string.IsNullOrWhiteSpace(Origin))
            throw new ArgumentException("Origin is required");
        if (string.IsNullOrWhiteSpace(Destination))
            throw new ArgumentException("Destination is required");
        if (Distance <= 0)
            throw new ArgumentException("Distance must be greater than 0");
        if (LoadWeight < 0)
            throw new ArgumentException("Load weight must be non-negative");
    }

    public void StartJourney()
    {
        if (Status != JourneyStatus.Planned)
            throw new InvalidOperationException("Journey must be in Planned status to start");

        Status = JourneyStatus.InProgress;
        StartTime = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void EndJourney(decimal fuelUsed)
    {
        if (Status != JourneyStatus.InProgress)
            throw new InvalidOperationException("Journey must be in progress to end");

        Status = JourneyStatus.Completed;
        EndTime = DateTime.UtcNow;
        FuelUsed = fuelUsed;
        UpdatedAt = DateTime.UtcNow;
    }

    public void CancelJourney(string reason)
    {
        if (Status == JourneyStatus.Completed)
            throw new InvalidOperationException("Cannot cancel completed journey");

        Status = JourneyStatus.Cancelled;
        EndTime = DateTime.UtcNow;
        Remarks = reason;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddHoursOfServiceLog(HoursOfServiceLog log)
    {
        if (log.DriverId != DriverId)
            throw new ArgumentException("Log must belong to journey driver");

        _hoursOfServiceLogs.Add(log);
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsCrossBorder() => OriginCountry != DestinationCountry;
    public bool IsCompleted() => Status == JourneyStatus.Completed;
    public bool IsInProgress() => Status == JourneyStatus.InProgress;
    public bool IsOverdue() => Status == JourneyStatus.InProgress && EndTime < DateTime.UtcNow;

    public TimeSpan GetDrivingTime()
    {
        return TimeSpan.FromMinutes(_hoursOfServiceLogs
            .Where(log => log.IsDrivingTime())
            .Sum(log => log.Duration.TotalMinutes));
    }

    public TimeSpan GetOnDutyTime()
    {
        return TimeSpan.FromMinutes(_hoursOfServiceLogs
            .Where(log => log.IsOnDutyTime())
            .Sum(log => log.Duration.TotalMinutes));
    }

    public USMCAComplianceStatus GetComplianceStatus()
    {
        var drivingTime = GetDrivingTime();
        var onDutyTime = GetOnDutyTime();

        // Check USMCA rules
        bool elevenHourRule = drivingTime.TotalHours <= 11;
        bool fourteenHourRule = onDutyTime.TotalHours <= 14;
        
        // 30-minute break rule (simplified - would need more complex logic in real implementation)
        bool thirtyMinuteBreak = drivingTime.TotalHours <= 8;

        if (elevenHourRule && fourteenHourRule && thirtyMinuteBreak)
            return USMCAComplianceStatus.Compliant;

        return USMCAComplianceStatus.NonCompliant;
    }
}

public enum JourneyStatus
{
    Planned,
    InProgress,
    Completed,
    Cancelled,
    Delayed
}
