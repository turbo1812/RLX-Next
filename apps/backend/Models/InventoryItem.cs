using System;

namespace WMS.Backend.Models
{
    public class InventoryItem
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string SKU { get; set; }
        public int Quantity { get; set; }
        public string Location { get; set; }
        public int? CategoryId { get; set; }
        public int? SupplierId { get; set; }
        public decimal Cost { get; set; }
        public int MinStockLevel { get; set; }
        public int MaxStockLevel { get; set; }
        public DateTime LastUpdated { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 