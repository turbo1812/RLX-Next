# Shared Libraries

This directory contains shared code, types, and utilities used across the WMS application.

## Structure

```
libs/
├── shared-types/          # TypeScript interfaces and types
│   ├── inventory.ts
│   ├── orders.ts
│   ├── fleet.ts
│   └── warehouse.ts
├── shared-utils/          # Utility functions
│   ├── date-utils.ts
│   ├── validation.ts
│   └── api-helpers.ts
└── shared-constants/      # Application constants
    ├── api-endpoints.ts
    ├── status-codes.ts
    └── error-messages.ts
```

## Usage

These libraries are shared between:
- Frontend Angular application
- Backend Azure Functions (C# equivalents)
- Testing utilities
- Build scripts

## Development

When adding new shared types or utilities:
1. Create the appropriate file in the correct directory
2. Export the types/functions from an index file
3. Update the consuming applications to import from the shared library
4. Add tests for the shared functionality 