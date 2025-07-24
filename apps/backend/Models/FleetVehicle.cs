using System.ComponentModel.DataAnnotations;

namespace WMS.Backend.Models;

public class FleetVehicle
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    [StringLength(20)]
    public string VehicleNumber { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string Make { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string Model { get; set; } = string.Empty;
    
    [Required]
    [StringLength(10)]
    public string Year { get; set; } = string.Empty;
    
    [StringLength(20)]
    public string LicensePlate { get; set; } = string.Empty;
    
    public VehicleType Type { get; set; }
    
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    
    public string DriverId { get; set; } = string.Empty;
    
    public string DriverName { get; set; } = string.Empty;
    
    public decimal Capacity { get; set; } // in cubic meters or weight
    
    public string CurrentLocation { get; set; } = string.Empty;
    
    public DateTime LastMaintenance { get; set; }
    
    public DateTime NextMaintenance { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum VehicleType
{
    Truck,
    Van,
    Car,
    Forklift,
    Trailer
}

public enum VehicleStatus
{
    Available,
    InUse,
    Maintenance,
    OutOfService
} 