using DispatchStack.Api.Models.DTOs;
using DispatchStack.Api.Models.Entities;
using DispatchStack.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DispatchStack.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriversController : ControllerBase
    {
        private readonly IDriverService _driverService;

        public DriversController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DriverDto>>> GetAll()
        {
            var drivers = await _driverService.GetAllAsync();
            var dtos = drivers.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DriverDto>> GetById(Guid id)
        {
            var driver = await _driverService.GetByIdAsync(id);
            if (driver == null) return NotFound();
            return Ok(MapToDto(driver));
        }

        [HttpPost]
        public async Task<ActionResult<DriverDto>> Create([FromBody] DriverDto dto)
        {
            var driver = MapToEntity(dto);
            var created = await _driverService.CreateAsync(driver);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToDto(created));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DriverDto>> Update(Guid id, [FromBody] DriverDto dto)
        {
            var driver = MapToEntity(dto);
            var updated = await _driverService.UpdateAsync(id, driver);
            if (updated == null) return NotFound();
            return Ok(MapToDto(updated));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _driverService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        private static DriverDto MapToDto(Driver driver)
        {
            return new DriverDto
            {
                Id = driver.Id,
                FirstName = driver.FirstName,
                LastName = driver.LastName,
                LicenseNumber = driver.LicenseNumber,
                LicenseClass = driver.LicenseClass,
                LicenseCountry = driver.LicenseCountry,
                LicenseExpiryDate = driver.LicenseExpiryDate,
                Email = driver.Email,
                Phone = driver.Phone,
                DateOfBirth = driver.DateOfBirth,
                Address = driver.Address,
                City = driver.City,
                Region = driver.Region,
                Country = driver.Country,
                PostalCode = driver.PostalCode,
                EmploymentStatus = driver.EmploymentStatus,
                HireDate = driver.HireDate
            };
        }

        private static Driver MapToEntity(DriverDto dto)
        {
            return new Driver
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                LicenseNumber = dto.LicenseNumber,
                LicenseClass = dto.LicenseClass,
                LicenseCountry = dto.LicenseCountry,
                LicenseExpiryDate = dto.LicenseExpiryDate,
                Email = dto.Email,
                Phone = dto.Phone,
                DateOfBirth = dto.DateOfBirth,
                Address = dto.Address,
                City = dto.City,
                Region = dto.Region,
                Country = dto.Country,
                PostalCode = dto.PostalCode,
                EmploymentStatus = dto.EmploymentStatus,
                HireDate = dto.HireDate
            };
        }
    }
}
