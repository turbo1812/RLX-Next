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

    [Function("GetFleet")]
    public HttpResponseData GetFleet([HttpTrigger(AuthorizationLevel.Function, "get", Route = "fleet")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to get fleet.");

        // Mock data for now - in production this would come from a database
        var fleet = new List<FleetVehicle>
        {
            new FleetVehicle
            {
                VehicleNumber = "TRK-001",
                Make = "Ford",
                Model = "F-150",
                Year = "2023",
                LicensePlate = "ABC-123",
                Type = VehicleType.Truck,
                Status = VehicleStatus.Available,
                Capacity = 1000.0m,
                CurrentLocation = "Warehouse A",
                LastMaintenance = DateTime.UtcNow.AddDays(-30),
                NextMaintenance = DateTime.UtcNow.AddDays(30)
            },
            new FleetVehicle
            {
                VehicleNumber = "VAN-001",
                Make = "Mercedes",
                Model = "Sprinter",
                Year = "2022",
                LicensePlate = "XYZ-789",
                Type = VehicleType.Van,
                Status = VehicleStatus.InUse,
                DriverName = "John Driver",
                Capacity = 500.0m,
                CurrentLocation = "On Route",
                LastMaintenance = DateTime.UtcNow.AddDays(-15),
                NextMaintenance = DateTime.UtcNow.AddDays(45)
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(fleet));

        return response;
    }

    [Function("GetFleetVehicle")]
    public HttpResponseData GetFleetVehicle([HttpTrigger(AuthorizationLevel.Function, "get", Route = "fleet/{id}")] HttpRequestData req, string id)
    {
        _logger.LogInformation($"C# HTTP trigger function processed a request to get fleet vehicle {id}.");

        // Mock data - in production this would come from a database
        var vehicle = new FleetVehicle
        {
            Id = id,
            VehicleNumber = "TRK-001",
            Make = "Ford",
            Model = "F-150",
            Year = "2023",
            LicensePlate = "ABC-123",
            Type = VehicleType.Truck,
            Status = VehicleStatus.Available,
            Capacity = 1000.0m,
            CurrentLocation = "Warehouse A",
            LastMaintenance = DateTime.UtcNow.AddDays(-30),
            NextMaintenance = DateTime.UtcNow.AddDays(30)
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(vehicle));

        return response;
    }

    [Function("CreateFleetVehicle")]
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
        vehicle.Id = Guid.NewGuid().ToString();
        vehicle.CreatedAt = DateTime.UtcNow;
        vehicle.UpdatedAt = DateTime.UtcNow;

        var response = req.CreateResponse(HttpStatusCode.Created);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(vehicle));

        return response;
    }
} 