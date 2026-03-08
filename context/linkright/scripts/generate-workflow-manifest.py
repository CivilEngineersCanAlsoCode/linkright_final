#!/usr/bin/env python3
"""
Workflow Manifest Generator
Scans _lr/*/workflows/ and generates workflow-manifest.csv
"""

import os
import csv
import json
from pathlib import Path
from datetime import datetime

def find_workflows(root_dir):
    """Recursively find all workflow directories"""
    workflows = []
    
    lr_path = Path(root_dir) / "context/linkright/_lr"
    
    for module_dir in lr_path.glob("*/"):
        workflows_dir = module_dir / "workflows"
        if not workflows_dir.exists():
            continue
            
        for workflow_dir in workflows_dir.glob("*/"):
            if not workflow_dir.is_dir():
                continue
                
            workflow_name = workflow_dir.name
            module_name = module_dir.name
            relative_path = f"_lr/{module_name}/workflows/{workflow_name}"
            
            # Check for workflow.yaml
            workflow_yaml = workflow_dir / "workflow.yaml"
            if not workflow_yaml.exists():
                continue
                
            workflows.append({
                'id': f"wf-{len(workflows)+1:03d}",
                'name': workflow_name,
                'module': module_name,
                'path': relative_path,
                'status': 'active',
                'created_date': datetime.now().strftime('%Y-%m-%d'),
                'description': f"{workflow_name} workflow"
            })
    
    return sorted(workflows, key=lambda x: x['name'])

def generate_manifest(root_dir, output_file):
    """Generate manifest CSV"""
    workflows = find_workflows(root_dir)
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(
            f,
            fieldnames=['id', 'name', 'module', 'path', 'status', 'created_date', 'description']
        )
        writer.writeheader()
        writer.writerows(workflows)
    
    return workflows

if __name__ == '__main__':
    root = os.getcwd()
    output = "context/linkright/_lr/_config/workflow-manifest.csv"
    
    workflows = generate_manifest(root, output)
    print(f"✓ Generated manifest with {len(workflows)} workflows")
    print(f"✓ Saved to: {output}")
    
    # Print summary
    by_module = {}
    for wf in workflows:
        module = wf['module']
        by_module[module] = by_module.get(module, 0) + 1
    
    print("\nWorkflows by module:")
    for module, count in sorted(by_module.items()):
        print(f"  {module}: {count}")
