using System;

namespace WMS.Backend.Models
{
    public class Warehouse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Layout { get; set; } // JSON or string representation
        public DateTime CreatedAt { get; set; }
    }
} 