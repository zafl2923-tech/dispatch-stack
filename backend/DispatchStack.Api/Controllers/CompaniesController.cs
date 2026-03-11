using DispatchStack.Api.Models.DTOs;
using DispatchStack.Api.Models.Entities;
using DispatchStack.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DispatchStack.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompaniesController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompanyDto>>> GetAll([FromQuery] string? type = null)
        {
            IEnumerable<Company> companies;
            
            if (!string.IsNullOrEmpty(type))
            {
                companies = await _companyService.GetByTypeAsync(type);
            }
            else
            {
                companies = await _companyService.GetAllAsync();
            }
            
            var dtos = companies.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyDto>> GetById(Guid id)
        {
            var company = await _companyService.GetByIdAsync(id);
            if (company == null) return NotFound();
            return Ok(MapToDto(company));
        }

        [HttpPost]
        public async Task<ActionResult<CompanyDto>> Create([FromBody] CompanyDto dto)
        {
            var company = MapToEntity(dto);
            var created = await _companyService.CreateAsync(company);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToDto(created));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CompanyDto>> Update(Guid id, [FromBody] CompanyDto dto)
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

        private static CompanyDto MapToDto(Company company)
        {
            return new CompanyDto
            {
                Id = company.Id,
                CompanyName = company.CompanyName,
                CompanyType = company.CompanyType,
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
                ImportLicenseNumber = company.ImportLicenseNumber,
                ImportLicenseExpiryDate = company.ImportLicenseExpiryDate,
                USMCAStatus = company.USMCAStatus
            };
        }

        private static Company MapToEntity(CompanyDto dto)
        {
            return new Company
            {
                CompanyName = dto.CompanyName,
                CompanyType = dto.CompanyType,
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
                ImportLicenseNumber = dto.ImportLicenseNumber,
                ImportLicenseExpiryDate = dto.ImportLicenseExpiryDate,
                USMCAStatus = dto.USMCAStatus
            };
        }
    }
}
