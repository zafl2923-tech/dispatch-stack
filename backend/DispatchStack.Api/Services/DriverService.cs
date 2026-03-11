using DispatchStack.Api.Data;
using DispatchStack.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

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
        private readonly DispatchStackDbContext _context;

        public DriverService(DispatchStackDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Driver>> GetAllAsync()
        {
            return await _context.Drivers.ToListAsync();
        }

        public async Task<Driver?> GetByIdAsync(Guid id)
        {
            return await _context.Drivers.FindAsync(id);
        }

        public async Task<Driver> CreateAsync(Driver driver)
        {
            driver.Id = Guid.NewGuid();
            driver.CreatedAt = DateTime.UtcNow;
            driver.UpdatedAt = DateTime.UtcNow;
            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();
            return driver;
        }

        public async Task<Driver?> UpdateAsync(Guid id, Driver driver)
        {
            var existing = await _context.Drivers.FindAsync(id);
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

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null) return false;

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
