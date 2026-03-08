namespace DispatchStack.Api.Models.DTOs
{
    public class EvaluateResponseDto
    {
        public ComplianceStatusDto Compliance { get; set; }
        public RulesDto ActiveRules { get; set; }
    }
}
