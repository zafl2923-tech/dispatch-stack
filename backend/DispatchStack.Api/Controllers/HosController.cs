using Microsoft.AspNetCore.Mvc;
using DispatchStack.Api.Models;

namespace DispatchStack.Api.Controllers
{
    [ApiController]
    [Route("api/hos")]
    public class HosController : ControllerBase
    {
        private static readonly Dictionary<string, RulesDto> _rules = new()
        {
            ["United States"] = new RulesDto { Country = "United States", MaxDrivingMinutes = 11*60, MaxOnDutyMinutes = 14*60, BreakThresholdMinutes = 8*60, BreakLengthMinutes = 30, CycleMinutes = 70*60, DailyRestMinutes = 10*60 },
            ["Canada"] = new RulesDto { Country = "Canada", MaxDrivingMinutes = 13*60, MaxOnDutyMinutes = 14*60, BreakThresholdMinutes = null, BreakLengthMinutes = null, CycleMinutes = 70*60, DailyRestMinutes = 10*60 },
            ["Mexico"] = new RulesDto { Country = "Mexico", MaxDrivingMinutes = 14*60, MaxOnDutyMinutes = 14*60, BreakThresholdMinutes = 5*60, BreakLengthMinutes = 30, CycleMinutes = 70*60, DailyRestMinutes = 8*60 }
        };

        [HttpGet("rules/{country}")]
        public ActionResult<RulesDto> GetRules(string country)
        {
            if (_rules.TryGetValue(country, out var r)) return Ok(r);
            return NotFound();
        }

        [HttpPost("evaluate")]
        public ActionResult<EvaluateResponseDto> Evaluate([FromBody] EvaluateRequestDto req)
        {
            var country = req.CurrentCountry ?? req.OriginCountry ?? "United States";
            var rules = _rules.ContainsKey(country) ? _rules[country] : _rules["United States"];

            ComplianceStatusDto compliance = new ComplianceStatusDto();

            string GetStatus(double current, double? limit)
            {
                if (limit == null) return "compliant";
                var lim = limit.Value;
                if (current >= lim) return "violation";
                if (current >= lim * 0.9) return "warning";
                return "compliant";
            }

            compliance.ElevenHourRule = GetStatus(req.HosState.DrivingTime, rules.MaxDrivingMinutes);
            compliance.FourteenHourRule = GetStatus(req.HosState.OnDutyTime, rules.MaxOnDutyMinutes);
            var sinceLastBreak = req.HosState.DrivingTime - req.HosState.LastBreakTime;
            compliance.ThirtyMinuteBreak = GetStatus(sinceLastBreak, rules.BreakThresholdMinutes);
            compliance.SeventyHourRule = GetStatus(req.HosState.CycleTime, rules.CycleMinutes);
            compliance.JourneyCompliance = "compliant";

            var resp = new EvaluateResponseDto { Compliance = compliance, ActiveRules = rules };
            return Ok(resp);
        }
    }
}
