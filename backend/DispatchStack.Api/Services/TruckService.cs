using DispatchStack.Api.Models.Entities;

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
        private readonly List<Truck> _trucks = new();
        private readonly SemaphoreSlim _lock = new(1, 1);

        public async Task<IEnumerable<Truck>> GetAllAsync()
        {
            await _lock.WaitAsync();
            try
            {
                return _trucks.ToList();
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<Truck?> GetByIdAsync(Guid id)
        {
            await _lock.WaitAsync();
            try
            {
                return _trucks.FirstOrDefault(t => t.Id == id);
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<Truck> CreateAsync(Truck truck)
        {
            await _lock.WaitAsync();
            try
            {
                truck.Id = Guid.NewGuid();
                truck.CreatedAt = DateTime.UtcNow;
                truck.UpdatedAt = DateTime.UtcNow;
                _trucks.Add(truck);
                return truck;
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<Truck?> UpdateAsync(Guid id, Truck truck)
        {
            await _lock.WaitAsync();
            try
            {
                var existing = _trucks.FirstOrDefault(t => t.Id == id);
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
                var truck = _trucks.FirstOrDefault(t => t.Id == id);
                if (truck == null) return false;

                _trucks.Remove(truck);
                return true;
            }
            finally
            {
                _lock.Release();
            }
        }
    }
}
