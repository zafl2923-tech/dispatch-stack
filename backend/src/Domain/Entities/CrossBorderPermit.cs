namespace Dispatch.Trucking.Domain.Entities;

public class CrossBorderPermit
{
    public Guid Id { get; private set; }
    public Guid DriverId { get; private set; }
    public USMCACountry FromCountry { get; private set; }
    public USMCACountry ToCountry { get; private set; }
    public string PermitNumber { get; private set; } = string.Empty;
    public DateTime IssuedAt { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public CrossBorderStatus Status { get; private set; }
    public string CargoDescription { get; private set; } = string.Empty;
    public decimal CargoValue { get; private set; }
    public string CarrierName { get; private set; } = string.Empty;
    public string VehicleLicensePlate { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime? ClearedAt { get; private set; }

    public Driver Driver { get; private set; } = null!;

    public CrossBorderPermit(
        Guid driverId,
        USMCACountry fromCountry,
        USMCACountry toCountry,
        string permitNumber,
        DateTime issuedAt,
        DateTime expiresAt,
        string cargoDescription,
        decimal cargoValue,
        string carrierName,
        string vehicleLicensePlate)
    {
        Id = Guid.NewGuid();
        DriverId = driverId;
        FromCountry = fromCountry;
        ToCountry = toCountry;
        PermitNumber = permitNumber;
        IssuedAt = issuedAt;
        ExpiresAt = expiresAt;
        Status = CrossBorderStatus.PreClearance;
        CargoDescription = cargoDescription;
        CargoValue = cargoValue;
        CarrierName = carrierName;
        VehicleLicensePlate = vehicleLicensePlate;
        CreatedAt = DateTime.UtcNow;

        Validate();
    }

    private void Validate()
    {
        if (FromCountry == ToCountry)
            throw new ArgumentException("From and To countries must be different for cross-border permits");

        if (IssuedAt >= ExpiresAt)
            throw new ArgumentException("Issue date must be before expiry date");

        if (string.IsNullOrWhiteSpace(PermitNumber))
            throw new ArgumentException("Permit number is required");
    }

    public bool IsValid() => ExpiresAt > DateTime.UtcNow && Status != CrossBorderStatus.CustomsHold;

    public void MarkAsCleared()
    {
        Status = CrossBorderStatus.Cleared;
        ClearedAt = DateTime.UtcNow;
    }

    public void PlaceOnCustomsHold()
    {
        Status = CrossBorderStatus.CustomsHold;
    }

    public void MarkAsInTransit()
    {
        if (Status == CrossBorderStatus.PreClearance)
            Status = CrossBorderStatus.InTransit;
    }

    public bool IsUSMCACompliant()
    {
        // USMCA compliance rules for cross-border permits
        return IsValid() &&
               CargoValue <= 2500m && // Simplified de minimis value
               !string.IsNullOrWhiteSpace(CarrierName) &&
               !string.IsNullOrWhiteSpace(VehicleLicensePlate);
    }
}
