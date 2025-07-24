# Build and Deployment Tools

This directory contains scripts and tools for building, testing, and deploying the WMS application.

## Structure

```
tools/
├── build/                 # Build scripts
│   ├── build-frontend.sh
│   ├── build-backend.sh
│   └── build-all.sh
├── deploy/                # Deployment scripts
│   ├── deploy-frontend.sh
│   ├── deploy-backend.sh
│   └── deploy-all.sh
├── scripts/               # Utility scripts
│   ├── setup-dev.sh
│   ├── run-tests.sh
│   └── codegen.sh
└── ci/                    # CI/CD scripts
    ├── github-actions/
    └── azure-pipelines/
```

## Available Scripts

### Build Scripts
- `build-frontend.sh` - Build the Angular frontend
- `build-backend.sh` - Build the Azure Functions backend
- `build-all.sh` - Build both frontend and backend

### Deployment Scripts
- `deploy-frontend.sh` - Deploy to Azure Static Web Apps
- `deploy-backend.sh` - Deploy to Azure Functions
- `deploy-all.sh` - Deploy both applications

### Development Scripts
- `setup-dev.sh` - Set up development environment
- `run-tests.sh` - Run all tests
- `codegen.sh` - Generate code from OpenAPI specs

## Usage

Run scripts from the project root:

```bash
# Build everything
./tools/build/build-all.sh

# Deploy to staging
./tools/deploy/deploy-all.sh

# Run tests
./tools/scripts/run-tests.sh
``` 