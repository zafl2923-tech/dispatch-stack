namespace DispatchStack.Api.Models
{
    public class HosStateDto
    {
        public double DrivingTime { get; set; }
        public double OnDutyTime { get; set; }
        public double OffDutyTime { get; set; }
        public double ConsecutiveOffDutyTime { get; set; }
        public double LastBreakTime { get; set; }
        public double LastRestartTime { get; set; }
        public string CurrentActivity { get; set; }
        public double CycleTime { get; set; }
    }
}
