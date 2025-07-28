# Warehouse Management System (WMS)

A modern, scalable warehouse management solution built with Angular 18 + PrimeNG 18 on the frontend and C# /.NET Azure Functions on the backend.

## 🎯 Overview

This system provides end‑to‑end warehouse operations:

- **Inventory & Orders**: real‑time stock tracking, multi‑channel order processing
- **Fleet & Routing**: interactive route planning, driver assignment, GPS integration
- **Warehouse Layout**: CAD/DXF/DWG import, visual layout designer
- **Analytics & BI**: dashboards, trend reports, KPI alerts

## 🏗️ Architecture

- **Monorepo** structure for shared types & scripts
- **Frontend**: Angular 18 + PrimeNG 18, TypeScript, RxJS
- **Backend**: Azure Functions (C# /.NET 9), HTTP‑triggered REST endpoints
- **Database**: Azure SQL Database (or PostgreSQL), Entity Framework Core
- **Messaging**: Azure Service Bus for async workflows
- **Storage**: Azure Blob Storage for CAD & images
- **Infra as Code**: ARM templates or Terraform

## ⚙️ Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Frontend   | Angular 18, PrimeNG 18, TypeScript, RxJS            |
| Backend    | Azure Functions (C# /.NET 9), Entity Framework Core |
| Database   | Azure SQL Database (or PostgreSQL), EF Core         |
| Messaging  | Azure Service Bus                                   |
| Storage    | Azure Blob Storage                                  |
| CI/CD      | GitHub Actions → Azure DevOps Pipelines             |
| Monitoring | Azure Application Insights, Azure Monitor           |

## 📁 Project Structure

```
wms/
├── apps/
│   ├── frontend/         # Angular 18 application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── inventory/
│   │   │   │   ├── orders/
│   │   │   │   ├── fleet/
│   │   │   │   ├── warehouse-setup/
│   │   │   │   └── shared/
│   │   │   ├── assets/
│   │   │   ├── environments/
│   │   │   └── styles/
│   │   ├── angular.json
│   │   └── tsconfig.json
│   └── backend/          # Azure Functions in C#
│       ├── Functions/
│       │   ├── InventoryFunction.cs
│       │   ├── OrdersFunction.cs
│       │   ├── FleetFunction.cs
│       │   └── WarehouseFunction.cs
│       ├── host.json
│       └── local.settings.json
├── libs/                 # Shared TypeScript & C# DTOs, schemas
│   ├── shared-types/
│   ├── shared-utils/
│   └── shared-constants/
├── tools/                # Scripts: build, deploy, codegen
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ & npm 10+
- **Angular CLI** 18+
- **.NET 9 SDK**
- **Azure Functions Core Tools** v5

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wms
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd apps/frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   dotnet restore
   ```

4. **Start Development Servers**

   **Frontend:**
   ```bash
   cd apps/frontend
   ng serve --open
   ```
   - Dev URL: `http://localhost:4200`

   **Backend:**
   ```bash
   cd apps/backend
   func start
   ```
   - Local URL: `http://localhost:7071`

## 🛠️ Development

### Frontend Development

```bash
cd apps/frontend

# Start development server
ng serve

# Build for production
ng build --prod

# Run tests
ng test

# Run linting
ng lint
```

### Backend Development

```bash
cd apps/backend

# Start Azure Functions
func start

# Build project
dotnet build

# Run tests
dotnet test

# Add new function
func new
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Get all inventory items |
| GET | `/api/inventory/{id}` | Get specific inventory item |
| POST | `/api/inventory` | Create new inventory item |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/{id}` | Get specific order |
| POST | `/api/orders` | Create new order |
| GET | `/api/fleet` | Get all fleet vehicles |
| GET | `/api/fleet/{id}` | Get specific fleet vehicle |
| POST | `/api/fleet` | Create new fleet vehicle |
| GET | `/api/warehouse` | Get warehouse layout |
| POST | `/api/warehouse` | Update warehouse layout |
| GET | `/api/warehouse/zone/{id}` | Get specific warehouse zone |

## 🗄️ Database

- **Azure SQL Database** (or PostgreSQL)
- **EF Core Migrations**
  ```bash
  cd apps/backend
  dotnet ef migrations add InitialCreate
  dotnet ef database update
  ```

## 🔍 Messaging & Storage

- **Messaging**: Azure Service Bus queues/topics
- **Storage**: Azure Blob Storage for CAD and image files

## 🚨 Testing

- **Frontend**: Karma/Jasmine (unit), Cypress (E2E)
  ```bash
  ng test
  npm run e2e
  ```
- **Backend**: xUnit, Moq
  ```bash
  dotnet test
  ```

## 🚀 Deployment & CI/CD

- **CI**: GitHub Actions builds & tests each PR
- **CD**: Azure DevOps Pipelines deploy frontend to Static Web Apps and backend to Functions
- **Infra**: ARM or Terraform scripts

## 📝 Git Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches
- `hotfix/*` - Critical bug fixes

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit following convention
3. Push branch and create Pull Request
4. Request code review
5. Merge to `develop` after approval
6. Merge `develop` to `main` for releases

## 🤝 Contributing

### Development Process

We follow a **documentation-driven development** approach to ensure code and documentation stay in sync:

1. **Fork & clone** the repository
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Update documentation first**:
   - Update `FEATURE_MATRIX.md` with new feature
   - Update `README.md` if needed
   - Create technical debt items if shortcuts are needed
4. **Implement the feature**
5. **Run tests** and ensure they pass
6. **Follow PR checklist** in `PR_CHECKLIST.md`
7. **Commit changes** following conventional commits
8. **Push to branch** and open a Pull Request

### Quality Gates

- ✅ **Feature Matrix Updated** - All features tracked
- ✅ **Technical Debt Logged** - No hidden shortcuts
- ✅ **Documentation Updated** - README reflects reality
- ✅ **Tests Added** - Code is testable
- ✅ **Code Review Completed** - Peer review mandatory

### Documentation Standards

- **Living Documentation**: All docs are version-controlled
- **Feature Traceability**: Every feature mapped in `FEATURE_MATRIX.md`
- **Technical Debt Visibility**: All debt tracked in `TECHNICAL_DEBT.md`
- **Process Enforcement**: `PR_CHECKLIST.md` ensures quality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## 🔄 Version History

- **v1.0.0** - Initial release with basic WMS functionality
- **v1.1.0** - Added routing and enhanced UI components
- **v1.2.0** - Implemented Azure Functions backend
- **v1.3.0** - Added shared libraries and utilities

---

**Built with ❤️ by the WMS Development Team** 