namespace DispatchStack.Api.Models.Entities
{
    public class Company
    {
        public Guid Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyType { get; set; } = string.Empty; // "Exporter", "Importer", "Both"
        public string BusinessNumber { get; set; } = string.Empty;
        public string TaxId { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string ContactName { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string? ExportLicenseNumber { get; set; }
        public DateTime? ExportLicenseExpiryDate { get; set; }
        public string? ImportLicenseNumber { get; set; }
        public DateTime? ImportLicenseExpiryDate { get; set; }
        public string USMCAStatus { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
