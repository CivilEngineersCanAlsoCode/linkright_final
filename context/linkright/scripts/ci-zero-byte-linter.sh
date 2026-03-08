#!/bin/bash
# CI Linter: Zero-Byte File Detection & Prevention
# Purpose: Prevent zero-byte files from entering repository
# Usage: ./ci-zero-byte-linter.sh [--fix] [--strict]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FIX_MODE=false
STRICT_MODE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --fix) FIX_MODE=true; shift ;;
    --strict) STRICT_MODE=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

echo "=== Zero-Byte File Linter ==="
echo "Repository: $REPO_ROOT"
echo "Fix mode: $FIX_MODE"
echo "Strict mode: $STRICT_MODE"
echo ""

# Find all zero-byte files (exclude .gitkeep)
ZERO_BYTE_FILES=$(find "$REPO_ROOT" -type f -size 0 ! -name ".gitkeep" 2>/dev/null || true)

if [ -z "$ZERO_BYTE_FILES" ]; then
  echo "✓ PASS: No errant zero-byte files detected"
  exit 0
fi

echo "⚠️  DETECTED $(echo "$ZERO_BYTE_FILES" | wc -l) zero-byte files:"
echo "$ZERO_BYTE_FILES" | sed 's/^/  /'
echo ""

if [ "$FIX_MODE" = true ]; then
  echo "Removing zero-byte files..."
  echo "$ZERO_BYTE_FILES" | while read -r file; do
    rm -f "$file"
    echo "  Removed: $file"
  done
  echo "✓ Cleaned"
  exit 0
fi

if [ "$STRICT_MODE" = true ]; then
  echo "✗ FAIL (strict mode): Zero-byte files not allowed in CI"
  exit 1
fi

echo "⚠️  WARNING: Zero-byte files detected. Use --fix to remove or --strict to fail CI."
exit 0
