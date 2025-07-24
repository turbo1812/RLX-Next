using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using WMS.Backend.Models;

namespace WMS.Backend.Functions;

public class InventoryFunction
{
    private readonly ILogger _logger;

    public InventoryFunction(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<InventoryFunction>();
    }

    [Function("GetInventory")]
    public HttpResponseData GetInventory([HttpTrigger(AuthorizationLevel.Function, "get", Route = "inventory")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to get inventory.");

        // Mock data for now - in production this would come from a database
        var inventory = new List<InventoryItem>
        {
            new InventoryItem
            {
                Name = "Laptop Computer",
                Description = "High-performance laptop for office use",
                SKU = "LAP-001",
                Quantity = 50,
                Location = "A1-B2-C3",
                Category = "Electronics",
                UnitPrice = 999.99m
            },
            new InventoryItem
            {
                Name = "Office Chair",
                Description = "Ergonomic office chair with lumbar support",
                SKU = "CHAIR-001",
                Quantity = 25,
                Location = "D4-E5-F6",
                Category = "Furniture",
                UnitPrice = 299.99m
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(inventory));

        return response;
    }

    [Function("GetInventoryItem")]
    public HttpResponseData GetInventoryItem([HttpTrigger(AuthorizationLevel.Function, "get", Route = "inventory/{id}")] HttpRequestData req, string id)
    {
        _logger.LogInformation($"C# HTTP trigger function processed a request to get inventory item {id}.");

        // Mock data - in production this would come from a database
        var item = new InventoryItem
        {
            Id = id,
            Name = "Sample Item",
            Description = "This is a sample inventory item",
            SKU = "SAMPLE-001",
            Quantity = 100,
            Location = "A1-B2-C3",
            Category = "General",
            UnitPrice = 49.99m
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(item));

        return response;
    }

    [Function("CreateInventoryItem")]
    public HttpResponseData CreateInventoryItem([HttpTrigger(AuthorizationLevel.Function, "post", Route = "inventory")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to create inventory item.");

        string requestBody = new StreamReader(req.Body).ReadToEnd();
        var item = JsonSerializer.Deserialize<InventoryItem>(requestBody);

        if (item == null)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            errorResponse.WriteString("Invalid request body");
            return errorResponse;
        }

        // In production, this would save to a database
        item.Id = Guid.NewGuid().ToString();
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;

        var response = req.CreateResponse(HttpStatusCode.Created);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(item));

        return response;
    }
} 