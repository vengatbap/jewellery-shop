# Jewellery ERP - Setup Verification (PowerShell)

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Jewellery ERP - Setup Verification                         ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host -NoNewline "Checking Node.js... "
try {
    $nodeVersion = node --version
    Write-Host "✓ $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
    exit 1
}

# Check pnpm
Write-Host -NoNewline "Checking pnpm... "
try {
    $pnpmVersion = pnpm --version
    Write-Host "✓ $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ pnpm not found" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL (optional)
Write-Host -NoNewline "Checking PostgreSQL... "
try {
    $pgVersion = psql --version
    Write-Host "✓ $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ Not installed (use Neon cloud or install locally)" -ForegroundColor Yellow
}

# Check directory structure
Write-Host ""
Write-Host "Checking directory structure:" -ForegroundColor Cyan
$dirs = @(
    "apps/api",
    "apps/web",
    "packages/database",
    "packages/shared",
    "packages/config",
    "packages/events",
    "packages/validation",
    "packages/workflows"
)

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "  ✓ $dir" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $dir" -ForegroundColor Red
    }
}

# Check key files
Write-Host ""
Write-Host "Checking key files:" -ForegroundColor Cyan
$files = @(
    "package.json",
    "pnpm-workspace.yaml",
    "tsconfig.json",
    "turbo.json",
    ".env.example",
    "apps/api/package.json",
    "apps/web/package.json",
    "packages/database/package.json"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file" -ForegroundColor Red
    }
}

# Check node_modules
Write-Host ""
if (Test-Path "node_modules") {
    Write-Host "Dependencies: ✓ Installed" -ForegroundColor Green
} else {
    Write-Host "Dependencies: ⚠ Not installed" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run: pnpm install" -ForegroundColor Yellow
}

# Check .env.local
Write-Host ""
if (Test-Path ".env.local") {
    Write-Host "Environment: ✓ .env.local exists" -ForegroundColor Green
} else {
    Write-Host "Environment: ⚠ .env.local not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run: Copy-Item .env.example .env.local" -ForegroundColor Yellow
    Write-Host "Then edit .env.local with your settings" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Next Steps                                                   ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Install dependencies:" -ForegroundColor Yellow
Write-Host "   pnpm install" -ForegroundColor White
Write-Host ""
Write-Host "2. Setup environment:" -ForegroundColor Yellow
Write-Host "   Copy-Item .env.example .env.local" -ForegroundColor White
Write-Host "   notepad .env.local" -ForegroundColor White
Write-Host ""
Write-Host "3. Setup database:" -ForegroundColor Yellow
Write-Host "   pnpm db:migrate" -ForegroundColor White
Write-Host "   pnpm db:seed" -ForegroundColor White
Write-Host ""
Write-Host "4. Start development:" -ForegroundColor Yellow
Write-Host "   pnpm dev              # All services" -ForegroundColor White
Write-Host "   pnpm dev:api          # API only (Terminal 1)" -ForegroundColor White
Write-Host "   pnpm dev:web          # Frontend only (Terminal 2)" -ForegroundColor White
Write-Host ""
Write-Host "5. Verify health:" -ForegroundColor Yellow
Write-Host "   curl http://localhost:3000/health" -ForegroundColor White
Write-Host ""
