using DispatchStack.Api.Data;
using DispatchStack.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace DispatchStack.Api.Services
{
    public interface IExportingCompanyService
    {
        Task<IEnumerable<ExportingCompany>> GetAllAsync();
        Task<ExportingCompany?> GetByIdAsync(Guid id);
        Task<ExportingCompany> CreateAsync(ExportingCompany company);
        Task<ExportingCompany?> UpdateAsync(Guid id, ExportingCompany company);
        Task<bool> DeleteAsync(Guid id);
    }

    public class ExportingCompanyService : IExportingCompanyService
    {
        private readonly DispatchStackDbContext _context;

        public ExportingCompanyService(DispatchStackDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExportingCompany>> GetAllAsync()
        {
            return await _context.ExportingCompanies.ToListAsync();
        }

        public async Task<ExportingCompany?> GetByIdAsync(Guid id)
        {
            return await _context.ExportingCompanies.FindAsync(id);
        }

        public async Task<ExportingCompany> CreateAsync(ExportingCompany company)
        {
            company.Id = Guid.NewGuid();
            company.CreatedAt = DateTime.UtcNow;
            company.UpdatedAt = DateTime.UtcNow;
            _context.ExportingCompanies.Add(company);
            await _context.SaveChangesAsync();
            return company;
        }

        public async Task<ExportingCompany?> UpdateAsync(Guid id, ExportingCompany company)
        {
            var existing = await _context.ExportingCompanies.FindAsync(id);
            if (existing == null) return null;

            existing.CompanyName = company.CompanyName;
            existing.BusinessNumber = company.BusinessNumber;
            existing.TaxId = company.TaxId;
            existing.Address = company.Address;
            existing.City = company.City;
            existing.Region = company.Region;
            existing.Country = company.Country;
            existing.PostalCode = company.PostalCode;
            existing.ContactName = company.ContactName;
            existing.ContactEmail = company.ContactEmail;
            existing.ContactPhone = company.ContactPhone;
            existing.ExportLicenseNumber = company.ExportLicenseNumber;
            existing.ExportLicenseExpiryDate = company.ExportLicenseExpiryDate;
            existing.USMCAStatus = company.USMCAStatus;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var company = await _context.ExportingCompanies.FindAsync(id);
            if (company == null) return false;

            _context.ExportingCompanies.Remove(company);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
