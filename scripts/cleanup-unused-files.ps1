# Cleanup script for unused files after database migration
# Run this from the project root: bash scripts/cleanup-unused-files.ps1

Write-Host "🧹 Cleaning up unused files after database migration..." -ForegroundColor Cyan
Write-Host ""

# Create archive directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "archive/data" | Out-Null

Write-Host "📦 Archiving football JSON data files..." -ForegroundColor Yellow

# Move football JSON files to archive
$seasons = @("2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26")
foreach ($season in $seasons) {
    $matchesFile = "src/data/$season-matches.json"
    $goalsFile = "src/data/$season-goals.json"
    
    if (Test-Path $matchesFile) {
        git mv $matchesFile "archive/data/" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Archived $season-matches.json" -ForegroundColor Green
        }
    }
    
    if (Test-Path $goalsFile) {
        git mv $goalsFile "archive/data/" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Archived $season-goals.json" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "🗑️  Removing O'Donnell debugging scripts (keeping .sql for reference)..." -ForegroundColor Yellow

# Remove temporary O'Donnell debugging scripts
$scriptsToRemove = @(
    "backend/supabase/comprehensive-odonnell-search.js",
    "backend/supabase/debug-odonnell.js",
    "backend/supabase/fix-odonnell-card.js",
    "backend/supabase/fix-odonnell-final.js",
    "backend/supabase/fix-odonnell-spelling.js",
    "backend/supabase/search-odonnell.js",
    "backend/supabase/show-odonnell-cards.js",
    "backend/supabase/test-get-players.js"
)

foreach ($script in $scriptsToRemove) {
    if (Test-Path $script) {
        git rm $script 2>$null
        if ($LASTEXITCODE -eq 0) {
            $scriptName = Split-Path $script -Leaf
            Write-Host "  ✓ Removed $scriptName" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary of changes:" -ForegroundColor Cyan
Write-Host "  📦 Football JSON files moved to archive/data/"
Write-Host "  🗑️  8 temporary debugging scripts removed"
Write-Host "  ✅ Kept fix-odonnell-spelling.sql for reference"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review changes: git status"
Write-Host "  2. Commit: git commit -m 'chore: cleanup unused files after database migration'"
Write-Host "  3. Continue with test coverage improvements"
