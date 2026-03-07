namespace Dispatch.Trucking.Domain.Entities;

public class Driver
{
    public Guid Id { get; private set; }
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string LicenseNumber { get; private set; } = string.Empty;
    public DriverLicenseType LicenseType { get; private set; }
    public USMCACountry LicenseCountry { get; private set; }
    public DateTime LicenseExpiry { get; private set; }
    public bool IsUSMCAEligible { get; private set; }
    public DateTime MedicalCertificateExpiry { get; private set; }
    public string PassportNumber { get; private set; } = string.Empty;
    public DateTime PassportExpiry { get; private set; }
    public USMCAComplianceStatus ComplianceStatus { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private readonly List<HoursOfServiceLog> _hoursOfServiceLogs = new();
    public IReadOnlyCollection<HoursOfServiceLog> HoursOfServiceLogs => _hoursOfServiceLogs.AsReadOnly();

    private readonly List<CrossBorderPermit> _crossBorderPermits = new();
    public IReadOnlyCollection<CrossBorderPermit> CrossBorderPermits => _crossBorderPermits.AsReadOnly();

    public Driver(
        string firstName,
        string lastName,
        string licenseNumber,
        DriverLicenseType licenseType,
        USMCACountry licenseCountry,
        DateTime licenseExpiry,
        bool isUSMCAEligible,
        DateTime medicalCertificateExpiry,
        string passportNumber,
        DateTime passportExpiry)
    {
        Id = Guid.NewGuid();
        FirstName = firstName;
        LastName = lastName;
        LicenseNumber = licenseNumber;
        LicenseType = licenseType;
        LicenseCountry = licenseCountry;
        LicenseExpiry = licenseExpiry;
        IsUSMCAEligible = isUSMCAEligible;
        MedicalCertificateExpiry = medicalCertificateExpiry;
        PassportNumber = passportNumber;
        PassportExpiry = passportExpiry;
        ComplianceStatus = USMCAComplianceStatus.PendingReview;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateComplianceStatus(USMCAComplianceStatus status)
    {
        ComplianceStatus = status;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsLicenseValid() => LicenseExpiry > DateTime.UtcNow;
    public bool IsMedicalCertificateValid() => MedicalCertificateExpiry > DateTime.UtcNow;
    public bool IsPassportValid() => PassportExpiry > DateTime.UtcNow;

    public bool IsFullyCompliant() =>
        IsLicenseValid() &&
        IsMedicalCertificateValid() &&
        IsPassportValid() &&
        IsUSMCAEligible &&
        ComplianceStatus == USMCAComplianceStatus.Compliant;

    public void AddHoursOfServiceLog(HoursOfServiceLog log)
    {
        _hoursOfServiceLogs.Add(log);
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddCrossBorderPermit(CrossBorderPermit permit)
    {
        _crossBorderPermits.Add(permit);
        UpdatedAt = DateTime.UtcNow;
    }
}
