#!/usr/bin/env bash
# bootstrap.sh — Full autonomous dev environment setup
# Based on setup/setup.md v8.0 Sections 16-20
#
# Usage: ./setup/bootstrap.sh [--phase N] [--no-report] [--skip-preflight]
#   --phase N         Resume from phase N (0-6)
#   --no-report       Skip bug reporting prompts
#   --skip-preflight  Skip pre-flight installer (Xcode CLT, Homebrew, etc.)
#
# Phases:
#   preflight: Auto-install Xcode CLT, Homebrew, node, python, uv, dolt, git identity
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
#   with full diagnostics. If beads is working, also creates a beads
#   bug issue for local tracking.

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
CHROMADB_HEALTH="http://localhost:8000/api/v2/heartbeat"  # Direct ChromaDB port
PHASE_TIMEOUT_DEFAULT=120  # seconds per phase max (for lightweight phases)
# Install-heavy phases (1=Beads, 2=ChromaDB, 3=Agent Mail) get no timeout
# because npm install, docker pull, and git clone can take minutes.
# Phases 4-6 (permissions, seed, verify) are fast and keep the timeout.
declare -A PHASE_TIMEOUTS=( [1]=0 [2]=0 [3]=0 [4]=120 [5]=120 [6]=120 )
START_PHASE=0
SKIP_PREFLIGHT=false
BUG_REPORT_ENABLED=true
PHASE_LOG="/tmp/bootstrap-phase-$$.log"
FULL_LOG="/tmp/bootstrap-full-$$.log"

# Pinned working versions — update these after testing new versions
BD_MIN_VERSION="0.59.0"       # bd (Go) — minimum version with memory features
CHROMADB_IMAGE="chromadb/chroma:latest"  # ChromaDB Docker image

# Dolt server port range: 13400-13599 (200 ports for different projects)
DOLT_PORT_BASE=13400
DOLT_PORT_RANGE=200

# Capability flags — set during Phase 0, used by later phases
DOCKER_AVAILABLE=false
UV_AVAILABLE=false
GH_AVAILABLE=false

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

# Portable sed in-place edit (macOS uses -i '', Linux uses -i)
sedi() {
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# ─────────────────────────────────────────────
# Dolt port allocation (deterministic per project)
# ─────────────────────────────────────────────
# Each project gets a unique port based on its directory name hash.
# Range: DOLT_PORT_BASE to DOLT_PORT_BASE+DOLT_PORT_RANGE (13400-13599)
# This prevents port conflicts when multiple projects run dolt servers.
#
# Port mapping (deterministic — same project always gets same port):
#   project_name → hash → port in [13400, 13599]
#
# To see your project's port: grep "port:" .beads/dolt/config.yaml
# To see all active dolt ports: lsof -i -P | grep dolt | grep LISTEN

allocate_dolt_port() {
  local project_name="$1"
  # Generate deterministic port from project name using cksum (portable)
  local hash_val
  hash_val=$(echo -n "$project_name" | cksum | awk '{print $1}')
  local port=$(( DOLT_PORT_BASE + (hash_val % DOLT_PORT_RANGE) ))

  # Check if port is in use by ANOTHER process (not our own dolt)
  if lsof -i :"$port" &>/dev/null; then
    local port_user
    port_user=$(lsof -i :"$port" -t 2>/dev/null | head -1)
    local port_cmd
    port_cmd=$(ps -p "$port_user" -o comm= 2>/dev/null || echo "unknown")

    if [[ "$port_cmd" == *"dolt"* ]]; then
      # Our dolt is already running on this port — that's fine
      info "Dolt already running on port $port (PID $port_user)"
    else
      # Conflict! Try next ports until we find a free one
      warn "Port $port in use by $port_cmd — scanning for free port..."
      local offset=1
      while [[ $offset -lt $DOLT_PORT_RANGE ]]; do
        local try_port=$(( DOLT_PORT_BASE + ((hash_val + offset) % DOLT_PORT_RANGE) ))
        if ! lsof -i :"$try_port" &>/dev/null; then
          port=$try_port
          info "Found free port: $port"
          break
        fi
        offset=$((offset + 1))
      done
    fi
  fi

  echo "$port"
}

# ─────────────────────────────────────────────
# Parse args
# ─────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --phase) START_PHASE="$2"; shift 2 ;;
    --no-report) BUG_REPORT_ENABLED=false; shift ;;
    --skip-preflight) SKIP_PREFLIGHT=true; shift ;;
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
# Beads bug reporter (local tracking)
# ─────────────────────────────────────────────
report_beads_bug() {
  local phase_num="$1"
  local phase_name="$2"
  local error_summary="$3"

  # Only if bd is working
  if ! bd info &>/dev/null 2>&1; then
    return 0
  fi

  # Create bug in beads for local tracking
  bd create --type=bug \
    --title="[setup] Phase $phase_num ($phase_name) failed: $error_summary" \
    --description="Auto-detected during bootstrap.sh run. Error: $error_summary" \
    -p 1 --label auto-detected 2>/dev/null || true
}

