namespace DispatchStack.Api.Models.Entities
{
    public class Shipment
    {
        public Guid Id { get; set; }
        public string ShipmentNumber { get; set; } = string.Empty;
        
        // Driver and Truck
        public Guid DriverId { get; set; }
        public Driver Driver { get; set; } = null!;
        
        public Guid TruckId { get; set; }
        public Truck Truck { get; set; } = null!;
        
        // Companies involved
        public Guid ShippingCompanyId { get; set; }
        public Company ShippingCompany { get; set; } = null!;
        
        public Guid ReceivingCompanyId { get; set; }
        public Company ReceivingCompany { get; set; } = null!;
        
        // Cargo details - what companies can see
        public string CargoType { get; set; } = string.Empty;
        public decimal CargoWeight { get; set; } // in kg
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
        
        // GPS tracking - current location
        public double? CurrentLatitude { get; set; }
        public double? CurrentLongitude { get; set; }
        public DateTime? LastLocationUpdate { get; set; }
        
        // Status
        public string Status { get; set; } = string.Empty; // "Pending", "InTransit", "Delivered", "Cancelled"
        public DateTime? PickupTime { get; set; }
        public DateTime? EstimatedDeliveryTime { get; set; }
        public DateTime? ActualDeliveryTime { get; set; }
        
        // Metadata
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
