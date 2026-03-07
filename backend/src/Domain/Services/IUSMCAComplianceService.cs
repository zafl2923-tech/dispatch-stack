namespace Dispatch.Trucking.Domain.Services;

public interface IUSMCAComplianceService
{
    Task<USMCAComplianceResult> ValidateDriverComplianceAsync(Guid driverId);
    Task<USMCAComplianceResult> ValidateHoursOfServiceAsync(Guid driverId, DateTime startDate, DateTime endDate);
    Task<USMCAComplianceResult> ValidateCrossBorderPermitAsync(Guid permitId);
    Task<List<USMCAComplianceViolation>> GetComplianceViolationsAsync(Guid driverId);
}

public class USMCAComplianceResult
{
    public bool IsCompliant { get; set; }
    public USMCAComplianceStatus Status { get; set; }
    public List<USMCAComplianceViolation> Violations { get; set; } = new();
    public DateTime ValidatedAt { get; set; }
    public string Remarks { get; set; } = string.Empty;
}

public class USMCAComplianceViolation
{
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Severity Severity { get; set; }
    public DateTime DetectedAt { get; set; }
    public string Recommendation { get; set; } = string.Empty;
}

public enum Severity
{
    Low,
    Medium,
    High,
    Critical
}
