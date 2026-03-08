#!/bin/bash
# Manifest Validation Script for Linkright
# Validates all 5 CSV manifests for data integrity, cross-references, and completeness

set -e

PROJECT_ROOT="/Users/satvikjain/Downloads/sync/context/linkright/_lr"
CONFIG_DIR="$PROJECT_ROOT/_config"
ERRORS=0
WARNINGS=0

echo "════════════════════════════════════════════════════════════════════"
echo "🔍 LINKRIGHT MANIFEST VALIDATION"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Manifest files to validate
declare -a MANIFESTS=(
  "$CONFIG_DIR/agent-manifest.csv:agents"
  "$CONFIG_DIR/workflow-manifest.csv:workflows"
  "$CONFIG_DIR/task-manifest.csv:tasks"
  "$CONFIG_DIR/files-manifest.csv:files"
  "$CONFIG_DIR/lr-help.csv:help-topics"
)

# Validation function
validate_manifest() {
  local manifest=$1
  local type=$2

  if [ ! -f "$manifest" ]; then
    echo -e "${RED}❌ MISSING: $manifest${NC}"
    ((ERRORS++))
    return 1
  fi

  echo "📋 Validating: $(basename $manifest) ($type)"

  # Check if file is empty
  if [ ! -s "$manifest" ]; then
    echo -e "${RED}❌   File is empty${NC}"
    ((ERRORS++))
    return 1
  fi

  # Get line count
  local lines=$(wc -l < "$manifest")
  echo "   Lines: $lines"

  # Check for duplicate IDs (first column)
  local duplicates=$(awk -F, 'NR>1 {print $1}' "$manifest" | sort | uniq -d)
  if [ ! -z "$duplicates" ]; then
    echo -e "${RED}❌   Duplicate IDs found:${NC}"
    echo "$duplicates" | sed 's/^/     /'
    ((ERRORS++))
  else
    echo -e "${GREEN}✅   No duplicate IDs${NC}"
  fi

  # Check for broken file references (if applicable)
  if [[ "$type" == "files" ]]; then
    local broken=0
    while IFS= read -r line; do
      [ "$line" = "$(head -1 "$manifest")" ] && continue  # Skip header
      local file_path=$(echo "$line" | awk -F, '{print $3}')
      if [ ! -z "$file_path" ] && [ ! -f "$PROJECT_ROOT/$file_path" ]; then
        if [ $broken -eq 0 ]; then
          echo -e "${YELLOW}⚠️   Broken file references:${NC}"
        fi
        echo "     Missing: $file_path"
        ((WARNINGS++))
        ((broken++))
      fi
    done < "$manifest"

    if [ $broken -eq 0 ]; then
      echo -e "${GREEN}✅   All file references valid${NC}"
    fi
  fi

  echo ""
}

# Validate each manifest
for manifest_spec in "${MANIFESTS[@]}"; do
  IFS=: read manifest type <<< "$manifest_spec"
  validate_manifest "$manifest" "$type"
done

# Cross-reference validation
echo "════════════════════════════════════════════════════════════════════"
echo "🔗 CROSS-REFERENCE VALIDATION"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Check if workflow-manifest references exist in actual workflows
echo "📋 Checking workflow references..."
while IFS= read -r line; do
  [ "$line" = "$(head -1 "$CONFIG_DIR/workflow-manifest.csv")" ] && continue
  local workflow_path=$(echo "$line" | awk -F, '{print $4}')
  if [ ! -z "$workflow_path" ] && [ ! -d "$PROJECT_ROOT/$workflow_path" ]; then
    echo -e "${YELLOW}⚠️   Missing workflow directory: $workflow_path${NC}"
    ((WARNINGS++))
  fi
done < "$CONFIG_DIR/workflow-manifest.csv"
echo -e "${GREEN}✅   Workflow directory check complete${NC}"
echo ""

# Summary
echo "════════════════════════════════════════════════════════════════════"
echo "📊 VALIDATION SUMMARY"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Manifests validated${NC}"
echo -e "   Errors: ${RED}$ERRORS${NC}"
echo -e "   Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ VALIDATION PASSED${NC}"
  exit 0
else
  echo -e "${RED}❌ VALIDATION FAILED${NC}"
  exit 1
fi
