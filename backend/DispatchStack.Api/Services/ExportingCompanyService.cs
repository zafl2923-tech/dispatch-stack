using DispatchStack.Api.Models.Entities;

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
        private readonly List<ExportingCompany> _companies = new();
        private readonly SemaphoreSlim _lock = new(1, 1);

        public async Task<IEnumerable<ExportingCompany>> GetAllAsync()
        {
            await _lock.WaitAsync();
            try
            {
                return _companies.ToList();
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<ExportingCompany?> GetByIdAsync(Guid id)
        {
            await _lock.WaitAsync();
            try
            {
                return _companies.FirstOrDefault(c => c.Id == id);
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<ExportingCompany> CreateAsync(ExportingCompany company)
        {
            await _lock.WaitAsync();
            try
            {
                company.Id = Guid.NewGuid();
                company.CreatedAt = DateTime.UtcNow;
                company.UpdatedAt = DateTime.UtcNow;
                _companies.Add(company);
                return company;
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<ExportingCompany?> UpdateAsync(Guid id, ExportingCompany company)
        {
            await _lock.WaitAsync();
            try
            {
                var existing = _companies.FirstOrDefault(c => c.Id == id);
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

                return existing;
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            await _lock.WaitAsync();
            try
            {
                var company = _companies.FirstOrDefault(c => c.Id == id);
                if (company == null) return false;

                _companies.Remove(company);
                return true;
            }
            finally
            {
                _lock.Release();
            }
        }
    }
}
