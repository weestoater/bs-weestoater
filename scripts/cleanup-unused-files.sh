#!/bin/bash
# Cleanup script for unused files after database migration
# Run this from the project root: bash scripts/cleanup-unused-files.sh

echo "🧹 Cleaning up unused files after database migration..."
echo ""

# Create archive directory if it doesn't exist
mkdir -p archive/data

echo "📦 Archiving football JSON data files..."
# Move football JSON files to archive
for season in 2020-21 2021-22 2022-23 2023-24 2024-25 2025-26; do
  if [ -f "src/data/${season}-matches.json" ]; then
    git mv "src/data/${season}-matches.json" "archive/data/" 2>/dev/null && \
      echo "  ✓ Archived ${season}-matches.json"
  fi
  if [ -f "src/data/${season}-goals.json" ]; then
    git mv "src/data/${season}-goals.json" "archive/data/" 2>/dev/null && \
      echo "  ✓ Archived ${season}-goals.json"
  fi
done

echo ""
echo "🗑️  Removing O'Donnell debugging scripts (keeping .sql for reference)..."
# Remove temporary O'Donnell debugging scripts
scripts_to_remove=(
  "backend/supabase/comprehensive-odonnell-search.js"
  "backend/supabase/debug-odonnell.js"
  "backend/supabase/fix-odonnell-card.js"
  "backend/supabase/fix-odonnell-final.js"
  "backend/supabase/fix-odonnell-spelling.js"
  "backend/supabase/search-odonnell.js"
  "backend/supabase/show-odonnell-cards.js"
  "backend/supabase/test-get-players.js"
)

for script in "${scripts_to_remove[@]}"; do
  if [ -f "$script" ]; then
    git rm "$script" 2>/dev/null && echo "  ✓ Removed $(basename $script)"
  fi
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Summary of changes:"
echo "  📦 Football JSON files moved to archive/data/"
echo "  🗑️  8 temporary debugging scripts removed"
echo "  ✅ Kept fix-odonnell-spelling.sql for reference"
echo ""
echo "Next steps:"
echo "  1. Review changes: git status"
echo "  2. Commit: git commit -m 'chore: cleanup unused files after database migration'"
echo "  3. Continue with test coverage improvements"
