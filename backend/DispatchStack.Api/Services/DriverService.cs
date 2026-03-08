using DispatchStack.Api.Models.Entities;

namespace DispatchStack.Api.Services
{
    public interface IDriverService
    {
        Task<IEnumerable<Driver>> GetAllAsync();
        Task<Driver?> GetByIdAsync(Guid id);
        Task<Driver> CreateAsync(Driver driver);
        Task<Driver?> UpdateAsync(Guid id, Driver driver);
        Task<bool> DeleteAsync(Guid id);
    }

    public class DriverService : IDriverService
    {
        private readonly List<Driver> _drivers = new();
        private readonly SemaphoreSlim _lock = new(1, 1);

        public async Task<IEnumerable<Driver>> GetAllAsync()
        {
            await _lock.WaitAsync();
            try
            {
                return _drivers.ToList();
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<Driver?> GetByIdAsync(Guid id)
        {
            await _lock.WaitAsync();
            try
            {
                return _drivers.FirstOrDefault(d => d.Id == id);
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<Driver> CreateAsync(Driver driver)
        {
            await _lock.WaitAsync();
            try
            {
                driver.Id = Guid.NewGuid();
                driver.CreatedAt = DateTime.UtcNow;
                driver.UpdatedAt = DateTime.UtcNow;
                _drivers.Add(driver);
                return driver;
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<Driver?> UpdateAsync(Guid id, Driver driver)
        {
            await _lock.WaitAsync();
            try
            {
                var existing = _drivers.FirstOrDefault(d => d.Id == id);
                if (existing == null) return null;

                existing.FirstName = driver.FirstName;
                existing.LastName = driver.LastName;
                existing.LicenseNumber = driver.LicenseNumber;
                existing.LicenseClass = driver.LicenseClass;
                existing.LicenseCountry = driver.LicenseCountry;
                existing.LicenseExpiryDate = driver.LicenseExpiryDate;
                existing.Email = driver.Email;
                existing.Phone = driver.Phone;
                existing.DateOfBirth = driver.DateOfBirth;
                existing.Address = driver.Address;
                existing.City = driver.City;
                existing.Region = driver.Region;
                existing.Country = driver.Country;
                existing.PostalCode = driver.PostalCode;
                existing.EmploymentStatus = driver.EmploymentStatus;
                existing.HireDate = driver.HireDate;
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
                var driver = _drivers.FirstOrDefault(d => d.Id == id);
                if (driver == null) return false;

                _drivers.Remove(driver);
                return true;
            }
            finally
            {
                _lock.Release();
            }
        }
    }
}
