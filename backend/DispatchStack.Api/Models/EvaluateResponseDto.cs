namespace DispatchStack.Api.Models
{
    public class EvaluateResponseDto
    {
        public ComplianceStatusDto Compliance { get; set; }
        public RulesDto ActiveRules { get; set; }
    }
}
