using System.ComponentModel.DataAnnotations;

namespace WMS.Backend.Models;

public class Order
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string OrderNumber { get; set; } = string.Empty;
    
    public string CustomerId { get; set; } = string.Empty;
    
    public string CustomerName { get; set; } = string.Empty;
    
    public List<OrderItem> Items { get; set; } = new();
    
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    public DateTime? ShippedDate { get; set; }
    
    public DateTime? DeliveredDate { get; set; }
    
    public decimal TotalAmount { get; set; }
    
    public string ShippingAddress { get; set; } = string.Empty;
    
    public string Notes { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class OrderItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public string InventoryItemId { get; set; } = string.Empty;
    
    public string ItemName { get; set; } = string.Empty;
    
    public string SKU { get; set; } = string.Empty;
    
    public int Quantity { get; set; }
    
    public decimal UnitPrice { get; set; }
    
    public decimal TotalPrice { get; set; }
}

public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled
} 