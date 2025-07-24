using System.ComponentModel.DataAnnotations;

namespace WMS.Backend.Models;

public class InventoryItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string SKU { get; set; } = string.Empty;
    
    public int Quantity { get; set; }
    
    public string Location { get; set; } = string.Empty;
    
    public string Category { get; set; } = string.Empty;
    
    public decimal UnitPrice { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
} 