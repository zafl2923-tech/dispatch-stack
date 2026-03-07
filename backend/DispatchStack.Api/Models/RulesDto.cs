namespace DispatchStack.Api.Models
{
    public class RulesDto
    {
        public string Country { get; set; }
        public double MaxDrivingMinutes { get; set; }
        public double MaxOnDutyMinutes { get; set; }
        public double? BreakThresholdMinutes { get; set; }
        public double? BreakLengthMinutes { get; set; }
        public double CycleMinutes { get; set; }
        public double DailyRestMinutes { get; set; }
    }
}
