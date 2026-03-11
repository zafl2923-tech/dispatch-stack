using DispatchStack.Api.Data;
using DispatchStack.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace DispatchStack.Api.Services
{
    public interface ICompanyService
    {
        Task<IEnumerable<Company>> GetAllAsync();
        Task<Company?> GetByIdAsync(Guid id);
        Task<IEnumerable<Company>> GetByTypeAsync(string type);
        Task<Company> CreateAsync(Company company);
        Task<Company?> UpdateAsync(Guid id, Company company);
        Task<bool> DeleteAsync(Guid id);
    }

    public class CompanyService : ICompanyService
    {
        private readonly DispatchStackDbContext _context;

        public CompanyService(DispatchStackDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Company>> GetAllAsync()
        {
            return await _context.Companies.ToListAsync();
        }

        public async Task<Company?> GetByIdAsync(Guid id)
        {
            return await _context.Companies.FindAsync(id);
        }

        public async Task<IEnumerable<Company>> GetByTypeAsync(string type)
        {
            return await _context.Companies
                .Where(c => c.CompanyType == type || c.CompanyType == "Both")
                .ToListAsync();
        }

        public async Task<Company> CreateAsync(Company company)
        {
            company.Id = Guid.NewGuid();
            company.CreatedAt = DateTime.UtcNow;
            company.UpdatedAt = DateTime.UtcNow;
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
            return company;
        }

        public async Task<Company?> UpdateAsync(Guid id, Company company)
        {
            var existing = await _context.Companies.FindAsync(id);
            if (existing == null) return null;

            existing.CompanyName = company.CompanyName;
            existing.CompanyType = company.CompanyType;
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
            existing.ImportLicenseNumber = company.ImportLicenseNumber;
            existing.ImportLicenseExpiryDate = company.ImportLicenseExpiryDate;
            existing.USMCAStatus = company.USMCAStatus;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null) return false;

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
