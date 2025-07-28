using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace WMS.Backend.Functions;

public class ServicesFunction
{
    private readonly ILogger _logger;

    public ServicesFunction(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<ServicesFunction>();
    }

    [Function("Services_Status")]
    public HttpResponseData GetServicesStatus([HttpTrigger(AuthorizationLevel.Function, "get", Route = "services/status")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to get services status.");

        // Mocked service status data
        var services = new[]
        {
            new {
                name = "Inventory",
                status = "Healthy",
                version = "1.0.0",
                lastHeartbeat = System.DateTime.UtcNow,
                endpoint = "/api/inventory",
                errors = new string[0]
            },
            new {
                name = "Orders",
                status = "Healthy",
                version = "1.0.0",
                lastHeartbeat = System.DateTime.UtcNow,
                endpoint = "/api/orders",
                errors = new string[0]
            },
            new {
                name = "Fleet",
                status = "Healthy",
                version = "1.0.0",
                lastHeartbeat = System.DateTime.UtcNow,
                endpoint = "/api/fleet",
                errors = new string[0]
            },
            new {
                name = "Warehouse",
                status = "Healthy",
                version = "1.0.0",
                lastHeartbeat = System.DateTime.UtcNow,
                endpoint = "/api/warehouse",
                errors = new string[0]
            },
            new {
                name = "Messaging",
                status = "Healthy",
                version = "1.0.0",
                lastHeartbeat = System.DateTime.UtcNow,
                endpoint = "Azure Service Bus",
                errors = new string[0]
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(services));

        return response;
    }
} 