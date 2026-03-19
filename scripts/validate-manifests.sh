#!/bin/bash
# Manifest Validation Script for Linkright
# Validates all 5 CSV manifests for data integrity, cross-references, and completeness

PROJECT_ROOT="/Users/satvikjain/Downloads/sync/context/linkright/_lr"
CONFIG_DIR="$PROJECT_ROOT/_config"
ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "════════════════════════════════════════════════════════════════════"
echo "🔍 LINKRIGHT MANIFEST VALIDATION"
echo "════════════════════════════════════════════════════════════════════"

# 1. Define Manifests
# format: "path:name:id_col:path_col"
declare -a MANIFESTS=(
  "$PROJECT_ROOT/agent-manifest.csv:agents:1:7"
  "$PROJECT_ROOT/workflow-manifest.csv:workflows:1:3"
  "$CONFIG_DIR/task-manifest.csv:tasks:1:0"
  "$PROJECT_ROOT/files-manifest.csv:files:4:4"
)

validate_manifest() {
  local manifest=$1
  local name=$2
  local id_col=$3
  local path_col=$4

  if [ ! -f "$manifest" ]; then
    echo -e "${RED}❌ MISSING: $name ($manifest)${NC}"
    ((ERRORS++))
    return
  fi

  echo -e "\n📋 Validating: ${GREEN}$name${NC}"
  
  # Duplicate ID check
  local dups=$(grep -v "^#" "$manifest" | awk -F, -v col=$id_col 'NR>1 {print $col}' | sort | uniq -d)
  if [ ! -z "$dups" ]; then
    echo -e "${RED}❌   Duplicate entries found in column $id_col:${NC}"
    echo "$dups" | sed 's/^/     /'
    ((ERRORS++))
  else
    echo -e "${GREEN}✅   No duplicate entries${NC}"
  fi

  # Broken reference check
  if [ "$path_col" -gt 0 ]; then
    local broken=0
    while IFS=, read -r row; do
      # Skip header and comments
      [[ "$row" == *"workflow_name"* || "$row" == *"agent_id"* || "$row" == *"file_id"* || "$row" == *"task_id"* || "$row" == *"type,name"* || "$row" == "#"* || -z "$row" ]] && continue
      
      local fpath=$(echo "$row" | awk -v col=$path_col -F, '{print $col}')
      # Clean fpath (remove leading _lr/ if present)
      local clean_path=${fpath#_lr/}
      
      if [ ! -z "$clean_path" ] && [ ! -f "$PROJECT_ROOT/$clean_path" ] && [ ! -d "$PROJECT_ROOT/$clean_path" ]; then
        if [ $broken -eq 0 ]; then echo -e "${RED}❌   Broken References:${NC}"; fi
        echo "     Missing: $clean_path (from column $path_col)"
        ((broken++))
        ((ERRORS++))
      fi
    done < "$manifest"

    if [ $broken -eq 0 ]; then
      echo -e "${GREEN}✅   All file references valid${NC}"
    fi
  fi
}

for m in "${MANIFESTS[@]}"; do
  IFS=: read path name id_c path_c <<< "$m"
  validate_manifest "$path" "$name" "$id_c" "$path_c"
done

echo -e "\n════════════════════════════════════════════════════════════════════"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ VALIDATION PASSED (0 Errors)${NC}"
  exit 0
else
  echo -e "${RED}❌ VALIDATION FAILED ($ERRORS Errors)${NC}"
  exit 1
fi
