namespace Dispatch.Trucking.Domain.Entities;

public class Vehicle
{
    public Guid Id { get; private set; }
    public string VIN { get; private set; } = string.Empty;
    public string LicensePlate { get; private set; } = string.Empty;
    public string Make { get; private set; } = string.Empty;
    public string Model { get; private set; } = string.Empty;
    public int Year { get; private set; }
    public decimal FuelCapacity { get; private set; } // gallons
    public string FuelType { get; private set; } = string.Empty; // Diesel, Gasoline, Electric
    public decimal CurrentFuelLevel { get; private set; } // gallons
    public decimal OdometerReading { get; private set; } // miles
    public DateTime LastInspectionDate { get; private set; }
    public DateTime NextInspectionDate { get; private set; }
    public bool IsUSMCACompliant { get; private set; }
    public USMCACountry RegisteredCountry { get; private set; }
    public string CarrierName { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private readonly List<Journey> _journeys = new();
    public IReadOnlyCollection<Journey> Journeys => _journeys.AsReadOnly();

    public Vehicle(
        string vin,
        string licensePlate,
        string make,
        string model,
        int year,
        decimal fuelCapacity,
        string fuelType,
        USMCACountry registeredCountry,
        string carrierName)
    {
        Id = Guid.NewGuid();
        VIN = vin;
        LicensePlate = licensePlate;
        Make = make;
        Model = model;
        Year = year;
        FuelCapacity = fuelCapacity;
        FuelType = fuelType;
        RegisteredCountry = registeredCountry;
        CarrierName = carrierName;
        CurrentFuelLevel = fuelCapacity; // Assume full tank
        LastInspectionDate = DateTime.UtcNow;
        NextInspectionDate = DateTime.UtcNow.AddYears(1);
        IsUSMCACompliant = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;

        Validate();
    }

    private void Validate()
    {
        if (string.IsNullOrWhiteSpace(VIN))
            throw new ArgumentException("VIN is required");
        if (string.IsNullOrWhiteSpace(LicensePlate))
            throw new ArgumentException("License plate is required");
        if (Year < 1900 || Year > DateTime.UtcNow.Year + 1)
            throw new ArgumentException("Invalid vehicle year");
        if (FuelCapacity <= 0)
            throw new ArgumentException("Fuel capacity must be greater than 0");
    }

    public void UpdateFuelLevel(decimal newLevel)
    {
        if (newLevel < 0 || newLevel > FuelCapacity)
            throw new ArgumentException("Fuel level must be between 0 and capacity");

        CurrentFuelLevel = newLevel;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateOdometer(decimal newReading)
    {
        if (newReading < OdometerReading)
            throw new ArgumentException("Odometer reading cannot decrease");

        OdometerReading = newReading;
        UpdatedAt = DateTime.UtcNow;
    }

    public void CompleteInspection(bool passed)
    {
        LastInspectionDate = DateTime.UtcNow;
        NextInspectionDate = DateTime.UtcNow.AddYears(1);
        IsUSMCACompliant = passed;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddJourney(Journey journey)
    {
        _journeys.Add(journey);
        UpdatedAt = DateTime.UtcNow;
    }

    public bool NeedsInspection() => NextInspectionDate <= DateTime.UtcNow;
    public bool IsLowOnFuel() => CurrentFuelLevel <= (FuelCapacity * 0.1m); // Less than 10%
    public decimal FuelRange() => FuelEconomy * CurrentFuelLevel; // Simplified calculation

    // Simplified fuel economy - would be calculated from actual journey data
    public decimal FuelEconomy { get; private set; } = 6.5m; // Default mpg
}
