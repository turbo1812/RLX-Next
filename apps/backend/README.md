# WMS Backend - Azure Functions

This is the backend service for the Warehouse Management System, built with Azure Functions using C# and .NET 8.

## Prerequisites

- .NET 8 SDK
- Azure Functions Core Tools v5
- Azure CLI (for deployment)

## Project Structure

```
backend/
├── Functions/
│   ├── InventoryFunction.cs
│   ├── OrdersFunction.cs
│   ├── FleetFunction.cs
│   └── WarehouseFunction.cs
├── Models/
│   ├── Inventory/
│   ├── Orders/
│   ├── Fleet/
│   └── Warehouse/
├── Services/
├── host.json
├── local.settings.json
└── WMS.Backend.csproj
```

## Setup

1. Install .NET 8 SDK
2. Install Azure Functions Core Tools: `npm install -g azure-functions-core-tools@5`
3. Run `dotnet restore`
4. Run `func start` to start locally

## API Endpoints

- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Create inventory item
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `GET /api/fleet` - Get fleet vehicles
- `POST /api/fleet` - Create fleet vehicle
- `GET /api/warehouse` - Get warehouse layout
- `POST /api/warehouse` - Update warehouse layout 

## Messaging Architecture: Azure Service Bus

This backend uses **Azure Service Bus** for asynchronous, decoupled messaging between services. When key events occur (e.g., a new order is created), a message is published to a Service Bus queue or topic. Other services can subscribe to these events for further processing (e.g., inventory reservation, notifications, audit logging).

### How it works
- When an order is created, the OrdersFunction publishes a `NewOrderCreated` message to the `orders` queue.
- The message includes event type, order ID, order number, customer name, total amount, and timestamp.
- You can extend this pattern for other events (e.g., InventoryReserved, FileUploaded) by calling `ServiceBusService.SendMessageAsync` from any function.

### Configuration
- Set your Service Bus connection string in `local.settings.json` under `ServiceBus:ConnectionString` or `AzureWebJobsServiceBus`.
- The default queue/topic can be set with `ServiceBus:DefaultQueueOrTopic` (defaults to `wms-events`).

### Example Event Message
```json
{
  "EventType": "NewOrderCreated",
  "OrderId": "...",
  "OrderNumber": "...",
  "CustomerName": "...",
  "TotalAmount": 123.45,
  "CreatedAt": "2024-07-24T12:34:56Z"
}
```

### Extending Messaging
- To publish a new event, inject `ServiceBusService` into your function and call `SendMessageAsync` with your event payload.
- To consume events, create a new Azure Function with a Service Bus trigger. 