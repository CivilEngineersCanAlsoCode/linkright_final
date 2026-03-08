#!/usr/bin/env bash
# verify.sh — Run all 7 health checks from CLAUDE.md Phase 6
# Usage: ./setup/verify.sh [--report]
#   --report    Offer to create GitHub issue if checks fail

set -uo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REPO_OWNER="CivilEngineersCanAlsoCode"
REPO_NAME="linkright_final"
REPO_URL="https://github.com/$REPO_OWNER/$REPO_NAME"
AGENT_MAIL_HEALTH="http://localhost:8765/health/liveness"
CHROMADB_HEALTH="http://localhost:8080/health"
REPORT_ENABLED=false
CHECK_LOG="/tmp/verify-checks-$$.log"

while [[ $# -gt 0 ]]; do
  case $1 in
    --report) REPORT_ENABLED=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

pass() { echo -e "${GREEN}✓ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
info() { echo -e "  $1"; }

PASSED=0
FAILED=0
WARNED=0
FAILED_CHECKS=""

check() {
  local num="$1" desc="$2" cmd="$3"
  if eval "$cmd" &>/dev/null; then
    pass "[$num/7] $desc"
    PASSED=$((PASSED + 1))
  else
    fail "[$num/7] $desc"
    FAILED=$((FAILED + 1))
    FAILED_CHECKS="${FAILED_CHECKS}\n- [$num/7] $desc"
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

collect_env_info() {
  cat <<ENVEOF
### Environment
| Key | Value |
|-----|-------|
| OS | $(uname -srm) |
| Docker | $(docker --version 2>/dev/null || echo 'not found') |
| Docker Running | $(docker ps &>/dev/null && echo 'yes' || echo 'no') |
| Node | $(node --version 2>/dev/null || echo 'not found') |
| Python | $(python3 --version 2>/dev/null || echo 'not found') |
| bd (beads) | $(bd version 2>/dev/null || echo 'not found') |
ENVEOF
}

echo "══════════════════════════════════════"
echo "  System Health Check (7 checks)"
echo "══════════════════════════════════════"
echo ""

check      1 "Beads running"            "bd info"
check      2 "Memories populated"       "bd memories project 2>/dev/null | grep -q ."
check      3 "ChromaDB healthy"         "curl -sf $CHROMADB_HEALTH"
check_warn 4 "Agent Mail healthy"       "curl -sf $AGENT_MAIL_HEALTH"
check_warn 5 "MCP servers connected"    "command -v claude && claude mcp list 2>/dev/null | grep -q chromadb"
check      6 "ChromaDB port accessible" "curl -sf $CHROMADB_HEALTH"
check      7 "bd prime loads context"   "bd prime"

echo ""
echo "══════════════════════════════════════"
echo -e "  ${GREEN}Passed: $PASSED${NC}  ${RED}Failed: $FAILED${NC}  ${YELLOW}Warnings: $WARNED${NC}"
echo "══════════════════════════════════════"

# Offer bug report if failures detected
if [[ $FAILED -gt 0 ]]; then
  echo ""
  if [[ "$REPORT_ENABLED" == true ]] || [[ -t 0 ]]; then
    echo -e "${BLUE}Some checks failed. Report to maintainer? [Y/n]${NC} "
    read -r response </dev/tty 2>/dev/null || response="n"
    if [[ ! "$response" =~ ^[Nn] ]]; then
      local fingerprint
      fingerprint=$(echo "verify:$FAILED_CHECKS" | md5 2>/dev/null | cut -c1-8 \
        || echo "verify:$FAILED_CHECKS" | md5sum 2>/dev/null | cut -c1-8 \
        || echo "no-fp")
      local title="[verify-fail] $FAILED checks failed [fp:$fingerprint]"
      local body="## Verification Failure (auto-generated)

**Failed checks**: $(echo -e "$FAILED_CHECKS")
**Passed**: $PASSED | **Failed**: $FAILED | **Warnings**: $WARNED
**Fingerprint**: \`$fingerprint\`
**Date**: $(date -u +%Y-%m-%dT%H:%M:%SZ)

$(collect_env_info)

### Reproduction
\`\`\`bash
./setup/verify.sh --report
\`\`\`

---
*Auto-reported by verify.sh*"

      if command -v gh &>/dev/null; then
        local existing
        existing=$(gh issue list --repo "$REPO_OWNER/$REPO_NAME" \
          --search "fp:$fingerprint in:title" \
          --state open --limit 1 --json number --jq '.[0].number' 2>/dev/null || echo "")

        if [[ -n "$existing" && "$existing" != "null" ]]; then
          info "Issue #$existing already exists — adding +1 comment"
          gh issue comment "$existing" --repo "$REPO_OWNER/$REPO_NAME" \
            --body "Another user hit this. $(collect_env_info)" 2>/dev/null
        else
          local issue_url
          issue_url=$(gh issue create --repo "$REPO_OWNER/$REPO_NAME" \
            --title "$title" --label "setup-bug,auto-reported" \
            --body "$body" 2>/dev/null)
          if [[ -n "$issue_url" ]]; then
            pass "Issue created: $issue_url"
          fi
        fi
      else
        info "Install 'gh' CLI to auto-report, or open:"
        info "  $REPO_URL/issues/new?labels=setup-bug"
      fi
    fi
  fi
  exit 1
fi
