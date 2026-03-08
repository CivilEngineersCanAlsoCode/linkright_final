#!/bin/bash

# Linkright Stub Installer
# Generates 760+ command stubs (40 agents/workflows * 19 IDEs)

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
CONFIG_DIR="${BASE_DIR}/_lr/_config"
IDES_DIR="${CONFIG_DIR}/ides"
MANIFESTS_DIR="${CONFIG_DIR}/manifests"

echo "🚀 Linkright Stub Installer: Generating 760+ command stubs..."

# 1. Read IDEs from manifest.yaml
IDES=($(grep -- "- " "${CONFIG_DIR}/manifest.yaml" | sed 's/- //g' | awk '{print $1}'))

# 2. Read Agents and Workflows
AGENTS=($(tail -n +2 "${MANIFESTS_DIR}/agent-manifest.csv" | cut -d',' -f1 | tr -d '"'))
WORKFLOWS=($(tail -n +2 "${MANIFESTS_DIR}/workflow-manifest.csv" | cut -d',' -f1 | tr -d '"'))

# 3. Create IDE folders in the project root if they don't exist
for ide in "${IDES[@]}"; do
    mkdir -p "${BASE_DIR}/.lr-commands/${ide}"
    
    # 4. Generate Agent Stubs
    for agent in "${AGENTS[@]}"; do
        STUB_FILE="${BASE_DIR}/.lr-commands/${ide}/${agent}.sh"
        echo "#!/bin/bash" > "$STUB_FILE"
        echo "echo \"Activating Linkright Agent: ${agent} in ${ide}...\"" >> "$STUB_FILE"
        echo "antigravity activate ${agent} --ide ${ide}" >> "$STUB_FILE"
        chmod +x "$STUB_FILE"
    done

    # 5. Generate Workflow Stubs
    for wf in "${WORKFLOWS[@]}"; do
        STUB_FILE="${BASE_DIR}/.lr-commands/${ide}/${wf}.sh"
        echo "#!/bin/bash" > "$STUB_FILE"
        echo "echo \"Executing Linkright Workflow: ${wf} in ${ide}...\"" >> "$STUB_FILE"
        echo "antigravity run ${wf} --ide ${ide}" >> "$STUB_FILE"
        chmod +x "$STUB_FILE"
    done
done

echo "✅ Success: 760+ stubs generated in .lr-commands/"
