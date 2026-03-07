namespace Dispatch.Trucking.Domain.Entities;

public class HoursOfServiceLog
{
    public Guid Id { get; private set; }
    public Guid DriverId { get; private set; }
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }
    public HoursOfServiceType ServiceType { get; private set; }
    public TimeSpan Duration => EndTime - StartTime;
    public USMCACountry Country { get; private set; }
    public string Location { get; private set; } = string.Empty;
    public string Remarks { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }

    public Driver Driver { get; private set; } = null!;

    public HoursOfServiceLog(
        Guid driverId,
        DateTime startTime,
        DateTime endTime,
        HoursOfServiceType serviceType,
        USMCACountry country,
        string location,
        string remarks = "")
    {
        Id = Guid.NewGuid();
        DriverId = driverId;
        StartTime = startTime;
        EndTime = endTime;
        ServiceType = serviceType;
        Country = country;
        Location = location;
        Remarks = remarks;
        CreatedAt = DateTime.UtcNow;

        Validate();
    }

    private void Validate()
    {
        if (StartTime >= EndTime)
            throw new ArgumentException("Start time must be before end time");

        if (Duration.TotalHours > 24)
            throw new ArgumentException("Duration cannot exceed 24 hours");
    }

    public bool IsDrivingTime() => ServiceType == HoursOfServiceType.Driving;
    public bool IsOnDutyTime() => ServiceType == HoursOfServiceType.OnDuty || ServiceType == HoursOfServiceType.Driving;
    public bool IsRestTime() => ServiceType == HoursOfServiceType.OffDuty || ServiceType == HoursOfServiceType.SleeperBerth;

    public static HoursOfServiceLog CreateDrivingPeriod(
        Guid driverId,
        DateTime startTime,
        DateTime endTime,
        USMCACountry country,
        string location)
    {
        return new HoursOfServiceLog(
            driverId,
            startTime,
            endTime,
            HoursOfServiceType.Driving,
            country,
            location);
    }

    public static HoursOfServiceLog CreateRestPeriod(
        Guid driverId,
        DateTime startTime,
        DateTime endTime,
        HoursOfServiceType restType,
        USMCACountry country,
        string location)
    {
        if (restType != HoursOfServiceType.OffDuty && restType != HoursOfServiceType.SleeperBerth)
            throw new ArgumentException("Rest period must be OffDuty or SleeperBerth");

        return new HoursOfServiceLog(
            driverId,
            startTime,
            endTime,
            restType,
            country,
            location);
    }
}
