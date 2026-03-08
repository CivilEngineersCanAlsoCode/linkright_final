#!/usr/bin/env bash
# bootstrap.sh — Full autonomous dev environment setup
# Based on CLAUDE.md v8.0 Sections 16-20
#
# Usage: ./setup/bootstrap.sh [--phase N] [--no-report]
#   --phase N      Resume from phase N (0-6)
#   --no-report    Skip bug reporting prompts
#
# Phases:
#   0: Prerequisites check
#   1: Beads install + init
#   2: ChromaDB docker setup
#   3: Agent Mail install
#   4: Claude Code permissions
#   5: Seed project knowledge (run inside Claude Code)
#   6: Verify all
#
# Bug Reporting:
#   When a phase fails, the script offers to create a GitHub Issue
#   with full diagnostics. This helps the maintainer fix edge cases
#   that only appear in specific environments. Over time, every unique
#   failure gets reported, reviewed, and fixed — making the setup
#   more robust for everyone.

# Don't use set -e — phases handle their own errors gracefully
set -uo pipefail

# ─────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────
REPO_OWNER="CivilEngineersCanAlsoCode"
REPO_NAME="linkright_final"
REPO_URL="https://github.com/$REPO_OWNER/$REPO_NAME"
CHROMADB_DIR="$HOME/.autonomous-dev/chromadb"
AGENT_MAIL_HEALTH="http://localhost:8765/health/liveness"
CHROMADB_HEALTH="http://localhost:8080/health"
PHASE_TIMEOUT=120  # seconds per phase max
START_PHASE=0
BUG_REPORT_ENABLED=true
PHASE_LOG="/tmp/bootstrap-phase-$$.log"
FULL_LOG="/tmp/bootstrap-full-$$.log"

# ─────────────────────────────────────────────
# Colors & helpers
# ─────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
info() { echo -e "  $1"; }

# ─────────────────────────────────────────────
# Parse args
# ─────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --phase) START_PHASE="$2"; shift 2 ;;
    --no-report) BUG_REPORT_ENABLED=false; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ─────────────────────────────────────────────
# Environment collection (for bug reports)
# ─────────────────────────────────────────────
collect_env_info() {
  cat <<ENVEOF
### Environment
| Key | Value |
|-----|-------|
| OS | $(uname -srm) |
| Shell | $SHELL ($($SHELL --version 2>&1 | head -1)) |
| Git | $(git --version 2>/dev/null || echo 'not found') |
| Docker | $(docker --version 2>/dev/null || echo 'not found') |
| Docker Running | $(docker ps &>/dev/null && echo 'yes' || echo 'no') |
| Node | $(node --version 2>/dev/null || echo 'not found') |
| Python | $(python3 --version 2>/dev/null || echo 'not found') |
| uv | $(uv --version 2>/dev/null || echo 'not found') |
| bd (beads) | $(bd version 2>/dev/null || echo 'not found') |
| gh CLI | $(gh --version 2>/dev/null | head -1 || echo 'not found') |
| Homebrew | $(brew --version 2>/dev/null | head -1 || echo 'not found') |
ENVEOF
}

# ─────────────────────────────────────────────
# Bug fingerprinting (deduplication)
# ─────────────────────────────────────────────
# Creates a short hash from phase + first error line
# Same root cause from different users → same fingerprint → same issue
make_fingerprint() {
  local phase_num="$1"
  local error_output="$2"
  # Extract the first meaningful error line
  local error_sig
  error_sig=$(echo "$error_output" | grep -iE '✗|error|fail|denied|timeout|refused|not found' | head -1 | sed 's/[0-9]*//g' | tr -s ' ')
  echo -n "phase${phase_num}:${error_sig}" | md5 2>/dev/null | cut -c1-8 \
    || echo -n "phase${phase_num}:${error_sig}" | md5sum 2>/dev/null | cut -c1-8 \
    || echo "no-fp"
}

