namespace DispatchStack.Api.Models.Entities
{
    public class Truck
    {
        public Guid Id { get; set; }
        public string UnitNumber { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string VIN { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public string LicenseCountry { get; set; } = string.Empty;
        public string LicenseRegion { get; set; } = string.Empty;
        public double GrossVehicleWeight { get; set; }
        public double MaxLoadCapacity { get; set; }
        public string FuelType { get; set; } = string.Empty;
        public double FuelCapacity { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime LastMaintenanceDate { get; set; }
        public DateTime NextMaintenanceDue { get; set; }
        public int Odometer { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
