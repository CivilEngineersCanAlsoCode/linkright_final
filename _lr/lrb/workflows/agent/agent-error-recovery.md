# Agent Error Recovery & Fault Tolerance

## Overview

The Linkright multi-agent system is designed for "Ocean-Calm" reliability. This protocol defines how agents handle failures, retries, and escalations.

## Error Taxonomy

### 1. Transient Failures (L1)

- **Examples**: Cloud API timeouts, transient network issues, rate limits.
- **Recovery**: Automatic retry with exponential backoff (max 3 retries).
- **Action**: Log warning to `error_logs` but do not block the task.

### 2. Logic Failures (L2)

- **Examples**: Schema validation failure, low semantic confidence, layout overflow.
- **Recovery**: Recursive iteration or loop back to previous agent.
- **Action**: `sync-sizer` (Layout) → `sync-refiner` (Rewrite). Task remains `in_progress`.

### 3. Critical Failures (L3)

- **Examples**: Missing mandatory data, authentication failure, persistent layout budget breach.
- **Recovery**: Escalate to user for manual intervention.
- **Action**: Mark Beads task as `blocked`. Add `reason: manual-review-required` with a clear recovery prompt.

## Recovery Patterns

### The "Sizer Loop" (Validation)

If a layout check fails (`L2`):

1.  `sync-sizer` identifies the specific line/block causing the overflow.
2.  `sync-sizer` updates the Beads task with specific "Trim Instructions."
3.  The task is routed back to `sync-refiner`.
4.  `sync-refiner` applies aggressive trimming and resubmits to `sync-sizer`.

### The "Gap Escalation" (Inquiry)

If alignment score is too low:

1.  `sync-linker` identifies a "Critical Gap."
2.  `sync-linker` triggers a "Blocking Interview" task in Beads.
3.  `sync-inquisitor` is activated to fill the gap.
4.  Only after the gap is filled (or acknowledged as empty) does the workflow continue.

## Escalation Guidelines

- **Clarity First**: When escalating to a human, provide the exact error, the reason for the failure, and 2-3 suggested actions (Retry/Skip/Cancel).
- **No Infinite Loops**: Cap recursive loops (e.g., Sizer/Refiner) at 3 iterations before hard escalation.
- **Safe Exit**: Ensure `bd sync` is called even during failure to prevent state loss.