# ─────────────────────────────────────────────
# Bug reporter (GitHub + beads)
# ─────────────────────────────────────────────
report_bug() {
  local phase_num="$1"
  local phase_name="$2"
  local exit_code="$3"
  local phase_output
  phase_output=$(tail -80 "$PHASE_LOG" 2>/dev/null || echo "(no log captured)")

  local fingerprint
  fingerprint=$(make_fingerprint "$phase_num" "$phase_output")

  # Extract first error line for beads bug title
  local error_summary
  error_summary=$(echo "$phase_output" | grep -iE '✗|error|fail' | head -1 | cut -c1-80)
  [[ -z "$error_summary" ]] && error_summary="exit code $exit_code"

  # Always try beads bug (silent, local tracking)
  report_beads_bug "$phase_num" "$phase_name" "$error_summary"

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

  # Per-phase timeout: install-heavy phases (1,2,3) get 0 = no timeout
  local timeout=${PHASE_TIMEOUTS[$phase_num]:-$PHASE_TIMEOUT_DEFAULT}

  # Clear phase log for this phase
  > "$PHASE_LOG"

  local exit_code=0

  # Run phase in its own process group (set -m) so we can clean up all children
  # NOTE: Exit code from process substitution (> >(...)) can be unreliable in bash.
  # This is acceptable because run_phase always returns 0 (continues to next phase).
  # The exit code is only used for bug reporting, not flow control.
  set -m 2>/dev/null || true  # enable job control for process groups
  "phase_$phase_num" > >(while IFS= read -r line; do echo "$line"; echo "$line" >> "$PHASE_LOG"; echo "$line" >> "$FULL_LOG"; done) 2>&1 &
  local pid=$!

  if [[ $timeout -eq 0 ]]; then
    # No timeout — just wait for completion (install phases can take minutes)
    wait "$pid" 2>/dev/null
    exit_code=$?
  else
    # Wait with timeout
    local waited=0
    while kill -0 "$pid" 2>/dev/null && [[ $waited -lt $timeout ]]; do
      sleep 1
      waited=$((waited + 1))
    done

    if kill -0 "$pid" 2>/dev/null; then
      # Phase timed out — kill the entire process group
      kill -- -"$pid" 2>/dev/null || kill "$pid" 2>/dev/null
      wait "$pid" 2>/dev/null
      exit_code=124
      local msg="Phase $phase_num TIMED OUT after ${timeout}s (likely a blocking process)"
      fail "$msg"
      echo "$msg" >> "$PHASE_LOG"
      echo "$msg" >> "$FULL_LOG"
    else
      wait "$pid" 2>/dev/null
      exit_code=$?
    fi
  fi

  set +m 2>/dev/null || true  # restore job control state

  # Report if failed
  if [[ $exit_code -ne 0 ]]; then
    report_bug "$phase_num" "$phase_name" "$exit_code"
    warn "Phase $phase_num ($phase_name) had issues — continuing to next phase"
  fi

  return 0  # always continue to next phase
}

