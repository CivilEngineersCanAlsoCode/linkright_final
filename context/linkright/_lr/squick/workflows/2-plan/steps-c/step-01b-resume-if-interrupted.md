---
stepNumber: "01b"
title: "Resume Interrupted Session"
phase: "Initialization"
---

# Step 01b: Resume Interrupted Session

**ONE SENTENCE:** Check Beads for interrupted workflow and resume or start fresh.

## MANDATORY EXECUTION RULES

- 🛑 NEVER start fresh if session in progress
- ✅ ALWAYS check Beads first
- 💾 Load previous state from Beads if resuming
- 📋 YOU ARE RESUMING, not initializing new

## INPUT

- Workflow epic ID: `sync-zas.wm-10`
- Workflow name: `2-plan`
- User decision: continue or fresh start

## PROCESSING

### 1. Check for Existing Beads Issue

```bash
bd list --status=in_progress \
  --parent=sync-zas.wm-10 \
  --query="2-plan" \
  --limit=1
```

**If issue found:**
- Display: issue ID, title, completed steps, last update time
- Ask user: "Continue this session [1] or start fresh [2]?"

**If user [1] - Continue:**
- Load: `bd show <issue-id>` to get metadata
- Extract: `last_completed_step` from metadata
- Load: `step-[N+1]-[name].md` (next step)
- Load: `session_variables` from metadata (context variables)
- Proceed with next step

**If user [2] - Start Fresh:**
- Create new Beads feature (in step-01-setup.md)
- Load: `step-01-session-setup.md`
- Fresh initialization

**If no issue found:**
- Load: `step-01-session-setup.md`
- Fresh initialization

## OUTPUT

- Decision: continue existing or start fresh
- Session state loaded (if continuing)
- Next step file loaded and ready

## SUCCESS METRICS

✅ Correctly identified if issue exists
✅ Retrieved metadata from Beads
✅ User confirmed continue or fresh
✅ Loaded correct next step

## FAILURE ANTI-METRICS

❌ Beads list command failed
❌ No decision from user
❌ Step file failed to load
❌ Resuming into wrong step (N vs N+1)

## NEXT STEPS

- If continuing: Load `step-[N+1]`
- If fresh: Load `step-01-setup`
- If error: Load error recovery
