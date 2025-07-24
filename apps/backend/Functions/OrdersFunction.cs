using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using WMS.Backend.Models;

namespace WMS.Backend.Functions;

public class OrdersFunction
{
    private readonly ILogger _logger;

    public OrdersFunction(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<OrdersFunction>();
    }

    [Function("GetOrders")]
    public HttpResponseData GetOrders([HttpTrigger(AuthorizationLevel.Function, "get", Route = "orders")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request to get orders.");

        // Mock data for now - in production this would come from a database
        var orders = new List<Order>
        {
            new Order
            {
                OrderNumber = "ORD-001",
                CustomerName = "John Doe",
                Status = OrderStatus.Processing,
                TotalAmount = 1299.98m,
                Items = new List<OrderItem>
                {
                    new OrderItem
                    {
                        ItemName = "Laptop Computer",
                        SKU = "LAP-001",
                        Quantity = 1,
                        UnitPrice = 999.99m,
                        TotalPrice = 999.99m
                    },
                    new OrderItem
                    {
                        ItemName = "Office Chair",
                        SKU = "CHAIR-001",
                        Quantity = 1,
                        UnitPrice = 299.99m,
                        TotalPrice = 299.99m
                    }
                }
            },
            new Order
            {
                OrderNumber = "ORD-002",
                CustomerName = "Jane Smith",
                Status = OrderStatus.Shipped,
                TotalAmount = 299.99m,
                Items = new List<OrderItem>
                {
                    new OrderItem
                    {
                        ItemName = "Office Chair",
                        SKU = "CHAIR-001",
                        Quantity = 1,
                        UnitPrice = 299.99m,
                        TotalPrice = 299.99m
                    }
                }
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(orders));

        return response;
    }

    [Function("GetOrder")]
    public HttpResponseData GetOrder([HttpTrigger(AuthorizationLevel.Function, "get", Route = "orders/{id}")] HttpRequestData req, string id)
    {
        _logger.LogInformation($"C# HTTP trigger function processed a request to get order {id}.");

        // Mock data - in production this would come from a database
        var order = new Order
        {
            Id = id,
            OrderNumber = "ORD-001",
            CustomerName = "John Doe",
            Status = OrderStatus.Processing,
            TotalAmount = 1299.98m,
            Items = new List<OrderItem>
            {
                new OrderItem
                {
                    ItemName = "Laptop Computer",
                    SKU = "LAP-001",
                    Quantity = 1,
                    UnitPrice = 999.99m,
                    TotalPrice = 999.99m
                }
            }
        };

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(order));

        return response;
    }

    [Function("CreateOrder")]
    public HttpResponseData CreateOrder([HttpTrigger(AuthorizationLevel.Function, "post", Route = "orders")] HttpRequestData req)
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
        order.Id = Guid.NewGuid().ToString();
        order.OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4)}";
        order.OrderDate = DateTime.UtcNow;
        order.CreatedAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;

        var response = req.CreateResponse(HttpStatusCode.Created);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.WriteString(JsonSerializer.Serialize(order));

        return response;
    }
} 