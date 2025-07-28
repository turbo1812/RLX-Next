using System;

namespace WMS.Backend.Models
{
    public class FleetVehicle
    {
        public Guid Id { get; set; }
        public string VehicleNumber { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public DateTime? LastMaintenance { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 