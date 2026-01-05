---
description: Setup local development environment
---

Run the interactive setup script:
```bash
./scripts/setup-local.sh
```

The script will:
1. Ask for connection method (Local PostgreSQL or Docker)
2. Check/create `.env.local` file
3. Confirm database values from env
4. Auto-create database and run setup
