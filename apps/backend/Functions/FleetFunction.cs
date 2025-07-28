using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using WMS.Backend.Models;

namespace WMS.Backend.Functions;

public class FleetFunction
{
    private readonly ILogger _logger;

    public FleetFunction(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<FleetFunction>();
    }

    [Function("Fleet_GetAll")]
    public HttpResponseData GetFleet([HttpTrigger(AuthorizationLevel.Function, "get", Route = "fleet")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to get fleet.");

        // Mock data for now - in production this would come from a database
        var fleet = new List<FleetVehicle>
        {
            new FleetVehicle
            {
                Id = Guid.NewGuid(),
                VehicleNumber = "TRK-001"
            },
            new FleetVehicle
            {
                Id = Guid.NewGuid(),
                VehicleNumber = "VAN-001"
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(fleet));

        return response;
    }

    [Function("Fleet_GetById")]
    public HttpResponseData GetFleetVehicle([HttpTrigger(AuthorizationLevel.Function, "get", Route = "fleet/{id}")] HttpRequestData req, string id)
    {
        _logger.LogInformation($"C# HTTP trigger function processed a request to get fleet vehicle {id}.");

        // Mock data - in production this would come from a database
        var vehicle = new FleetVehicle
        {
            Id = Guid.TryParse(id, out var guid) ? guid : Guid.NewGuid(),
            VehicleNumber = "TRK-001"
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(vehicle));

        return response;
    }

    [Function("Fleet_Create")]
    public HttpResponseData CreateFleetVehicle([HttpTrigger(AuthorizationLevel.Function, "post", Route = "fleet")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to create fleet vehicle.");

        string requestBody = new StreamReader(req.Body).ReadToEnd();
        var vehicle = JsonSerializer.Deserialize<FleetVehicle>(requestBody);

        if (vehicle == null)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            errorResponse.WriteString("Invalid request body");
            return errorResponse;
        }

        // In production, this would save to a database
        vehicle.Id = Guid.NewGuid();

        var response = req.CreateResponse(HttpStatusCode.Created);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(vehicle));

        return response;
    }
} 