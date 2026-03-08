using DispatchStack.Api.Models.DTOs;
using DispatchStack.Api.Models.Entities;
using DispatchStack.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DispatchStack.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportingCompaniesController : ControllerBase
    {
        private readonly IExportingCompanyService _companyService;

        public ExportingCompaniesController(IExportingCompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExportingCompanyDto>>> GetAll()
        {
            var companies = await _companyService.GetAllAsync();
            var dtos = companies.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExportingCompanyDto>> GetById(Guid id)
        {
            var company = await _companyService.GetByIdAsync(id);
            if (company == null) return NotFound();
            return Ok(MapToDto(company));
        }

        [HttpPost]
        public async Task<ActionResult<ExportingCompanyDto>> Create([FromBody] ExportingCompanyDto dto)
        {
            var company = MapToEntity(dto);
            var created = await _companyService.CreateAsync(company);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToDto(created));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ExportingCompanyDto>> Update(Guid id, [FromBody] ExportingCompanyDto dto)
        {
            var company = MapToEntity(dto);
            var updated = await _companyService.UpdateAsync(id, company);
            if (updated == null) return NotFound();
            return Ok(MapToDto(updated));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _companyService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        private static ExportingCompanyDto MapToDto(ExportingCompany company)
        {
            return new ExportingCompanyDto
            {
                Id = company.Id,
                CompanyName = company.CompanyName,
                BusinessNumber = company.BusinessNumber,
                TaxId = company.TaxId,
                Address = company.Address,
                City = company.City,
                Region = company.Region,
                Country = company.Country,
                PostalCode = company.PostalCode,
                ContactName = company.ContactName,
                ContactEmail = company.ContactEmail,
                ContactPhone = company.ContactPhone,
                ExportLicenseNumber = company.ExportLicenseNumber,
                ExportLicenseExpiryDate = company.ExportLicenseExpiryDate,
                USMCAStatus = company.USMCAStatus
            };
        }

        private static ExportingCompany MapToEntity(ExportingCompanyDto dto)
        {
            return new ExportingCompany
            {
                CompanyName = dto.CompanyName,
                BusinessNumber = dto.BusinessNumber,
                TaxId = dto.TaxId,
                Address = dto.Address,
                City = dto.City,
                Region = dto.Region,
                Country = dto.Country,
                PostalCode = dto.PostalCode,
                ContactName = dto.ContactName,
                ContactEmail = dto.ContactEmail,
                ContactPhone = dto.ContactPhone,
                ExportLicenseNumber = dto.ExportLicenseNumber,
                ExportLicenseExpiryDate = dto.ExportLicenseExpiryDate,
                USMCAStatus = dto.USMCAStatus
            };
        }
    }
}
