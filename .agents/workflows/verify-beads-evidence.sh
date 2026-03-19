#!/bin/bash
# Enforce EVIDENCE mandatory for all bd close operations
# This pre-commit hook prevents closing Beads issues without documented evidence
# Usage: Automatically triggered by Beads config when running `bd close`

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if this is a bd close command
if [[ "$@" == *"bd close"* ]]; then
  # Extract the notes field if it exists
  notes_section="$@"

  # Check for EVIDENCE marker
  if [[ "$notes_section" == *"EVIDENCE:"* ]] || [[ "$notes_section" == *"EVIDENCE :"* ]]; then
    # Evidence found, allow the close
    exit 0
  else
    # No evidence found
    echo -e "${RED}❌ ERROR: bd close requires mandatory EVIDENCE section${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  bd update <id> --notes=\""
    echo "EVIDENCE:"
    echo "- Input: [describe what inputs were used]"
    echo "- Operation: [what was done in this step]"
    echo "- Output: [where output file(s) are stored]"
    echo "- Metrics: [which success metrics were satisfied]"
    echo "- Files modified: [list of file paths changed]"
    echo "- Test results: [if applicable, paste test output]"
    echo "\" && bd close <id>"
    echo ""
    echo -e "${YELLOW}Example:${NC}"
    echo "  bd update sync-qm-p0-1 --notes=\"EVIDENCE:"
    echo "- Input: 22 workflows scanned from _lr/"
    echo "- Operation: Enhanced CSV with 6 new columns"
    echo "- Output: _config/workflow-manifest.csv"
    echo "- Metrics: All 22 workflows listed, no duplicates, phase coverage accurate"
    echo "- Files modified: workflow-manifest.csv"
    echo "\" && bd close sync-qm-p0-1"
    echo ""
    exit 1
  fi
fi

# If not a bd close command, allow it through
exit 0
