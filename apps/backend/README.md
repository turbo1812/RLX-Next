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