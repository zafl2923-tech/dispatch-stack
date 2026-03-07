namespace Dispatch.Trucking.Domain.Enums;

public enum USMCACountry
{
    UnitedStates,
    Canada,
    Mexico
}

public enum USMCAComplianceStatus
{
    Compliant,
    NonCompliant,
    PendingReview,
    Exempt
}

public enum HoursOfServiceType
{
    Driving,
    OnDuty,
    OffDuty,
    SleeperBerth
}

public enum CrossBorderStatus
{
    Domestic,
    PreClearance,
    InTransit,
    CustomsHold,
    Cleared
}

public enum DriverLicenseType
{
    ClassA,
    ClassB,
    ClassC,
    CommercialLearnersPermit
}
