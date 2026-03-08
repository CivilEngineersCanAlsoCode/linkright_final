---
description: Sync Claude session history and system health to session_history.md
---

This workflow automates the monitoring of Claude's terminal activity and updates the chronological audit log.

// turbo-all
1. Get the latest Claude history entries:
   `tail -n 50 ~/.claude/history.jsonl`

2. Run system health verification:
   `./setup/verify.sh`

3. Update the `session_history.md` file with the latest state and findings.
   (The agent should NOT copy the user request verbatim. Instead, provide a summarized 1-liner in third-person Romanized Hindi describing what the user wanted and what Claude was doing, e.g., "User ne branch switch karne ko bola aur Claude ne git state update kiya.")

4. Report the latest status to the user in Romanized Hindi.
