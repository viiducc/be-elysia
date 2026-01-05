# Agripos Backend

To install dependencies:

```bash
bun install
```

To start application:

```bash
bun run index.ts
# OR
bun run start
# OR
bun run start --watch
```

# Structure

The project follows Clean Architecture principles, organized into the following layers:

## Core Layers

### Domain Layer (`/domain`)
- Business entities and logic
- Domain interfaces/ports
- Value objects and aggregates
- Business rules and validation

### Application Layer (`/application`)
- Use cases/services
- Application interfaces
- Orchestration of domain objects
- Business workflows

## Interface/Infrastructure Layers

### Interface Layer (`/interfaces`)
- REST API controllers (`/rest`)
- GraphQL resolvers (if used)
- Middleware (`/middlewares`)
- Request/Response models
- Input validation
- Route definitions

### Infrastructure Layer (`/infrastructure`)
- Database implementations
- External service integrations
- Framework-specific code
- Technical concerns (logging, caching, etc)

## Configuration (`/config`)
- Environment configuration
- Application settings
- Infrastructure setup

## Shared (`/shared`)
- Common utilities
- Shared types/interfaces
- Constants

This layered architecture ensures:
- Clear separation of concerns
- Domain-driven design
- Framework/infrastructure independence
- Testability
- Maintainability

## Folder Structure Overview


```
agripos-backend/
│
├── package.json                 # Project configuration and dependencies
├── tsconfig.json               # TypeScript configuration
├── .env                        # Environment variables
├── index.ts               # Application entry point
├── app.ts                 # Main application setup
│
├── src/
│   │
│   ├── domain/               # Domain Layer
│   │   ├── entities/         # Business entities
│   │   ├── value-objects/    # Value objects
│   │   ├── events/          # Domain events
│   │   └── repositories/     # Repository interfaces
│   │
│   ├── application/         # Application Layer
│   │   ├── use-cases/       # Business use cases
│   │   ├── services/        # Application services
│   │   └── dtos/           # Data transfer objects
│   │
│   ├── interfaces/         # Interface Layer
│   │   ├── rest/          # REST API endpoints
│   │   │   ├── routes.ts  # Route definitions
│   │   │   ├── swagger.ts # Swagger/OpenAPI config
│   │   │   └── metrics.ts # Metrics endpoint
│   │   └── middlewares/   # HTTP middleware
│   │       ├── cors.ts
│   │       ├── error.ts
│   │       └── metrics.ts
│   │
│   ├── infrastructure/    # Infrastructure Layer
│   │   ├── database/     # Database implementations
│   │   ├── services/     # External service integrations
│   │   └── repositories/ # Repository implementations
│   │
│   ├── config/          # Configuration
│   │   ├── app.config.ts
│   │   ├── db.config.ts
│   │   ├── logger.config.ts
│   │   └── types.ts
│   │
│   └── shared/         # Shared utilities and types
│       ├── utils/
│       └── types/
│
└── tests/             # Test files matching src structure
    ├── domain/
    ├── application/
    ├── interfaces/
    └── infrastructure/

```

# be-elysia
