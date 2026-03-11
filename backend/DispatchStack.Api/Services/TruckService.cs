using DispatchStack.Api.Data;
using DispatchStack.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace DispatchStack.Api.Services
{
    public interface ITruckService
    {
        Task<IEnumerable<Truck>> GetAllAsync();
        Task<Truck?> GetByIdAsync(Guid id);
        Task<Truck> CreateAsync(Truck truck);
        Task<Truck?> UpdateAsync(Guid id, Truck truck);
        Task<bool> DeleteAsync(Guid id);
    }

    public class TruckService : ITruckService
    {
        private readonly DispatchStackDbContext _context;

        public TruckService(DispatchStackDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Truck>> GetAllAsync()
        {
            return await _context.Trucks.ToListAsync();
        }

        public async Task<Truck?> GetByIdAsync(Guid id)
        {
            return await _context.Trucks.FindAsync(id);
        }

        public async Task<Truck> CreateAsync(Truck truck)
        {
            truck.Id = Guid.NewGuid();
            truck.CreatedAt = DateTime.UtcNow;
            truck.UpdatedAt = DateTime.UtcNow;
            _context.Trucks.Add(truck);
            await _context.SaveChangesAsync();
            return truck;
        }

        public async Task<Truck?> UpdateAsync(Guid id, Truck truck)
        {
            var existing = await _context.Trucks.FindAsync(id);
            if (existing == null) return null;

            existing.UnitNumber = truck.UnitNumber;
            existing.Make = truck.Make;
            existing.Model = truck.Model;
            existing.Year = truck.Year;
            existing.VIN = truck.VIN;
            existing.LicensePlate = truck.LicensePlate;
            existing.LicenseCountry = truck.LicenseCountry;
            existing.LicenseRegion = truck.LicenseRegion;
            existing.GrossVehicleWeight = truck.GrossVehicleWeight;
            existing.MaxLoadCapacity = truck.MaxLoadCapacity;
            existing.FuelType = truck.FuelType;
            existing.FuelCapacity = truck.FuelCapacity;
            existing.Status = truck.Status;
            existing.LastMaintenanceDate = truck.LastMaintenanceDate;
            existing.NextMaintenanceDue = truck.NextMaintenanceDue;
            existing.Odometer = truck.Odometer;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var truck = await _context.Trucks.FindAsync(id);
            if (truck == null) return false;

            _context.Trucks.Remove(truck);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