# ─────────────────────────────────────────────
# Beads recovery: handles stale .beads, circuit
# breaker, orphan dolt servers, and corrupt state
# ─────────────────────────────────────────────
kill_orphan_dolt_servers() {
  # Kill any dolt sql-server processes in this repo's .beads/dolt directory
  local beads_dolt_dir
  beads_dolt_dir="$(pwd)/.beads/dolt"
  # Find dolt processes serving this specific data dir
  local pids
  pids=$(ps aux 2>/dev/null | grep "[d]olt sql-server" | grep "$beads_dolt_dir" | awk '{print $2}' || true)
  if [[ -n "$pids" ]]; then
    info "Killing orphan dolt server(s): $pids"
    echo "$pids" | xargs kill 2>/dev/null || true
    sleep 2
    # Force kill if still alive
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
  fi

  # Also check by PID file
  if [[ -f ".beads/dolt-server.pid" ]]; then
    local pid_from_file
    pid_from_file=$(cat ".beads/dolt-server.pid" 2>/dev/null || echo "")
    if [[ -n "$pid_from_file" ]] && kill -0 "$pid_from_file" 2>/dev/null; then
      info "Killing dolt server from PID file: $pid_from_file"
      kill "$pid_from_file" 2>/dev/null || true
      sleep 2
      kill -9 "$pid_from_file" 2>/dev/null || true
    fi
  fi
}

wait_circuit_breaker_cooldown() {
  info "Waiting 7s for circuit breaker cooldown..."
  sleep 7
}

verify_beads_health() {
  # Returns 0 if bd info works, 1 otherwise
  bd info &>/dev/null 2>&1
}

recover_beads() {
  # Full recovery sequence for broken .beads state
  # Called when .beads/ exists but bd info fails
  local attempt=0
  local max_attempts=2

  while [[ $attempt -lt $max_attempts ]]; do
    attempt=$((attempt + 1))
    info "Recovery attempt $attempt/$max_attempts..."

    # Step 1: Stop any dolt server managed by bd
    if command -v bd &>/dev/null; then
      bd dolt stop 2>/dev/null || true
    fi

    # Step 2: Kill any orphan dolt processes for this repo
    kill_orphan_dolt_servers

    # Step 3: Wait for circuit breaker to reset
    wait_circuit_breaker_cooldown

    # Step 4: Try bd info again (maybe server was the only issue)
    if verify_beads_health; then
      pass "Recovery successful (attempt $attempt) — dolt restart fixed it"
      return 0
    fi

    # Step 5: If still broken, nuke .beads/ and re-init
    info "bd info still failing — removing corrupt .beads/ for clean re-init"
    rm -rf .beads 2>/dev/null

    # Step 6: Wait again (circuit breaker may still be tripped in bd process)
    wait_circuit_breaker_cooldown

    # Step 7: Fresh init
    if bd init 2>&1; then
      # Step 7.5: Fix dolt database name (init creates prefix-named db, default expects "beads")
      local prefix
      prefix=$(basename "$(pwd)")
      bd dolt set database "$prefix" 2>/dev/null || true

      # Step 8: Verify the fresh init actually works
      sleep 2  # give dolt server time to start
      if verify_beads_health; then
        pass "Recovery successful (attempt $attempt) — clean re-init worked"
        return 0
      fi
    fi

    warn "Attempt $attempt failed"
  done

  fail "Beads recovery failed after $max_attempts attempts"
  info "Diagnostics:"
  info "  bd version: $(bd version 2>&1 || echo 'not found')"
  info "  .beads/ exists: $(test -d .beads && echo 'yes' || echo 'no')"
  info "  dolt processes: $(ps aux 2>/dev/null | grep -c '[d]olt sql-server' || echo '0')"
  info "  bd info output: $(bd info 2>&1 | head -3)"
  return 1
}

# ─────────────────────────────────────────────
# Pre-flight: Auto-install prerequisites on fresh Mac
# ─────────────────────────────────────────────
# Handles the "brand new Mac" scenario where nothing is installed.
# Detects Apple shims, installs Homebrew, node, python, uv, dolt,
# and ensures git identity is configured.
# Skip with: --skip-preflight (for machines that already have these)

