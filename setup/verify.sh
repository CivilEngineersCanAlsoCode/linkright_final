#!/usr/bin/env bash
# verify.sh — Run all 7 health checks from CLAUDE.md Phase 6
# Usage: ./setup/verify.sh

set -uo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }

PASSED=0
FAILED=0
WARNED=0

check() {
  local num="$1" desc="$2" cmd="$3"
  if eval "$cmd" &>/dev/null; then
    pass "[$num/7] $desc"
    PASSED=$((PASSED + 1))
  else
    fail "[$num/7] $desc"
    FAILED=$((FAILED + 1))
  fi
}

check_warn() {
  local num="$1" desc="$2" cmd="$3"
  if eval "$cmd" &>/dev/null; then
    pass "[$num/7] $desc"
    PASSED=$((PASSED + 1))
  else
    warn "[$num/7] $desc (optional)"
    WARNED=$((WARNED + 1))
  fi
}

echo "══════════════════════════════════════"
echo "  System Health Check (7 checks)"
echo "══════════════════════════════════════"
echo ""

check     1 "Beads running"            "bd info"
check     2 "Memories populated"       "bd memories project 2>/dev/null | grep -q ."
check     3 "ChromaDB healthy"         "curl -sf http://localhost:8080/health"
check_warn 4 "Agent Mail healthy"      "curl -sf http://localhost:8765/health"
check_warn 5 "MCP servers connected"   "command -v claude && claude mcp list 2>/dev/null | grep -q chromadb"
check     6 "ChromaDB port accessible" "curl -sf http://localhost:8080/health"
check     7 "bd prime loads context"   "bd prime"

echo ""
echo "══════════════════════════════════════"
echo -e "  ${GREEN}Passed: $PASSED${NC}  ${RED}Failed: $FAILED${NC}  ${YELLOW}Warnings: $WARNED${NC}"
echo "══════════════════════════════════════"

if [[ $FAILED -gt 0 ]]; then
  exit 1
fi
