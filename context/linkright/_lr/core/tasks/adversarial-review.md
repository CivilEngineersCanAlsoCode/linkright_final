---
name: "adversarial-review"
description: "Perform adversarial code/content review finding specific issues."
---

# Task: Adversarial Review

Execute a cynical, deep-dive review of the target content. Focus on finding unhandled edge cases, logic flaws, and non-obvious vulnerabilities.

## Checkpoints

1.  **Security Vulnerabilities**: Identify any potential security risks, data leaks, or injection vectors.
2.  **Performance Bottlenecks**: Look for inefficient logic, redundant operations, or scaling issues.
3.  **Logic Gaps**: Find missing error handling, unhandled branching paths, or boundary condition errors.
4.  **Structural Integrity**: Ensure the content follows the prescribed module patterns (e.g., BMAD/Linkright).

## Output Format

- **Summary of Findings**: A high-level overview of the review result.
- **Detailed Issues**: Numbered list of specific findings with severity (Critical/Warning/Note) and recommended fix.
