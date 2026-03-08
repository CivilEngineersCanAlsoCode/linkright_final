#!/usr/bin/env bash
# bootstrap.sh — Full autonomous dev environment setup
# Based on CLAUDE.md v8.0 Sections 16-20
#
# Usage: ./setup/bootstrap.sh [--phase N]
#   --phase N   Resume from phase N (0-6)
#
# Phases:
#   0: Prerequisites check
#   1: Beads install + init
#   2: ChromaDB docker setup
#   3: Agent Mail install
#   4: Claude Code permissions
#   5: Seed project knowledge (run inside Claude Code)
#   6: Verify all

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CHROMADB_DIR="$HOME/.autonomous-dev/chromadb"
START_PHASE=0

while [[ $# -gt 0 ]]; do
  case $1 in
    --phase) START_PHASE="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

pass() { echo -e "${GREEN}✓ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
info() { echo -e "  $1"; }

# ─────────────────────────────────────────────
# Phase 0: Prerequisites
# ─────────────────────────────────────────────
phase_0() {
  echo ""
  echo "═══ Phase 0: Prerequisites ═══"
  local ok=true

  for cmd in git docker node python3; do
    if command -v "$cmd" &>/dev/null; then
      pass "$cmd: $(command $cmd --version 2>&1 | head -1)"
    else
      fail "$cmd not found"
      ok=false
    fi
  done

  # Check Python version >= 3.11
  if command -v python3 &>/dev/null; then
    py_ver=$(python3 -c 'import sys; print(f"{sys.version_info.minor}")')
    if [[ "$py_ver" -ge 11 ]]; then
      pass "Python 3.$py_ver (>= 3.11)"
    else
      fail "Python 3.$py_ver (need >= 3.11)"
      ok=false
    fi
  fi

  # Check uv
  if command -v uv &>/dev/null; then
    pass "uv: $(uv --version 2>&1)"
  else
    warn "uv not found (needed for Agent Mail only)"
  fi

  # Check Docker running
  if docker ps &>/dev/null; then
    pass "Docker daemon running"
  else
    fail "Docker not running — start Docker Desktop first"
    ok=false
  fi

  if [[ "$ok" == false ]]; then
    fail "Prerequisites incomplete. Fix above issues and re-run."
    exit 1
  fi
  pass "All prerequisites met"
}

# ─────────────────────────────────────────────
# Phase 1: Beads
# ─────────────────────────────────────────────
phase_1() {
  echo ""
  echo "═══ Phase 1: Beads ═══"

  if command -v bd &>/dev/null; then
    pass "bd already installed: $(bd version 2>&1 || echo 'installed')"
  else
    info "Installing beads..."
    if command -v brew &>/dev/null; then
      brew install beads
    elif command -v npm &>/dev/null; then
      npm install -g @beads/bd
    else
      curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
    fi
    pass "beads installed"
  fi

  # Init if not already
  if [[ -d ".beads" ]]; then
    pass ".beads/ already exists"
  else
    bd init
    pass "bd init complete"
  fi

  bd info
  pass "Beads ready"
}

# ─────────────────────────────────────────────
# Phase 2: ChromaDB
# ─────────────────────────────────────────────
phase_2() {
  echo ""
  echo "═══ Phase 2: ChromaDB ═══"

  # Create directory
  mkdir -p "$CHROMADB_DIR/data"
  pass "ChromaDB directory: $CHROMADB_DIR"

  # Copy docker-compose if not exists
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  if [[ ! -f "$CHROMADB_DIR/docker-compose.yml" ]]; then
    cp "$SCRIPT_DIR/chromadb/docker-compose.yml" "$CHROMADB_DIR/docker-compose.yml"
    pass "docker-compose.yml copied"
  else
    warn "docker-compose.yml already exists, skipping"
  fi

  # Generate .env if not exists
  if [[ ! -f "$CHROMADB_DIR/.env" ]]; then
    TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))")
    cat > "$CHROMADB_DIR/.env" <<EOF
MCP_AUTH_TOKEN=$TOKEN
CHROMA_DATA_PATH=./data
PORT=8080
EOF
    pass ".env created with generated token"
    info "Token: $TOKEN"
    info "Save this token — you'll need it for Claude Code MCP config"
  else
    warn ".env already exists, skipping"
  fi

  # Start ChromaDB
  info "Starting ChromaDB..."
  cd "$CHROMADB_DIR" && docker compose up -d
  cd - >/dev/null

  # Wait for health
  info "Waiting for ChromaDB health..."
  for i in $(seq 1 15); do
    if curl -sf http://localhost:8080/health &>/dev/null; then
      pass "ChromaDB healthy on :8080"
      return 0
    fi
    sleep 2
  done
  fail "ChromaDB didn't become healthy in 30s"
  info "Check: cd $CHROMADB_DIR && docker compose logs"
  return 1
}

