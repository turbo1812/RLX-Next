using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace WMS.Backend.Functions;

public class WarehouseFunction
{
    private readonly ILogger _logger;

    public WarehouseFunction(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<WarehouseFunction>();
    }

    [Function("GetWarehouseLayout")]
    public HttpResponseData GetWarehouseLayout([HttpTrigger(AuthorizationLevel.Function, "get", Route = "warehouse")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to get warehouse layout.");

        // Mock data for now - in production this would come from a database
        var warehouseLayout = new
        {
            id = "warehouse-001",
            name = "Main Warehouse",
            description = "Primary warehouse facility",
            width = 100.0,
            height = 80.0,
            zones = new[]
            {
                new
                {
                    id = "zone-001",
                    name = "Receiving Zone",
                    type = "Receiving",
                    x = 0.0,
                    y = 0.0,
                    width = 20.0,
                    height = 40.0,
                    capacity = 1000,
                    currentUtilization = 750
                },
                new
                {
                    id = "zone-002",
                    name = "Storage Zone A",
                    type = "Storage",
                    x = 25.0,
                    y = 0.0,
                    width = 30.0,
                    height = 40.0,
                    capacity = 2000,
                    currentUtilization = 1200
                },
                new
                {
                    id = "zone-003",
                    name = "Shipping Zone",
                    type = "Shipping",
                    x = 60.0,
                    y = 0.0,
                    width = 20.0,
                    height = 40.0,
                    capacity = 800,
                    currentUtilization = 300
                }
            },
            aisles = new[]
            {
                new
                {
                    id = "aisle-001",
                    name = "Main Aisle",
                    type = "Main",
                    startX = 20.0,
                    startY = 0.0,
                    endX = 20.0,
                    endY = 40.0,
                    width = 5.0
                },
                new
                {
                    id = "aisle-002",
                    name = "Cross Aisle",
                    type = "Cross",
                    startX = 0.0,
                    startY = 40.0,
                    endX = 80.0,
                    endY = 40.0,
                    width = 3.0
                }
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(warehouseLayout));

        return response;
    }

    [Function("UpdateWarehouseLayout")]
    public HttpResponseData UpdateWarehouseLayout([HttpTrigger(AuthorizationLevel.Function, "post", Route = "warehouse")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to update warehouse layout.");

        string requestBody = new StreamReader(req.Body).ReadToEnd();
        
        // In production, this would validate and save to a database
        var layout = JsonSerializer.Deserialize<object>(requestBody);

        if (layout == null)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            errorResponse.WriteString("Invalid request body");
            return errorResponse;
        }

        // Mock successful update
        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(new { message = "Warehouse layout updated successfully" }));

        return response;
    }

    [Function("GetWarehouseZone")]
    public HttpResponseData GetWarehouseZone([HttpTrigger(AuthorizationLevel.Function, "get", Route = "warehouse/zone/{id}")] HttpRequestData req, string id)
    {
        _logger.LogInformation($"C# HTTP trigger function processed a request to get warehouse zone {id}.");

        // Mock data - in production this would come from a database
        var zone = new
        {
            id = id,
            name = "Storage Zone A",
            type = "Storage",
            x = 25.0,
            y = 0.0,
            width = 30.0,
            height = 40.0,
            capacity = 2000,
            currentUtilization = 1200,
            storageLocations = new[]
            {
                new
                {
                    id = "loc-001",
                    name = "A1-B1-C1",
                    type = "Pallet",
                    x = 26.0,
                    y = 1.0,
                    width = 2.0,
                    height = 2.0,
                    isOccupied = true,
                    currentItem = "LAP-001"
                },
                new
                {
                    id = "loc-002",
                    name = "A1-B1-C2",
                    type = "Pallet",
                    x = 29.0,
                    y = 1.0,
                    width = 2.0,
                    height = 2.0,
                    isOccupied = false,
                    currentItem = ""
                }
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(zone));

        return response;
    }
} 