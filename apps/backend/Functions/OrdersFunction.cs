using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using WMS.Backend.Models;
using WMS.Backend.Services;

namespace WMS.Backend.Functions;

public class OrdersFunction
{
    private readonly ILogger _logger;
    private readonly ServiceBusService _serviceBusService;

    public OrdersFunction(ILoggerFactory loggerFactory, ServiceBusService serviceBusService)
    {
        _logger = loggerFactory.CreateLogger<OrdersFunction>();
        _serviceBusService = serviceBusService;
    }

    [Function("Orders_GetAll")]
    public HttpResponseData GetOrders([HttpTrigger(AuthorizationLevel.Function, "get", Route = "orders")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to get orders.");

        // Mock data for now - in production this would come from a database
        var orders = new List<Order>
        {
            new Order
            {
                Id = Guid.NewGuid(),
                CustomerName = "John Doe",
                ShippingAddress = "123 Main St",
                Priority = "High",
                Status = "Processing",
                TotalAmount = 1299.98m,
                OrderItems = new List<OrderItem>
                {
                    new OrderItem
                    {
                        Id = Guid.NewGuid(),
                        OrderId = Guid.NewGuid(),
                        InventoryItemId = Guid.NewGuid(),
                        Quantity = 1
                    },
                    new OrderItem
                    {
                        Id = Guid.NewGuid(),
                        OrderId = Guid.NewGuid(),
                        InventoryItemId = Guid.NewGuid(),
                        Quantity = 1
                    }
                }
            },
            new Order
            {
                Id = Guid.NewGuid(),
                CustomerName = "Jane Smith",
                ShippingAddress = "456 Oak Ave",
                Priority = "Medium",
                Status = "Shipped",
                TotalAmount = 299.99m,
                OrderItems = new List<OrderItem>
                {
                    new OrderItem
                    {
                        Id = Guid.NewGuid(),
                        OrderId = Guid.NewGuid(),
                        InventoryItemId = Guid.NewGuid(),
                        Quantity = 1
                    }
                }
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(orders));

        return response;
    }

    [Function("Orders_GetById")]
    public HttpResponseData GetOrder([HttpTrigger(AuthorizationLevel.Function, "get", Route = "orders/{id}")] HttpRequestData req, string id)
    {
        _logger.LogInformation($"C# HTTP trigger function processed a request to get order {id}.");

        // Mock data - in production this would come from a database
        var order = new Order
        {
            Id = Guid.TryParse(id, out var guid) ? guid : Guid.NewGuid(),
            CustomerName = "John Doe",
            ShippingAddress = "123 Main St",
            Priority = "High",
            Status = "Processing",
            TotalAmount = 1299.98m,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = Guid.NewGuid(),
                    InventoryItemId = Guid.NewGuid(),
                    Quantity = 1
                }
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(order));

        return response;
    }

    [Function("Orders_Create")]
    public async Task<HttpResponseData> CreateOrder([HttpTrigger(AuthorizationLevel.Function, "post", Route = "orders")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to create order.");

        string requestBody = new StreamReader(req.Body).ReadToEnd();
        var order = JsonSerializer.Deserialize<Order>(requestBody);

        if (order == null)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            errorResponse.WriteString("Invalid request body");
            return errorResponse;
        }

        // In production, this would save to a database
        order.Id = Guid.NewGuid();

        // Publish NewOrderCreated message to Service Bus
        var message = JsonSerializer.Serialize(new {
            EventType = "NewOrderCreated",
            OrderId = order.Id,
            CustomerName = order.CustomerName,
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt
        });
        await _serviceBusService.SendMessageAsync(message, "orders");

        var response = req.CreateResponse(HttpStatusCode.Created);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(order));

        return response;
    }
} 