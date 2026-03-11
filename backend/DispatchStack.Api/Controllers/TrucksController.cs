using DispatchStack.Api.Models.DTOs;
using DispatchStack.Api.Models.Entities;
using DispatchStack.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DispatchStack.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints require authentication
    public class TrucksController : ControllerBase
    {
        private readonly ITruckService _truckService;

        public TrucksController(ITruckService truckService)
        {
            _truckService = truckService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TruckDto>>> GetAll()
        {
            var trucks = await _truckService.GetAllAsync();
            var dtos = trucks.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TruckDto>> GetById(Guid id)
        {
            var truck = await _truckService.GetByIdAsync(id);
            if (truck == null) return NotFound();
            return Ok(MapToDto(truck));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Dispatcher")] // Only Admin and Dispatcher can create trucks
        public async Task<ActionResult<TruckDto>> Create([FromBody] TruckDto dto)
        {
            var truck = MapToEntity(dto);
            var created = await _truckService.CreateAsync(truck);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToDto(created));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Dispatcher")] // Only Admin and Dispatcher can update trucks
        public async Task<ActionResult<TruckDto>> Update(Guid id, [FromBody] TruckDto dto)
        {
            var truck = MapToEntity(dto);
            var updated = await _truckService.UpdateAsync(id, truck);
            if (updated == null) return NotFound();
            return Ok(MapToDto(updated));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Dispatcher")] // Only Admin and Dispatcher can delete trucks
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _truckService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        private static TruckDto MapToDto(Truck truck)
        {
            return new TruckDto
            {
                Id = truck.Id,
                UnitNumber = truck.UnitNumber,
                Make = truck.Make,
                Model = truck.Model,
                Year = truck.Year,
                VIN = truck.VIN,
                LicensePlate = truck.LicensePlate,
                LicenseCountry = truck.LicenseCountry,
                LicenseRegion = truck.LicenseRegion,
                GrossVehicleWeight = truck.GrossVehicleWeight,
                MaxLoadCapacity = truck.MaxLoadCapacity,
                FuelType = truck.FuelType,
                FuelCapacity = truck.FuelCapacity,
                Status = truck.Status,
                LastMaintenanceDate = truck.LastMaintenanceDate,
                NextMaintenanceDue = truck.NextMaintenanceDue,
                Odometer = truck.Odometer
            };
        }

        private static Truck MapToEntity(TruckDto dto)
        {
            return new Truck
            {
                UnitNumber = dto.UnitNumber,
                Make = dto.Make,
                Model = dto.Model,
                Year = dto.Year,
                VIN = dto.VIN,
                LicensePlate = dto.LicensePlate,
                LicenseCountry = dto.LicenseCountry,
                LicenseRegion = dto.LicenseRegion,
                GrossVehicleWeight = dto.GrossVehicleWeight,
                MaxLoadCapacity = dto.MaxLoadCapacity,
                FuelType = dto.FuelType,
                FuelCapacity = dto.FuelCapacity,
                Status = dto.Status,
                LastMaintenanceDate = dto.LastMaintenanceDate,
                NextMaintenanceDue = dto.NextMaintenanceDue,
                Odometer = dto.Odometer
            };
        }
    }
}