# ─────────────────────────────────────────────
# Phase 3: Agent Mail
# ─────────────────────────────────────────────
phase_3() {
  echo ""
  echo "═══ Phase 3: Agent Mail ═══"

  if ! command -v uv &>/dev/null; then
    warn "uv not installed — skipping Agent Mail"
    warn "Install uv and re-run with --phase 3"
    return 0
  fi

  if curl -sf http://localhost:8765/health &>/dev/null; then
    pass "Agent Mail already running on :8765"
    return 0
  fi

  info "Installing Agent Mail..."
  curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/mcp_agent_mail/main/scripts/install.sh?$(date +%s)" | bash -s -- --yes

  info "Waiting for Agent Mail health..."
  for i in $(seq 1 10); do
    if curl -sf http://localhost:8765/health &>/dev/null; then
      pass "Agent Mail healthy on :8765"
      return 0
    fi
    sleep 2
  done
  warn "Agent Mail not responding — may need manual start with 'am' command"
}

# ─────────────────────────────────────────────
# Phase 4: Claude Code Permissions
# ─────────────────────────────────────────────
phase_4() {
  echo ""
  echo "═══ Phase 4: Claude Code Permissions ═══"

  SETTINGS_FILE="$HOME/.claude/settings.json"
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

  if [[ -f "$SETTINGS_FILE" ]]; then
    warn "$SETTINGS_FILE already exists"
    info "Review template at: $SCRIPT_DIR/claude-code-settings.template.json"
    info "Merge manually if needed"
  else
    mkdir -p "$HOME/.claude"
    cp "$SCRIPT_DIR/claude-code-settings.template.json" "$SETTINGS_FILE"
    pass "settings.json created at $SETTINGS_FILE"
  fi

  # Add MCP servers
  info "Configure MCP servers in Claude Code:"
  if [[ -f "$CHROMADB_DIR/.env" ]]; then
    TOKEN=$(grep MCP_AUTH_TOKEN "$CHROMADB_DIR/.env" | cut -d= -f2)
    info "  claude mcp add --transport http chromadb \"http://localhost:8080/mcp?apiKey=$TOKEN\""
  fi
  info "  claude mcp add --transport http agent-mail \"http://localhost:8765/mcp\" --header \"Authorization: Bearer <TOKEN>\""

  pass "Permissions phase complete"
}

# ─────────────────────────────────────────────
# Phase 5: Seed Knowledge (Claude Code only)
# ─────────────────────────────────────────────
phase_5() {
  echo ""
  echo "═══ Phase 5: Seed Knowledge ═══"
  warn "This phase runs INSIDE Claude Code (needs bd remember + ChromaDB)"
  info "Start Claude Code and run the Bootstrap Procedure (CLAUDE.md Section 15)"
  info "Or let the SessionStart hook + bd prime handle it automatically"
  pass "Phase 5 noted (manual step)"
}

# ─────────────────────────────────────────────
# Phase 6: Verify All
# ─────────────────────────────────────────────
phase_6() {
  echo ""
  echo "═══ Phase 6: Verification ═══"
  local total=0
  local passed=0

  # 1. Beads
  total=$((total + 1))
  if bd info &>/dev/null; then
    pass "1/7 Beads running"
    passed=$((passed + 1))
  else
    fail "1/7 Beads not working"
  fi

  # 2. Memories
  total=$((total + 1))
  if bd memories project 2>/dev/null | grep -q .; then
    pass "2/7 Memories populated"
    passed=$((passed + 1))
  else
    warn "2/7 No memories yet (run Phase 5 in Claude Code)"
  fi

  # 3. ChromaDB
  total=$((total + 1))
  if curl -sf http://localhost:8080/health &>/dev/null; then
    pass "3/7 ChromaDB healthy"
    passed=$((passed + 1))
  else
    fail "3/7 ChromaDB not responding"
  fi

  # 4. Agent Mail
  total=$((total + 1))
  if curl -sf http://localhost:8765/health &>/dev/null; then
    pass "4/7 Agent Mail healthy"
    passed=$((passed + 1))
  else
    warn "4/7 Agent Mail not responding"
  fi

  # 5. MCP servers
  total=$((total + 1))
  if command -v claude &>/dev/null && claude mcp list 2>/dev/null | grep -q "chromadb"; then
    pass "5/7 MCP servers connected"
    passed=$((passed + 1))
  else
    warn "5/7 MCP servers not verified (check manually: claude mcp list)"
  fi

  # 6. ChromaDB collection (skip if ChromaDB down)
  total=$((total + 1))
  if curl -sf http://localhost:8080/health &>/dev/null; then
    pass "6/7 ChromaDB accessible (collection check needs Claude Code)"
    passed=$((passed + 1))
  else
    warn "6/7 ChromaDB collection not tested"
  fi

  # 7. bd prime
  total=$((total + 1))
  if bd prime &>/dev/null; then
    pass "7/7 bd prime works"
    passed=$((passed + 1))
  else
    warn "7/7 bd prime returned no output"
  fi

  echo ""
  echo "═══ Results: $passed/$total checks passed ═══"
}

# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
echo "╔══════════════════════════════════════════╗"
echo "║   Autonomous Dev Environment Bootstrap   ║"
echo "║   CLAUDE.md v8.0 — Phases 0-6           ║"
echo "╚══════════════════════════════════════════╝"

for phase in $(seq "$START_PHASE" 6); do
  "phase_$phase" || warn "Phase $phase had issues — continuing"
done

echo ""
echo "═══ Bootstrap Complete ═══"
echo "Next: Open Claude Code in your project directory"
echo "The SessionStart hook will run 'bd prime' automatically"