phase_preflight() {
  echo ""
  echo "═══ Pre-flight: Fresh Mac Setup ═══"

  # ── Step 1: Xcode Command Line Tools ──
  # On fresh Mac, git/clang are Apple shims that trigger a GUI popup.
  # Detect this BEFORE calling git --version to avoid invisible hang.
  if [[ "$(uname)" == "Darwin" ]]; then
    if ! xcode-select -p &>/dev/null; then
      warn "Xcode Command Line Tools not installed"
      info "Installing now — this takes 5-20 minutes on first run..."
      xcode-select --install 2>/dev/null || true
      # Wait for installation to complete (xcode-select -p returns 0 when done)
      info "Waiting for Xcode CLT installation to finish..."
      while ! xcode-select -p &>/dev/null; do
        sleep 10
      done
      pass "Xcode Command Line Tools installed"
    else
      pass "Xcode CLT already installed"
    fi
  fi

  # ── Step 2: Homebrew ──
  if ! command -v brew &>/dev/null; then
    info "Installing Homebrew (package manager)..."
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Add brew to PATH for Apple Silicon
    if [[ -f /opt/homebrew/bin/brew ]]; then
      eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    if command -v brew &>/dev/null; then
      pass "Homebrew installed"
    else
      fail "Homebrew installation failed — install manually: https://brew.sh"
      return 1
    fi
  else
    pass "Homebrew already installed"
  fi

  # ── Step 3: Install missing tools via Homebrew ──
  local brew_packages=()

  if ! command -v node &>/dev/null; then
    brew_packages+=(node)
  fi

  if command -v python3 &>/dev/null; then
    local py_minor
    py_minor=$(python3 -c 'import sys; print(sys.version_info.minor)' 2>/dev/null || echo "0")
    if [[ "$py_minor" -lt 11 ]]; then
      brew_packages+=(python@3.11)
    fi
  else
    brew_packages+=(python@3.11)
  fi

  if ! command -v dolt &>/dev/null; then
    brew_packages+=(dolt)
  fi

  if [[ ${#brew_packages[@]} -gt 0 ]]; then
    info "Installing: ${brew_packages[*]}..."
    HOMEBREW_NO_AUTO_UPDATE=1 brew install "${brew_packages[@]}"
    pass "Installed: ${brew_packages[*]}"
  else
    pass "node, python3.11+, dolt already installed"
  fi

  # ── Step 3b: uv (Python package manager, needed for Agent Mail) ──
  if ! command -v uv &>/dev/null; then
    info "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    # Add to PATH for current session
    export PATH="$HOME/.local/bin:$PATH"
    if command -v uv &>/dev/null; then
      pass "uv installed"
    else
      warn "uv install may need shell restart — continuing"
    fi
  else
    pass "uv already installed"
  fi

  # ── Step 4: Git identity ──
  # Dolt (used by beads) requires git user.name and user.email for commits.
  # Without these, bd init and bd remember will fail with "Author identity unknown".
  local git_name git_email
  git_name=$(git config --global user.name 2>/dev/null || echo "")
  git_email=$(git config --global user.email 2>/dev/null || echo "")

  if [[ -z "$git_name" || -z "$git_email" ]]; then
    warn "Git identity not configured (required for beads/dolt)"
    if [[ -t 0 ]]; then
      # Interactive terminal — prompt user
      if [[ -z "$git_name" ]]; then
        echo -n "  Enter your name for git commits: "
        read -r git_name </dev/tty 2>/dev/null || git_name=""
        if [[ -n "$git_name" ]]; then
          git config --global user.name "$git_name"
        fi
      fi
      if [[ -z "$git_email" ]]; then
        echo -n "  Enter your email for git commits: "
        read -r git_email </dev/tty 2>/dev/null || git_email=""
        if [[ -n "$git_email" ]]; then
          git config --global user.email "$git_email"
        fi
      fi
    fi

    if [[ -z "$(git config --global user.name 2>/dev/null)" ]]; then
      warn "Git user.name still not set — bd init may fail"
      warn "Fix manually: git config --global user.name 'Your Name'"
    else
      pass "Git identity configured: $(git config --global user.name) <$(git config --global user.email)>"
    fi
  else
    pass "Git identity: $git_name <$git_email>"
  fi

  pass "Pre-flight complete"
}

# ─────────────────────────────────────────────
# Phase 0: Prerequisites
# ─────────────────────────────────────────────
phase_0() {
  echo ""
  echo "═══ Phase 0: Prerequisites ═══"
  local ok=true

  # Hard requirements: git, node, python3
  for cmd in git node python3; do
    if command -v "$cmd" &>/dev/null; then
      pass "$cmd: $("$cmd" --version 2>&1 | head -1)"
    else
      fail "$cmd not found"
      ok=false
    fi
  done

  # Soft requirement: Docker (needed for ChromaDB only)
  if command -v docker &>/dev/null; then
    pass "docker: $(docker --version 2>&1 | head -1)"
    if docker ps &>/dev/null; then
      pass "Docker daemon running"
      DOCKER_AVAILABLE=true
    else
      warn "Docker installed but daemon not running — ChromaDB will be skipped"
      warn "Start Docker Desktop and re-run with --phase 2 to set up ChromaDB"
    fi
  else
    warn "Docker not installed — ChromaDB (Phase 2) will be skipped"
    warn "Install Docker Desktop for ChromaDB support"
  fi

  # Check Python version >= 3.11
  if command -v python3 &>/dev/null; then
    local py_ver
    py_ver=$(python3 -c 'import sys; print(f"{sys.version_info.minor}")')
    if [[ "$py_ver" -ge 11 ]]; then
      pass "Python 3.$py_ver (>= 3.11)"
    else
      fail "Python 3.$py_ver (need >= 3.11)"
      ok=false
    fi
  fi

  # Soft requirement: uv (needed for Agent Mail only)
  if command -v uv &>/dev/null; then
    pass "uv: $(uv --version 2>&1)"
    UV_AVAILABLE=true
  else
    warn "uv not found (needed for Agent Mail only)"
  fi

  # Soft requirement: gh CLI (needed for bug reporting only)
  if command -v gh &>/dev/null; then
    pass "gh CLI: $(gh --version 2>&1 | head -1)"
    GH_AVAILABLE=true
  else
    warn "gh CLI not found (used for bug reporting only)"
  fi

  # Dolt is needed for beads server mode (unique port per project)
  if command -v dolt &>/dev/null; then
    pass "dolt: $(dolt version 2>&1 | head -1)"
  else
    warn "dolt not found — beads will run in direct mode (no server)"
    warn "Install dolt: brew install dolt (or see https://docs.dolthub.com/introduction/installation)"
  fi

  if [[ "$ok" == false ]]; then
    fail "Hard prerequisites incomplete (git, node, python3 >= 3.11). Fix above issues and re-run."
    return 1
  fi
  pass "Hard prerequisites met"
  [[ "$DOCKER_AVAILABLE" == false ]] && info "Note: Docker is optional — only ChromaDB requires it"
}

# ─────────────────────────────────────────────
# Phase 1: Beads
# ─────────────────────────────────────────────
phase_1() {
  echo ""
  echo "═══ Phase 1: Beads ═══"

  # Step 1: Ensure bd (Go) is installed — NOT br (Rust)
  if command -v bd &>/dev/null; then
    local bd_ver
    bd_ver=$(bd version 2>&1 || echo "unknown")
    if echo "$bd_ver" | grep -q "br version"; then
      warn "bd is aliased to br (beads_rust) — this lacks memory features!"
      warn "Remove 'alias bd=br' from ~/.zshrc and install bd (Go):"
      warn "  npm install -g @beads/bd"
      return 1
    fi
    pass "bd installed: $bd_ver"
  else
    info "Installing beads (bd Go)..."
    # Prefer npm — gives latest version (v0.59.0+) with memory features
    # IMPORTANT: Do NOT install beads_rust (br) — it lacks remember/memories/prime
    if command -v npm &>/dev/null; then
      # Detect npm EACCES: macOS .pkg Node installs put global modules in /usr/local/lib
      # which requires sudo. Homebrew installs go to /opt/homebrew and don't need sudo.
      if npm install -g @beads/bd 2>&1; then
        : # success
      else
        local npm_err=$?
        if npm install -g @beads/bd 2>&1 | grep -qi "EACCES\|permission denied"; then
          warn "npm global install hit EACCES — trying with sudo..."
          sudo npm install -g @beads/bd
        else
          warn "npm install failed (exit $npm_err) — trying brew fallback"
          command -v brew &>/dev/null && brew install beads
        fi
      fi
    elif command -v brew &>/dev/null; then
      brew install beads
    else
      curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
    fi

    if ! command -v bd &>/dev/null; then
      fail "beads installation failed — bd command not found after install"
      return 1
    fi
    pass "beads installed"
  fi

  # Step 2: Init or verify existing .beads/
  if [[ -d ".beads" ]]; then
    info ".beads/ directory exists — verifying health..."

    if verify_beads_health; then
      pass "Existing .beads/ is healthy"
    else
      # .beads/ exists but is broken — this is the exact scenario that hit us
      warn ".beads/ exists but bd info FAILED — starting recovery"
      local bd_error
      bd_error=$(bd info 2>&1 | head -3)
      info "Error was: $bd_error"

      if recover_beads; then
        pass "Beads recovered successfully"
      else
        fail "Beads recovery failed — cannot proceed"
        return 1
      fi
    fi
  else
    info "No .beads/ found — running bd init..."
    if bd init 2>&1; then
      # Verify init actually produced a working state
      sleep 2  # give dolt server time to start
      if verify_beads_health; then
        pass "bd init complete and verified"
      else
        warn "bd init completed but bd info fails — attempting recovery"
        if recover_beads; then
          pass "Beads recovered after init"
        else
          fail "bd init produced broken state and recovery failed"
          return 1
        fi
      fi
    else
      fail "bd init failed"
      info "Attempting recovery..."
      if recover_beads; then
        pass "Beads recovered after failed init"
      else
        fail "Cannot initialize beads — bd init and recovery both failed"
        return 1
      fi
    fi
  fi

  # Step 3: Allocate unique dolt server port for this project
  # Each project gets a deterministic port based on its name, preventing conflicts
  # when multiple projects (e.g. sync + Antigravity) run simultaneously.
  local project_name
  project_name=$(basename "$(pwd)")
  local dolt_port
  dolt_port=$(allocate_dolt_port "$project_name")
  pass "Dolt port for '$project_name': $dolt_port"

  # Step 4: Configure dolt server with the allocated port
  if [[ -f ".beads/dolt/config.yaml" ]]; then
    # Update port in dolt config.yaml
    sedi "s/port: [0-9]*/port: $dolt_port/" ".beads/dolt/config.yaml"
    pass "Dolt config.yaml updated with port $dolt_port"
  fi
  # Write port file (bd reads this to find the server)
  echo "$dolt_port" > ".beads/dolt-server.port"
  # Set port in metadata.json via bd command
  bd dolt set port "$dolt_port" 2>/dev/null || true

  # Step 5: Fix dolt database name (init creates prefix-named db, default expects "beads")
  bd dolt set database "$project_name" 2>/dev/null || true

  # Step 6: Final verification
  bd info
  pass "Beads ready (dolt port: $dolt_port)"
}

# ─────────────────────────────────────────────
# Phase 2: ChromaDB
# ─────────────────────────────────────────────
phase_2() {
  echo ""
  echo "═══ Phase 2: ChromaDB ═══"

  # Gate: Docker must be available
  if [[ "$DOCKER_AVAILABLE" != true ]]; then
    # Re-check in case user started Docker between phases or --phase 2 was used
    if command -v docker &>/dev/null && docker ps &>/dev/null; then
      DOCKER_AVAILABLE=true
      pass "Docker is now available"
    else
      warn "Docker not available — skipping ChromaDB setup"
      info "Install/start Docker Desktop, then re-run with: ./setup/bootstrap.sh --phase 2"
      return 0  # return 0 = not a failure, just skipped
    fi
  fi

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
    cat > "$CHROMADB_DIR/.env" <<EOF
CHROMA_DATA_PATH=./data
EOF
    pass ".env created"
  else
    warn ".env already exists, skipping"
  fi

  # Start ChromaDB
  info "Starting ChromaDB..."
  if ! (cd "$CHROMADB_DIR" && docker compose up -d 2>&1); then
    fail "docker compose up failed"
    info "Debug: cd $CHROMADB_DIR && docker compose logs"
    return 1
  fi

  # Wait for health
  info "Waiting for ChromaDB health..."
  for i in $(seq 1 20); do
    if curl -sf "$CHROMADB_HEALTH" &>/dev/null; then
      pass "ChromaDB healthy on :8000"
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

  if [[ "$UV_AVAILABLE" != true ]]; then
    # Re-check in case --phase 3 was used after installing uv
    if command -v uv &>/dev/null; then
      UV_AVAILABLE=true
    else
      warn "uv not installed — skipping Agent Mail"
      warn "Install uv (curl -LsSf https://astral.sh/uv/install.sh | sh) and re-run with --phase 3"
      return 0
    fi
  fi

  # Check if already running (correct endpoint)
  if curl -sf "$AGENT_MAIL_HEALTH" &>/dev/null; then
    pass "Agent Mail already running on :8765"
    return 0
  fi

  # Check if already installed (only in HOME — never install inside project repo)
  local AM_DIR=""
  if [[ -d "$HOME/mcp_agent_mail" ]]; then
    AM_DIR="$HOME/mcp_agent_mail"
  fi

  if [[ -z "$AM_DIR" ]]; then
    info "Installing Agent Mail in ~/mcp_agent_mail (not inside project repo)..."
    # --skip-beads: we use bd (Go), NOT br (Rust). Without this flag,
    # the install script adds 'alias bd=br' to .zshrc which masks bd (Go).
    # cd ~ ensures install goes to HOME, not project directory.
    # Run install in background subshell — NEVER let it block
    (cd ~ && curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/mcp_agent_mail/main/scripts/install.sh?$(date +%s)" \
      | bash -s -- --yes --skip-beads > /tmp/agent-mail-install.log 2>&1) &
    local install_pid=$!

    info "Waiting for Agent Mail to come up..."
    for i in $(seq 1 90); do
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

    # Graceful shutdown: SIGTERM first, then wait for cleanup, then SIGKILL only if needed.
    # The installer may be mid-write on the venv — killing it abruptly corrupts the install.
    if kill -0 "$install_pid" 2>/dev/null; then
      info "Install still running — sending graceful shutdown (SIGTERM)..."
      kill "$install_pid" 2>/dev/null
      # Give installer 15s to finish current operation and exit cleanly
      local grace_wait=0
      while kill -0 "$install_pid" 2>/dev/null && [[ $grace_wait -lt 15 ]]; do
        sleep 1
        grace_wait=$((grace_wait + 1))
      done
      # Only force-kill if still alive after grace period
      if kill -0 "$install_pid" 2>/dev/null; then
        warn "Installer didn't exit gracefully — force killing"
        kill -9 "$install_pid" 2>/dev/null
      fi
      wait "$install_pid" 2>/dev/null
    fi

    # Re-check if installed (HOME only)
    if [[ -d "$HOME/mcp_agent_mail" ]]; then
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
    warn "Manual start: cd ~/mcp_agent_mail && bash scripts/run_server_with_token.sh &"
    return 1
  fi

  # DEFENSIVE: Agent Mail install may add 'alias bd=br' to .zshrc even with --skip-beads.
  # This masks bd (Go) which has memory features we need. Remove/comment the alias if found.
  local rc_file="$HOME/.zshrc"
  if [[ -f "$rc_file" ]] && grep -q "^alias bd='br'" "$rc_file"; then
    sedi "s/^alias bd='br'/# alias bd='br'  # DISABLED by bootstrap.sh — using bd (Go)/" "$rc_file"
    warn "Removed 'alias bd=br' from .zshrc (Agent Mail added it, but we use bd Go)"
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
  info "  claude mcp add chromadb -- uvx chroma-mcp --client-type http --host localhost --port 8000"
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
  info "Start Claude Code and run the Bootstrap Procedure (setup/setup.md Section 15)"
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
  local failed_checks=""

  # Check 1: Beads running
  total=$((total + 1))
  if verify_beads_health; then
    pass "1/7 Beads running"
    passed=$((passed + 1))
  else
    fail "1/7 Beads not working"
    failed_checks="${failed_checks}  - Beads: bd info failed\n"
  fi

  # Check 2: Memories populated
  total=$((total + 1))
  if bd memories project 2>/dev/null | grep -q .; then
    pass "2/7 Memories populated"
    passed=$((passed + 1))
  else
    warn "2/7 No memories yet (run Phase 5 in Claude Code)"
  fi

  # Check 3: ChromaDB healthy
  total=$((total + 1))
  if [[ "$DOCKER_AVAILABLE" != true ]]; then
    warn "3/7 ChromaDB skipped (Docker not available)"
  elif curl -sf "$CHROMADB_HEALTH" &>/dev/null; then
    pass "3/7 ChromaDB healthy"
    passed=$((passed + 1))
  else
    fail "3/7 ChromaDB not responding"
    failed_checks="${failed_checks}  - ChromaDB: health check failed\n"
  fi

  # Check 4: Agent Mail healthy
  total=$((total + 1))
  if curl -sf "$AGENT_MAIL_HEALTH" &>/dev/null; then
    pass "4/7 Agent Mail healthy"
    passed=$((passed + 1))
  else
    warn "4/7 Agent Mail not responding (optional)"
  fi

  # Check 5: MCP servers
  total=$((total + 1))
  if command -v claude &>/dev/null && claude mcp list 2>/dev/null | grep -q "chromadb"; then
    pass "5/7 MCP servers connected"
    passed=$((passed + 1))
  else
    warn "5/7 MCP servers not verified (check manually: claude mcp list)"
  fi

  # Check 6: ChromaDB API responds (list collections — deeper than heartbeat)
  total=$((total + 1))
  if [[ "$DOCKER_AVAILABLE" != true ]]; then
    warn "6/7 ChromaDB skipped (Docker not available)"
  elif curl -sf "http://localhost:8000/api/v2/collections" &>/dev/null; then
    pass "6/7 ChromaDB API accessible (collections endpoint)"
    passed=$((passed + 1))
  else
    warn "6/7 ChromaDB API not responding"
  fi

  # Check 7: bd prime
  total=$((total + 1))
  if bd prime &>/dev/null; then
    pass "7/7 bd prime works"
    passed=$((passed + 1))
  else
    warn "7/7 bd prime returned no output"
  fi

  echo ""
  echo "═══ Results: $passed/$total checks passed ═══"

  # Log failed checks summary
  if [[ -n "$failed_checks" ]]; then
    echo ""
    echo -e "Failed checks:\n$failed_checks"
  fi

  # Only fail if hard requirements are broken (beads must work)
  if ! verify_beads_health; then
    return 1
  fi
}

# ─────────────────────────────────────────────
# Cleanup
# ─────────────────────────────────────────────
cleanup() {
  rm -f "$PHASE_LOG" 2>/dev/null
  # Keep FULL_LOG for debugging: /tmp/bootstrap-full-$$.log

  # Kill any child processes spawned by this script (prevents orphan dolt/agent-mail processes)
  # Using process group: kill all processes in our group except ourselves
  local my_pgid
  my_pgid=$(ps -o pgid= -p $$ 2>/dev/null | tr -d ' ')
  if [[ -n "$my_pgid" ]]; then
    # Send SIGTERM to process group (negative PGID), excluding ourselves
    # This catches any backgrounded install processes, health-check loops, etc.
    kill -- -"$my_pgid" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
echo "╔══════════════════════════════════════════╗"
echo "║   Autonomous Dev Environment Bootstrap   ║"
echo "║   setup/setup.md v8.0 — Phases 0-6       ║"
echo "╚══════════════════════════════════════════╝"

# Pre-flight: auto-install Xcode CLT, Homebrew, node, python, dolt, uv, git identity
if [[ "$SKIP_PREFLIGHT" != true && "$START_PHASE" -le 0 ]]; then
  phase_preflight
fi

# Phase 0 runs directly (can exit 1 if hard prereqs missing)
if [[ "$START_PHASE" -le 0 ]]; then
  phase_0 || { fail "Hard prerequisites check failed. Cannot continue."; exit 1; }
fi

# When resuming from a specific phase, re-detect capabilities
if [[ "$START_PHASE" -gt 0 ]]; then
  command -v docker &>/dev/null && docker ps &>/dev/null && DOCKER_AVAILABLE=true
  command -v uv &>/dev/null && UV_AVAILABLE=true
  command -v gh &>/dev/null && GH_AVAILABLE=true
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
