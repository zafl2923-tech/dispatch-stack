using DispatchStack.Api.Data;
using DispatchStack.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace DispatchStack.Api.Services
{
    public interface IImportingCompanyService
    {
        Task<IEnumerable<ImportingCompany>> GetAllAsync();
        Task<ImportingCompany?> GetByIdAsync(Guid id);
        Task<ImportingCompany> CreateAsync(ImportingCompany company);
        Task<ImportingCompany?> UpdateAsync(Guid id, ImportingCompany company);
        Task<bool> DeleteAsync(Guid id);
    }

    public class ImportingCompanyService : IImportingCompanyService
    {
        private readonly DispatchStackDbContext _context;

        public ImportingCompanyService(DispatchStackDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ImportingCompany>> GetAllAsync()
        {
            return await _context.ImportingCompanies.ToListAsync();
        }

        public async Task<ImportingCompany?> GetByIdAsync(Guid id)
        {
            return await _context.ImportingCompanies.FindAsync(id);
        }

        public async Task<ImportingCompany> CreateAsync(ImportingCompany company)
        {
            company.Id = Guid.NewGuid();
            company.CreatedAt = DateTime.UtcNow;
            company.UpdatedAt = DateTime.UtcNow;
            _context.ImportingCompanies.Add(company);
            await _context.SaveChangesAsync();
            return company;
        }

        public async Task<ImportingCompany?> UpdateAsync(Guid id, ImportingCompany company)
        {
            var existing = await _context.ImportingCompanies.FindAsync(id);
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
            existing.ImportLicenseNumber = company.ImportLicenseNumber;
            existing.ImportLicenseExpiryDate = company.ImportLicenseExpiryDate;
            existing.USMCAStatus = company.USMCAStatus;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var company = await _context.ImportingCompanies.FindAsync(id);
            if (company == null) return false;

            _context.ImportingCompanies.Remove(company);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
