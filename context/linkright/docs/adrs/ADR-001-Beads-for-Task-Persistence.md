# ADR-001: Beads for Task Persistence

**Status:** Accepted
**Date:** 2026-03-09
**Decision Maker:** Satvik Jain (single-user developer)
**Category:** State Management

---

## Context

Linkright requires persistent task tracking across multi-day agentic workflows:
- Workflows may run for hours or days without human intervention
- If interrupted (network failure, timeout, crash), must resume from last checkpoint
- Must track 100+ sub-tasks per workflow with dependency relationships
- Must integrate with agent coordination (Beads issue tracking agent state)

**Constraints:**
- Single-user system (no team/permission overhead needed)
- Self-hosted (avoid SaaS dependency)
- Git-native (all state persisted to Git/GitHub)
- Fast lookups (<100ms for "what's next?" queries)

---

## Decision

**Use Beads (Dolt-backed Git-native task tracker) as the authoritative source of truth for:**
- Workflow execution state (which tasks complete, in-progress, blocked)
- Task dependencies (which task blocks which)
- Agent assignments and handoffs
- Completion evidence (what proves a task is done?)

---

## Alternatives Considered

### Option 1: Pure File-Based State (YAML in output folder)

**Approach:** Save task status in YAML files in the workflow's output folder
```
_output/
  workflow-state.yaml  # { tasks: { step-01: done, step-02: in_progress, ... } }
  workflow-deps.yaml   # { step-02: [step-01], ... }
```

**Pros:**
- ✅ Zero external dependency
- ✅ Simple, easy to debug (human-readable YAML)
- ✅ Fast to write/read
- ✅ Works offline

**Cons:**
- ❌ No dependency tracking (no built-in DAG solver)
- ❌ No multi-agent coordination (agent A can't see agent B's progress)
- ❌ No Git audit trail (YAML changes aren't committed)
- ❌ No built-in resumption logic
- ❌ Manual conflict resolution if multiple agents run in parallel
- ❌ Risk of race conditions (two agents writing simultaneously)

**Why Rejected:** Lacks dependency tracking and multi-agent coordination

---

### Option 2: Redis (In-Memory Fast Storage)

**Approach:** Store task state in Redis, replicate to Git on workflow complete

**Pros:**
- ✅ Ultra-fast (<1ms) reads/writes
- ✅ Atomic operations (prevents race conditions)
- ✅ Can run in-memory (no DB setup)

**Cons:**
- ❌ Volatile (all state lost on restart)
- ❌ Requires separate Redis process to manage
- ❌ No Git integration (manual sync needed)
- ❌ Licensing complexity (Redis vs alternatives)
- ❌ Overkill for single-user system

**Why Rejected:** Volatility and separate process management; Satvik prefers Git-backed tools

---

### Option 3: PostgreSQL/MySQL (Traditional Database)

**Approach:** Relational DB with schema for tasks, dependencies, agents

**Schema:**
```sql
CREATE TABLE beads_issues (
  id BIGINT PRIMARY KEY,
  title VARCHAR,
  status VARCHAR,  -- open, in_progress, done
  created_ts TIMESTAMP,
  parent_id BIGINT REFERENCES beads_issues(id)
);

CREATE TABLE beads_dependencies (
  blocked_id BIGINT REFERENCES beads_issues(id),
  blocking_id BIGINT REFERENCES beads_issues(id)
);
```

**Pros:**
- ✅ Mature, reliable (decades of database research)
- ✅ Complex queries easy (JOIN for dependencies)
- ✅ ACID guarantees (prevents corruption)
- ✅ Can scale to millions of tasks

**Cons:**
- ❌ Heavyweight for single-user (Postgres takes 100MB+)
- ❌ Requires database expertise (schema design, backups, migrations)
- ❌ No Git integration (state not in version control)
- ❌ Licensing complexity (PostgreSQL is open, MySQL variant issues)
- ❌ Backup/restore complexity
- ❌ Overkill for 100 tasks

**Why Rejected:** Over-engineered for single-user; no Git integration

---

## Rationale: Why Beads

**Beads is purpose-built for exactly this use case:**

1. **Git-Native:** All state lives in Git (DoltHub + GitHub). Every task close is a Git commit with full history.
   ```bash
   git log --oneline  # See every task state change with commit message
   git show <hash>    # See exactly what evidence was provided for closure
   ```

2. **Multi-Agent Coordination:** Built-in message routing and contact negotiation.
   - Agent A can see "Agent B's task is blocked by my task" and proactively unblock
   - Beads issue = shared source of truth across agents

3. **Dependency Tracking:** DAG-based dependencies prevent circular blocking
   ```bash
   bd dep tree <epic>  # Verify no circular dependencies
   ```

4. **Persistent Memory:** State survives crashes/restarts (it's in Git)

5. **Single-User Optimized:** Designed for solo developers + optional multi-agent coordination
   - No permission/ACL overhead
   - No team features (not needed)
   - Fast command-line interface

6. **Audit Trail:** Evidence attached to every closure
   ```bash
   bd show <task-id>  # See what evidence proves completion
   ```

---

## Consequences

### Positive

+ ✅ **Full auditability:** 6 months later, review exact task closures with evidence
+ ✅ **Git history:** `git log` shows task lifecycle + evidence
+ ✅ **Multi-agent ready:** Other agents can coordinate via Beads messages
+ ✅ **Dependency-aware:** Can block/unblock automatically
+ ✅ **Resumable workflows:** Checkpoint state stored in Beads (with MongoDB for details)
+ ✅ **Learning:** Can review past decisions and adapt

### Negative

- ⚠️ **Learning curve:** Beads CLI has different commands than traditional task managers
- ⚠️ **Dolt setup:** Requires Dolt server (though lightweight)
- ⚠️ **Command-line only:** No web UI (mitigated by clear CLI docs)
- ⚠️ **Dependency on GitHub:** Beads syncs to DoltHub (not a problem for Satvik's workflow)

---

## Decision Maker Notes

This is a **subjective choice reflecting Satvik's tool preferences**, not an objective "best" solution.

Satvik prefers:
1. Git-backed state (everything versioned)
2. Single-user optimized (no team overhead)
3. Open-source (no licensing surprises)
4. Command-line native (integrates with editor/shell workflow)

For a team environment, PostgreSQL would likely win. For a SaaS product, Redis might win. For solo developer agentic workflows, **Beads is ideal.**

---

## Compliance

- ✅ Integrates with Agent MCP Mail for multi-agent coordination
- ✅ Supports Evidence collection (each close includes proof)
- ✅ Supports Beads-wired workflows (step-01b checks bd list for resumption)
- ✅ Syncs to Git for audit trail
- ✅ Scales to Release 4+ without rearchitecture

---

## Related Decisions

- ADR-009: Beads-Aware Workflows (how step-01b uses Beads for resumption)
- ADR-003: Agent Mail (multi-agent coordination protocol)
