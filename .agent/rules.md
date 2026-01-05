# Elysia Backend Architecture Rules

## Stack
- **Runtime**: Bun
- **Framework**: Elysia
- **ORM**: Drizzle ORM with Postgres
- **Auth**: Better Auth with Drizzle adapter
- **Validation**: Zod

## Architecture Pattern: Clean Architecture

```
src/modules/{module}/
├── domain/           # Entities, value objects, Zod schemas
├── application/      # Use cases, services
├── infrastructure/   # Repositories, mappers, external services
└── interfaces/
    └── rest/         # Routes, controllers, request/response schemas
```

## Conventions

### Entity
```typescript
// src/modules/{module}/domain/{entity}.ts
import { z } from 'zod';
import { newShortId } from '@/src/shared/utils/string';

const entitySchema = z.object({
  id: z.string(),
  // ... fields
});

export class Entity implements z.infer<typeof entitySchema> {
  constructor(data: Partial<Entity>) {
    // Initialize with defaults
  }
  validate(): string | null { /* Zod validation */ }
}
```

### Repository
```typescript
// src/modules/{module}/infrastructure/{entity}.repository.ts
import { SqlRepository } from '@/src/infrastructure/sql-repository';

export class EntityRepository extends SqlRepository<Entity> {
  // Constructor: super(schemaName, schema, mapper)
  // Custom queries here
}
```

### Routes
```typescript
// src/modules/{module}/interfaces/rest/{module}.routes.ts
export const getModuleRoutes = (config: Config) => {
  return createBaseElysia(config)
    .use(authMiddleware) // if needed
    .get('/', handler, { /* schema */ })
    .post('/', handler, requestSchema);
};
```

### Request/Response Schemas
```typescript
// src/modules/{module}/interfaces/rest/{module}.in.ts
export const createEntityRequestSchema = {
  body: t.Object({ name: t.String() }),
  response: t.Object({ id: t.String() }),
};
```

## Better Auth Integration

### Mount Handler
```typescript
// In app.ts
.mount(auth.handler) // Mounts at /api/auth/*
```

### Protected Routes (Macro)
```typescript
const betterAuth = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) return status(401);
        return { user: session.user, session: session.session };
      },
    },
  });

// Usage
app.get('/protected', ({ user }) => user, { auth: true });
```

### Role-Based Access
```typescript
// Check roleLevel for authorization
if (user.roleLevel < 20) return status(403);
// Levels: 1=User, 20=Mod, 40=Admin, 80=Platform, 100=Super
```

## Database Schema

### User Table (Better Auth compatible)
- `id`, `name`, `email`, `emailVerified` - Better Auth required
- `username`, `phoneNumber` - Auth extensions  
- `roleLevel` - RBAC (integer, default 1)
- `isSuspended`, `suspensionReason`, `suspendedAt` - Security
- `createdAt`, `updatedAt`, `deletedAt` - Timestamps

### Session, Identity, Verification - Better Auth managed

## File Locations
- Config: `src/config/` or `config/`
- Shared utils: `src/shared/`
- DB schema: `infrastructure/sql/drizzle-migrate/schema.ts`
- Migrations: `infrastructure/sql/drizzle-migrate/migrations/`
