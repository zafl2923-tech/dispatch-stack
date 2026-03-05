namespace DispatchStack.Api.Models
{
    public class EvaluateRequestDto
    {
        public HosStateDto HosState { get; set; }
        public string OriginCountry { get; set; }
        public string CurrentCountry { get; set; }
    }
}
