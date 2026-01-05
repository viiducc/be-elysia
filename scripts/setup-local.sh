#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Agripos Backend - Local Setup ===${NC}"
echo ""

# Step 1: Choose connection method
echo -e "${YELLOW}Step 1: Choose database connection method${NC}"
echo "1) Local PostgreSQL (direct connection)"
echo "2) Docker Compose"
read -p "Enter choice [1/2]: " CONNECTION_CHOICE

# Step 2: Check .env.local file
ENV_FILE=".env.local"
ENV_EXAMPLE=".env.example"

echo ""
echo -e "${YELLOW}Step 2: Environment file${NC}"

if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✓ $ENV_FILE already exists${NC}"
else
    echo -e "${RED}✗ $ENV_FILE not found${NC}"
    read -p "Create $ENV_FILE from $ENV_EXAMPLE? [y/n]: " CREATE_ENV
    
    if [ "$CREATE_ENV" = "y" ] || [ "$CREATE_ENV" = "Y" ]; then
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        echo -e "${GREEN}✓ Created $ENV_FILE${NC}"
    else
        echo -e "${RED}Aborted. Please create $ENV_FILE manually.${NC}"
        exit 1
    fi
fi

# Load env values
source "$ENV_FILE" 2>/dev/null || {
    # Fallback: Read from .env.example
    source "$ENV_EXAMPLE"
}

# Step 3: Confirm DB values
echo ""
echo -e "${YELLOW}Step 3: Database configuration${NC}"
echo "┌──────────────────────────────────────┐"
echo "│ DB_HOST:     ${DB_HOST:-localhost}"
echo "│ DB_PORT:     ${DB_PORT:-5432}"
echo "│ DB_NAME:     ${DB_NAME:-agripos}"
echo "│ DB_USERNAME: ${DB_USERNAME:-agripos}"
echo "│ DB_PASSWORD: ${DB_PASSWORD:-***}"
echo "└──────────────────────────────────────┘"

read -p "Proceed with these values? [y/n]: " CONFIRM_DB

if [ "$CONFIRM_DB" != "y" ] && [ "$CONFIRM_DB" != "Y" ]; then
    echo -e "${RED}Aborted. Please update $ENV_FILE and re-run.${NC}"
    exit 1
fi

# Step 4: Run setup
echo ""
echo -e "${YELLOW}Step 4: Running setup...${NC}"

if [ "$CONNECTION_CHOICE" = "1" ]; then
    # Local PostgreSQL
    echo "Setting up local PostgreSQL..."
    
    # Create user with password using psql (connect to postgres db for admin)
    echo "Creating user: ${DB_USERNAME:-agripos}"
    psql -d postgres -c "CREATE USER ${DB_USERNAME:-agripos} WITH PASSWORD '${DB_PASSWORD:-WrvgIahtUX}' CREATEDB;" 2>/dev/null && echo -e "${GREEN}✓ User created${NC}" || echo -e "${YELLOW}! User may already exist${NC}"
    
    # Create database owned by user
    echo "Creating database: ${DB_NAME:-agripos}"
    psql -d postgres -c "CREATE DATABASE ${DB_NAME:-agripos} OWNER ${DB_USERNAME:-agripos};" 2>/dev/null && echo -e "${GREEN}✓ Database created${NC}" || echo -e "${YELLOW}! Database may already exist${NC}"
    
    # Grant privileges
    psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME:-agripos} TO ${DB_USERNAME:-agripos};" 2>/dev/null
    echo -e "${GREEN}✓ Privileges granted${NC}"
    
elif [ "$CONNECTION_CHOICE" = "2" ]; then
    # Docker Compose
    echo "Starting Docker Compose..."
    docker-compose -f docker-compose.db.yaml up -d
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Docker containers started${NC}"
    else
        echo -e "${RED}✗ Docker failed. Is Docker running?${NC}"
        exit 1
    fi
else
    echo -e "${RED}Invalid choice${NC}"
    exit 1
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
bun install

# Generate migrations
echo ""
echo "Generating database migrations..."
bun run db:generate

echo ""
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo "Start the server with:"
echo -e "  ${GREEN}bun run start${NC}"
echo ""
echo "Endpoints:"
echo "  Health:      http://localhost:${APP_PORT:-3000}/health"
echo "  Swagger:     http://localhost:${APP_PORT:-3000}/swagger"
echo "  Better Auth: http://localhost:${APP_PORT:-3000}/api/auth/*"
