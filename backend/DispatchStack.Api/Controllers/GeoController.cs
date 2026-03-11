using Microsoft.AspNetCore.Mvc;
using DispatchStack.Api.Models.DTOs;

namespace DispatchStack.Api.Controllers
{
    [ApiController]
    [Route("api/geo")]
    public class GeoController : ControllerBase
    {
        [HttpPost("detect-country")]
        public ActionResult<CountryDto> DetectCountry([FromBody] LatLngDto input)
        {
            var country = GetCountryFromCoords(input.Lat, input.Lng);
            return Ok(new CountryDto { Country = country });
        }

        private string GetCountryFromCoords(double lat, double lng)
        {
            // Canada bbox (approx)
            if (lat >= 42 && lat <= 83 && lng >= -141 && lng <= -52) return "Canada";
            // United States bbox (approx, excludes territories)
            if (lat >= 24.5 && lat <= 49.5 && lng >= -125 && lng <= -66) return "United States";
            // Mexico bbox (approx)
            if (lat >= 14.5 && lat <= 32.7 && lng >= -118.5 && lng <= -86.7) return "Mexico";
            return "Unknown";
        }
    }
}
