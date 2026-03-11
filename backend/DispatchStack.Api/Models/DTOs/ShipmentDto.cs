namespace DispatchStack.Api.Models.DTOs
{
    public class ShipmentDto
    {
        public Guid Id { get; set; }
        public string ShipmentNumber { get; set; } = string.Empty;
        
        // Driver and Truck info
        public Guid DriverId { get; set; }
        public string DriverName { get; set; } = string.Empty;
        
        public Guid TruckId { get; set; }
        public string TruckUnitNumber { get; set; } = string.Empty;
        
        // Companies
        public Guid ShippingCompanyId { get; set; }
        public string ShippingCompanyName { get; set; } = string.Empty;
        
        public Guid ReceivingCompanyId { get; set; }
        public string ReceivingCompanyName { get; set; } = string.Empty;
        
        // Cargo details
        public string CargoType { get; set; } = string.Empty;
        public decimal CargoWeight { get; set; }
        public string CargoDescription { get; set; } = string.Empty;
        
        // Journey details
        public string OriginAddress { get; set; } = string.Empty;
        public string OriginCity { get; set; } = string.Empty;
        public string OriginRegion { get; set; } = string.Empty;
        public string OriginCountry { get; set; } = string.Empty;
        
        public string DestinationAddress { get; set; } = string.Empty;
        public string DestinationCity { get; set; } = string.Empty;
        public string DestinationRegion { get; set; } = string.Empty;
        public string DestinationCountry { get; set; } = string.Empty;
        
        // GPS tracking
        public double? CurrentLatitude { get; set; }
        public double? CurrentLongitude { get; set; }
        public DateTime? LastLocationUpdate { get; set; }
        
        // Status
        public string Status { get; set; } = string.Empty;
        public DateTime? PickupTime { get; set; }
        public DateTime? EstimatedDeliveryTime { get; set; }
        public DateTime? ActualDeliveryTime { get; set; }
    }

    public class CreateShipmentDto
    {
        public string ShipmentNumber { get; set; } = string.Empty;
        public Guid DriverId { get; set; }
        public Guid TruckId { get; set; }
        public Guid ShippingCompanyId { get; set; }
        public Guid ReceivingCompanyId { get; set; }
        
        public string CargoType { get; set; } = string.Empty;
        public decimal CargoWeight { get; set; }
        public string CargoDescription { get; set; } = string.Empty;
        
        public string OriginAddress { get; set; } = string.Empty;
        public string OriginCity { get; set; } = string.Empty;
        public string OriginRegion { get; set; } = string.Empty;
        public string OriginCountry { get; set; } = string.Empty;
        
        public string DestinationAddress { get; set; } = string.Empty;
        public string DestinationCity { get; set; } = string.Empty;
        public string DestinationRegion { get; set; } = string.Empty;
        public string DestinationCountry { get; set; } = string.Empty;
        
        public DateTime? PickupTime { get; set; }
        public DateTime? EstimatedDeliveryTime { get; set; }
    }

    public class UpdateShipmentLocationDto
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
