#!/usr/bin/env bash

# Jewellery ERP Setup Verification Script

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  Jewellery ERP - Setup Verification                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECK="✓"
CROSS="✗"

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}${CHECK} $NODE_VERSION${NC}"
else
    echo -e "${RED}${CROSS} Node.js not found${NC}"
    exit 1
fi

# Check pnpm
echo -n "Checking pnpm... "
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}${CHECK} $PNPM_VERSION${NC}"
else
    echo -e "${RED}${CROSS} pnpm not found${NC}"
    exit 1
fi

# Check directory structure
echo ""
echo "Checking directory structure:"
DIRS=(
    "apps/api"
    "apps/web"
    "packages/database"
    "packages/shared"
    "packages/config"
    "packages/events"
    "packages/validation"
    "packages/workflows"
)

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "  ${GREEN}${CHECK}${NC} $dir"
    else
        echo -e "  ${RED}${CROSS}${NC} $dir"
    fi
done

# Check key files
echo ""
echo "Checking key files:"
FILES=(
    "package.json"
    "pnpm-workspace.yaml"
    "tsconfig.json"
    "turbo.json"
    ".env.example"
    "apps/api/package.json"
    "apps/web/package.json"
    "packages/database/package.json"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}${CHECK}${NC} $file"
    else
        echo -e "  ${RED}${CROSS}${NC} $file"
    fi
done

# Check node_modules
echo ""
if [ -d "node_modules" ]; then
    echo -e "Dependencies: ${GREEN}${CHECK} Installed${NC}"
else
    echo -e "Dependencies: ${YELLOW}⚠ Not installed${NC}"
    echo ""
    echo "Run: pnpm install"
fi

# Check .env.local
echo ""
if [ -f ".env.local" ]; then
    echo -e "Environment: ${GREEN}${CHECK} .env.local exists${NC}"
else
    echo -e "Environment: ${YELLOW}⚠ .env.local not found${NC}"
    echo ""
    echo "Run: cp .env.example .env.local"
    echo "Then edit .env.local with your settings"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  Next Steps                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Install dependencies:"
echo "   pnpm install"
echo ""
echo "2. Setup environment:"
echo "   cp .env.example .env.local"
echo "   # Edit .env.local with your database URL and settings"
echo ""
echo "3. Setup database:"
echo "   pnpm db:migrate"
echo "   pnpm db:seed"
echo ""
echo "4. Start development:"
echo "   pnpm dev              # Start all services"
echo "   pnpm dev:api          # Start API only"
echo "   pnpm dev:web          # Start frontend only"
echo ""
echo "5. Verify health:"
echo "   curl http://localhost:3000/health"
echo ""
