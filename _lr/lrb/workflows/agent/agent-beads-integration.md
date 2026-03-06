# Beads Task Integration for Agents

## Overview

Agents create and manage tasks within the Beads workflow system, enabling coordination, dependency tracking, and asynchronous work execution across the Linkright ecosystem.

## Task Creation

### Creating a Task
```bash
bd create --title="Task description" \
          --description="Why this task exists and what needs to be done" \
          --type=task|feature|bug \
          --priority=0-4
```

### Task Metadata
- **Type**: task (atomic work), feature (new capability), bug (issue fix)
- **Priority**: 0 (critical) to 4 (backlog)
- **Owner**: Automatically assigned to requesting agent
- **Status**: open → in_progress → completed

## Dependency Management

### Creating Dependencies
```bash
bd dep add task-id depends-on-task-id
```

### Dependency Semantics
- Parent task blocks on child completion
- Status propagates: if child fails, parent shows blocked
- Multiple blockers: parent waits for all dependencies

### Workflow Patterns
1. **Sequential Tasks**: Chain tasks with linear dependencies
2. **Parallel Subtasks**: Create independent subtasks for parallel work
3. **Convergence Points**: Merge results from parallel branches

## Task Lifecycle

### Open
- Task created, waiting for assignment
- Can be claimed by agents or users
- Dependencies prevent start if blockers exist

### In Progress
- Actively being worked on
- Status updates track progress
- Dependent tasks remain blocked

### Completed
- Work finished and validated
- Unblocks dependent tasks
- Results available for downstream tasks

## Agent Workflow Coordination

### Multi-Step Processes
1. Agent breaks workflow into subtasks
2. Creates dependency chain
3. Submits first task for processing
4. Monitors completion via `bd ready`
5. Retrieves results when dependencies resolve

### Error Handling
- Failed task blocks dependent work
- Agent reviews failure, updates task notes
- Re-opens task for retry or escalation

### Integration with LRB Workflows
- Agent step can create beads tasks
- Workflow orchestrator coordinates task status
- Results flow back to agent context

## Best Practices

1. **Atomic Tasks**: Keep tasks focused and independent
2. **Clear Descriptions**: Include context for task workers
3. **Realistic Dependencies**: Only create necessary blockers
4. **Progress Tracking**: Update status regularly during execution
5. **Result Documentation**: Capture outputs in task notes

## References

- See `agent-orchestration.md` for workflow routing
- See AGENTS.md for beads command reference
