namespace DispatchStack.Api.Models.DTOs
{
    public class ExportingCompanyDto
    {
        public Guid? Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
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
        public string ExportLicenseNumber { get; set; } = string.Empty;
        public DateTime? ExportLicenseExpiryDate { get; set; }
        public string USMCAStatus { get; set; } = string.Empty;
    }
}
