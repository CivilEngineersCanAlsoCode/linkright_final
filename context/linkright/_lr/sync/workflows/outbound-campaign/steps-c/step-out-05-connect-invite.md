# Step 05: Draft Connect Invite

**Goal:** Draft a hyper-concise LinkedIn connection invite (≤ 300 chars).

---

## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER generate content without user validation.
✅ ALWAYS strictly follow the defined sequence below.
🚫 FORBIDDEN to load next step until discovery and extraction are complete.

## CONTEXT BOUNDARIES
- Available configurations from parent: {system_version}, {mode}

## EXECUTION PROTOCOLS
1. [READ] Target inputs securely.
2. [ANALYZE] Apply persona rules to structure the data.
3. [VALIDATE] Await user confirmation before proceeding.

## INPUT CONTRACT
- Unstructured text or file payload.

## OUTPUT CONTRACT
- Standardized Profile/Data object conforming to workspace schemas.


## 1. Constraint Enforcement

- Generate 3 variants of a connection invitation.
- **STRICT RULE**: Each variant must be ≤ 300 characters including spaces.

## 2. Signal Integration

- Each variant must succinctly reference a shared signal or the "Bridge" achievement identified in Step 02.

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 06: Profile Updates (optional).
- **[P] Previous**: back to In-Mail.
- **[A] Abort**: Exit the workflow.
