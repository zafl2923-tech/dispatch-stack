using DispatchStack.Api.Models.DTOs;
using DispatchStack.Api.Models.Entities;
using DispatchStack.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DispatchStack.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImportingCompaniesController : ControllerBase
    {
        private readonly IImportingCompanyService _companyService;

        public ImportingCompaniesController(IImportingCompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ImportingCompanyDto>>> GetAll()
        {
            var companies = await _companyService.GetAllAsync();
            var dtos = companies.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ImportingCompanyDto>> GetById(Guid id)
        {
            var company = await _companyService.GetByIdAsync(id);
            if (company == null) return NotFound();
            return Ok(MapToDto(company));
        }

        [HttpPost]
        public async Task<ActionResult<ImportingCompanyDto>> Create([FromBody] ImportingCompanyDto dto)
        {
            var company = MapToEntity(dto);
            var created = await _companyService.CreateAsync(company);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToDto(created));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ImportingCompanyDto>> Update(Guid id, [FromBody] ImportingCompanyDto dto)
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

        private static ImportingCompanyDto MapToDto(ImportingCompany company)
        {
            return new ImportingCompanyDto
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
                ImportLicenseNumber = company.ImportLicenseNumber,
                ImportLicenseExpiryDate = company.ImportLicenseExpiryDate,
                USMCAStatus = company.USMCAStatus
            };
        }

        private static ImportingCompany MapToEntity(ImportingCompanyDto dto)
        {
            return new ImportingCompany
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
                ImportLicenseNumber = dto.ImportLicenseNumber,
                ImportLicenseExpiryDate = dto.ImportLicenseExpiryDate,
                USMCAStatus = dto.USMCAStatus
            };
        }
    }
}
