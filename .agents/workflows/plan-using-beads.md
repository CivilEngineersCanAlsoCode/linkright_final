---
description: Structured planning using Beads (Epics, Features, User Stories, Tasks, Estimation, WSJF)
---

# /plan-using-beads

This workflow defines the process for structured project planning and execution tracking using **Beads**. It ensures that every request is broken down into a logical hierarchy, estimated, prioritized, and linked within the dependency graph.

## 📋 Steps

### 1. 🔍 Analyze & Strategize
Analyze the user request and propose a technical solution. Explain the architectural choices and technical approach before creating any issues.

### 2. 🌲 Breakdown Hierarchy
Break down the approved approach into the following hierarchy:
- **Epic**: The over-arching goal or project.
- **Features**: Major functional modules or capabilities.
- **User Stories**: Functional requirements from an end-user perspective.
- **Tasks**: Implementation steps (Must follow the **Task Description Rule**).
- **Subtasks/Bugs**: Granular steps or known issues.

> [!IMPORTANT]
> **Parent-Child Derivation**: Parent acceptance criteria (AC) define the children that need to be created. Each child must contribute to fulfilling at least one AC of its parent.

### 3. 📝 Documentation Standards

#### Description Format
All items (Epics, Features, Stories, Tasks) must have a description in the following format:
- `As a... I want... So that...`

#### Acceptance Criteria (AC) Format
All items must define ACs in the following format:
- `Given... When... Then... And...`
- **Coverage**: Must include **Positive**, **Negative**, **Error**, and **Edge cases**.

#### Short Titles (Romanised Hindi)
Implementation tasks must follow the **Task Description Rule**:
- `KYA | KYON | SANDARBH` (Short, one-line Romanised Hindi).

### 4. 🥇 Quality Standards

#### Definition of Ready (DoR)
An issue is **Ready** only if:
- Description is in `As a...` format.
- ACs are defined in `Given...` format (covering all cases).
- Estimation (Fibonacci) is assigned.
- Dependencies are correctly linked.

#### Definition of Done (DoD)
An issue is **Done** only if:
- Code is implemented and verified against all ACs.
- Quality gates (tests, linters) have passed.
- Documentation (if required) is updated.
- Issue status is updated to `closed` in Beads.
- Changes are synced and pushed to remote.

### 5. 🔢 Estimation & Prioritization
- **Estimation**: Use Fibonacci sequence (`1, 2, 3, 5, 8, 13`) for Job Size.
- **WSJF**: Calculate `(Business Value + Time Criticality + R/O / Job Size)` for Features/Stories.

### 6. 🛠️ Beads Implementation
Create items and link them using `bd dep add --type parent-child`. Ensure metadata like priority and estimates are updated.

---

## 🎭 Planning Prompt Template

Use this template for planning:

> "I will now plan this request using the `/plan-using-beads` workflow.
>
> **Hierarchy Breakdown:**
> - **Epic**: [Name]
>   - **Description**: As a... I want... So that...
>   - **ACs**: Given... When... Then... (Positive/Negative/Edge)
>   - **Feature/Story**: [Name]
>     - **Task**: [KYA | KYON | SANDARBH] (Size: [Fib])
>
> **Derivation**: [Explanation of how children fulfill parent ACs]
>
> **Definition of Ready Check**: [Verify DoR compliance]
>
> Shall I proceed to create these in Beads?"