# ─────────────────────────────────────────────
# Bug reporter
# ─────────────────────────────────────────────
report_bug() {
  local phase_num="$1"
  local phase_name="$2"
  local exit_code="$3"
  local phase_output
  phase_output=$(tail -80 "$PHASE_LOG" 2>/dev/null || echo "(no log captured)")

  local fingerprint
  fingerprint=$(make_fingerprint "$phase_num" "$phase_output")

  if [[ "$BUG_REPORT_ENABLED" != true ]]; then
    info "Bug reporting disabled (--no-report). Fingerprint: $fingerprint"
    return
  fi

  echo ""
  echo -e "${BLUE}╭──────────────────────────────────────────────╮${NC}"
  echo -e "${BLUE}│  Setup hit an issue! Help improve this tool  │${NC}"
  echo -e "${BLUE}│  by reporting this bug to the maintainer.    │${NC}"
  echo -e "${BLUE}│                                              │${NC}"
  echo -e "${BLUE}│  No personal data is included — only tool    │${NC}"
  echo -e "${BLUE}│  versions and the error output.              │${NC}"
  echo -e "${BLUE}╰──────────────────────────────────────────────╯${NC}"
  echo ""
  echo -n "Report this issue? [Y/n] "
  read -r response </dev/tty 2>/dev/null || response="n"

  if [[ "$response" =~ ^[Nn] ]]; then
    info "Skipped. If you change your mind, re-run with --phase $phase_num"
    return
  fi

  local title="[setup-bug] Phase $phase_num ($phase_name) failed [fp:$fingerprint]"
  local body
  body=$(cat <<BUGEOF
## Bug Report (auto-generated by bootstrap.sh)

**Phase**: $phase_num — $phase_name
**Exit Code**: $exit_code
**Fingerprint**: \`$fingerprint\`
**Date**: $(date -u +%Y-%m-%dT%H:%M:%SZ)

### Error Output
\`\`\`
$(echo "$phase_output" | tail -40)
\`\`\`

$(collect_env_info)

### Reproduction
\`\`\`bash
./setup/bootstrap.sh --phase $phase_num
\`\`\`

---
*Auto-reported by bootstrap.sh bug reporter. Fingerprint \`$fingerprint\` is used to detect duplicates.*
BUGEOF
)

  # Method 1: Try gh CLI (best — creates issue directly)
  if command -v gh &>/dev/null; then
    # Check if already reported (deduplicate)
    local existing
    existing=$(gh issue list --repo "$REPO_OWNER/$REPO_NAME" \
      --search "fp:$fingerprint in:title" \
      --state open --limit 1 --json number --jq '.[0].number' 2>/dev/null || echo "")

    if [[ -n "$existing" && "$existing" != "null" ]]; then
      info "Issue #$existing already exists for this bug — adding a +1 comment"
      gh issue comment "$existing" \
        --repo "$REPO_OWNER/$REPO_NAME" \
        --body "Another user hit this same issue.

$(collect_env_info)

\`\`\`
$(echo "$phase_output" | tail -20)
\`\`\`" 2>/dev/null && pass "Comment added to issue #$existing" && return
    fi

    info "Creating GitHub issue..."
    local issue_url
    issue_url=$(gh issue create \
      --repo "$REPO_OWNER/$REPO_NAME" \
      --title "$title" \
      --label "setup-bug,auto-reported" \
      --body "$body" 2>/dev/null)

    if [[ -n "$issue_url" ]]; then
      pass "Issue created: $issue_url"
      return
    else
      warn "gh issue create failed — falling back to URL method"
    fi
  fi

  # Method 2: Generate pre-filled issue URL (works without gh CLI)
  local encoded_title encoded_body issue_create_url
  encoded_title=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$title'''))" 2>/dev/null || echo "")
  # Body too long for URL — use a shorter version
  local short_body="Phase $phase_num ($phase_name) failed with exit code $exit_code.%0A%0AFingerprint: $fingerprint%0A%0APlease paste your terminal output below."
  issue_create_url="$REPO_URL/issues/new?title=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$title'))" 2>/dev/null)&labels=setup-bug,auto-reported&body=$short_body"

  echo ""
  info "Open this link to report the bug:"
  echo -e "  ${BLUE}${issue_create_url}${NC}"
  echo ""

  # Try to open in browser
  if command -v open &>/dev/null; then
    echo -n "  Open in browser? [Y/n] "
    read -r open_response </dev/tty 2>/dev/null || open_response="n"
    if [[ ! "$open_response" =~ ^[Nn] ]]; then
      open "$issue_create_url"
    fi
  fi

  # Method 3: Save report locally as last resort
  local report_file="/tmp/setup-bug-report-${fingerprint}.md"
  echo "$body" > "$report_file"
  info "Report also saved to: $report_file"
}

# ─────────────────────────────────────────────
# Phase runner with timeout + logging + reporting
# ─────────────────────────────────────────────
PHASE_NAMES=(
  "Prerequisites"
  "Beads"
  "ChromaDB"
  "Agent Mail"
  "Claude Code Permissions"
  "Seed Knowledge"
  "Verify All"
)

run_phase() {
  local phase_num="$1"
  local phase_name="${PHASE_NAMES[$phase_num]}"

  # Clear phase log for this phase
  > "$PHASE_LOG"

  # Run phase directly (output goes to terminal), capture to log via script
  # Using a simple approach: run in background with timeout, capture exit code
  local exit_code=0

  # Start phase in background for timeout control
  "phase_$phase_num" > >(while IFS= read -r line; do echo "$line"; echo "$line" >> "$PHASE_LOG"; echo "$line" >> "$FULL_LOG"; done) 2>&1 &
  local pid=$!

  # Wait with timeout
  local waited=0
  while kill -0 "$pid" 2>/dev/null && [[ $waited -lt $PHASE_TIMEOUT ]]; do
    sleep 1
    waited=$((waited + 1))
  done

  if kill -0 "$pid" 2>/dev/null; then
    # Phase timed out — kill it and all children
    kill -- -"$pid" 2>/dev/null || kill "$pid" 2>/dev/null
    wait "$pid" 2>/dev/null
    exit_code=124
    local msg="Phase $phase_num TIMED OUT after ${PHASE_TIMEOUT}s (likely a blocking process)"
    fail "$msg"
    echo "$msg" >> "$PHASE_LOG"
    echo "$msg" >> "$FULL_LOG"
  else
    wait "$pid" 2>/dev/null
    exit_code=$?
  fi

  # Report if failed
  if [[ $exit_code -ne 0 ]]; then
    report_bug "$phase_num" "$phase_name" "$exit_code"
    warn "Phase $phase_num ($phase_name) had issues — continuing to next phase"
  fi

  return 0  # always continue to next phase
}

# ─────────────────────────────────────────────
# Phase 0: Prerequisites
# ─────────────────────────────────────────────
phase_0() {
  echo ""
  echo "═══ Phase 0: Prerequisites ═══"
  local ok=true

  for cmd in git docker node python3; do
    if command -v "$cmd" &>/dev/null; then
      pass "$cmd: $("$cmd" --version 2>&1 | head -1)"
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
    return 1
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
    TOKEN=$(grep MCP_AUTH_TOKEN "$CHROMADB_DIR/.env" | cut -d= -f2)
  fi

  # Start ChromaDB
  info "Starting ChromaDB..."
  (cd "$CHROMADB_DIR" && docker compose up -d 2>&1)

  # Wait for health
  info "Waiting for ChromaDB health..."
  for i in $(seq 1 20); do
    if curl -sf "$CHROMADB_HEALTH" &>/dev/null; then
      pass "ChromaDB healthy on :8080"
      return 0
    fi
    sleep 3
  done
  fail "ChromaDB didn't become healthy in 60s"
  info "Debug: cd $CHROMADB_DIR && docker compose logs"
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

  # Check if already running (correct endpoint)
  if curl -sf "$AGENT_MAIL_HEALTH" &>/dev/null; then
    pass "Agent Mail already running on :8765"
    return 0
  fi

  # Check if already installed
  local AM_DIR=""
  if [[ -d "$PWD/mcp_agent_mail" ]]; then
    AM_DIR="$PWD/mcp_agent_mail"
  elif [[ -d "$HOME/mcp_agent_mail" ]]; then
    AM_DIR="$HOME/mcp_agent_mail"
  fi

  if [[ -z "$AM_DIR" ]]; then
    info "Installing Agent Mail (this may take a minute)..."
    # Run install in background subshell — NEVER let it block
    (curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/mcp_agent_mail/main/scripts/install.sh?$(date +%s)" \
      | bash -s -- --yes > /tmp/agent-mail-install.log 2>&1) &
    local install_pid=$!

    info "Waiting for Agent Mail to come up..."
    for i in $(seq 1 45); do
      if curl -sf "$AGENT_MAIL_HEALTH" &>/dev/null; then
        pass "Agent Mail healthy on :8765"
        return 0
      fi
      # If install process died, stop waiting
      if ! kill -0 "$install_pid" 2>/dev/null; then
        break
      fi
      sleep 2
    done

    # Kill installer if still running (it may be stuck in foreground server)
    if kill -0 "$install_pid" 2>/dev/null; then
      kill "$install_pid" 2>/dev/null
      wait "$install_pid" 2>/dev/null
    fi

    # Re-check if installed
    if [[ -d "$PWD/mcp_agent_mail" ]]; then
      AM_DIR="$PWD/mcp_agent_mail"
    elif [[ -d "$HOME/mcp_agent_mail" ]]; then
      AM_DIR="$HOME/mcp_agent_mail"
    fi
  fi

  # Try starting manually if installed but not running
  if [[ -n "$AM_DIR" ]] && ! curl -sf "$AGENT_MAIL_HEALTH" &>/dev/null; then
    info "Starting Agent Mail from $AM_DIR..."
    local run_script="$AM_DIR/scripts/run_server_with_token.sh"
    if [[ -f "$run_script" ]]; then
      nohup bash "$run_script" > /tmp/agent-mail-server.log 2>&1 &
      disown
      sleep 5
    fi
  fi

  if curl -sf "$AGENT_MAIL_HEALTH" &>/dev/null; then
    pass "Agent Mail healthy on :8765"
  else
    warn "Agent Mail not responding"
    warn "Check log: cat /tmp/agent-mail-install.log"
    warn "Manual start: cd mcp_agent_mail && bash scripts/run_server_with_token.sh &"
    return 1
  fi
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

  # Show MCP server commands
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

  total=$((total + 1))
  if bd info &>/dev/null; then
    pass "1/7 Beads running"
    passed=$((passed + 1))
  else
    fail "1/7 Beads not working"
  fi

  total=$((total + 1))
  if bd memories project 2>/dev/null | grep -q .; then
    pass "2/7 Memories populated"
    passed=$((passed + 1))
  else
    warn "2/7 No memories yet (run Phase 5 in Claude Code)"
  fi

  total=$((total + 1))
  if curl -sf "$CHROMADB_HEALTH" &>/dev/null; then
    pass "3/7 ChromaDB healthy"
    passed=$((passed + 1))
  else
    fail "3/7 ChromaDB not responding"
  fi

  total=$((total + 1))
  if curl -sf "$AGENT_MAIL_HEALTH" &>/dev/null; then
    pass "4/7 Agent Mail healthy"
    passed=$((passed + 1))
  else
    warn "4/7 Agent Mail not responding (optional)"
  fi

  total=$((total + 1))
  if command -v claude &>/dev/null && claude mcp list 2>/dev/null | grep -q "chromadb"; then
    pass "5/7 MCP servers connected"
    passed=$((passed + 1))
  else
    warn "5/7 MCP servers not verified (check manually: claude mcp list)"
  fi

  total=$((total + 1))
  if curl -sf "$CHROMADB_HEALTH" &>/dev/null; then
    pass "6/7 ChromaDB accessible (collection check needs Claude Code)"
    passed=$((passed + 1))
  else
    warn "6/7 ChromaDB collection not tested"
  fi

  total=$((total + 1))
  if bd prime &>/dev/null; then
    pass "7/7 bd prime works"
    passed=$((passed + 1))
  else
    warn "7/7 bd prime returned no output"
  fi

  echo ""
  echo "═══ Results: $passed/$total checks passed ═══"

  if [[ $passed -lt 4 ]]; then
    return 1
  fi
}

# ─────────────────────────────────────────────
# Cleanup
# ─────────────────────────────────────────────
cleanup() {
  rm -f "$PHASE_LOG" 2>/dev/null
  # Keep FULL_LOG for debugging: /tmp/bootstrap-full-$$.log
}
trap cleanup EXIT

# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
echo "╔══════════════════════════════════════════╗"
echo "║   Autonomous Dev Environment Bootstrap   ║"
echo "║   CLAUDE.md v8.0 — Phases 0-6           ║"
echo "╚══════════════════════════════════════════╝"

# Phase 0 runs directly (can exit 1 if prereqs missing)
if [[ "$START_PHASE" -le 0 ]]; then
  phase_0 || { fail "Prerequisites check failed. Cannot continue."; exit 1; }
fi

# Remaining phases use the runner (timeout + logging + bug reporting)
for phase in $(seq "$(( START_PHASE > 1 ? START_PHASE : 1 ))" 6); do
  run_phase "$phase"
done

echo ""
echo "═══ Bootstrap Complete ═══"
info "Full log saved to: $FULL_LOG"
echo "Next: Open Claude Code in your project directory"
echo "The SessionStart hook will run 'bd prime' automatically"
