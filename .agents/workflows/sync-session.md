---
description: Claude terminal history ko ek kahani (story) ki tarah session_history.md mein record karna
---

Ye workflow Claude ki terminal activity ko monitor karta hai aur use ek chronological story ki tarah Romanized Hindi mein update karta hai.

// turbo-all
1. Get the RECENT Claude terminal history (last 200 lines only):
   `tail -n 200 ~/.claude/projects/*/transcript.jsonl 2>/dev/null | head -n 200`
   **WARNING**: NEVER use `cat ~/.claude/history.jsonl` — that file can be 50-100MB+ and will crash the context window.

2. Update the `session_history.md` file:
   - Agent ko terminal history analyze karni hai.
   - Har ek interaction ko third-person Romanized Hindi mein likhna hai (e.g., "User ne poocha...", "Claude ne file edit kari...").
   - Isko ek story format mein table mein update karna hai.
   - **Table formatting**: Ensure every row has exactly 4 pipe-delimited columns matching the header. No unescaped newlines inside cells. If in doubt, keep cell content short (under 80 chars).

3. Report the latest status to the user in Romanized Hindi.
