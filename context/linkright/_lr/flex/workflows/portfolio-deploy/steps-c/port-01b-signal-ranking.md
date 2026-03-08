# port-01b: Signal Ranking & Preparation

**Workflow Step:** portfolio-deploy
**Sequence:** 01b (after 01a: profile extraction)
**Owner:** Sync → Flex bridge
**Duration:** ~5 min per profile
**Status:** EXECUTABLE

---

## Objective

Rank and normalize professional signals from Sync module output into structured SlideDeck input format.

**Input:** Profile signals from Sync (hook, skills array, featured project, career growth, CTA)
**Output:** SyncSignal object ready for slide transformation
**Error Handling:** Validation + fallback to defaults

---

## Dependencies

- `sync-parser` module completion (signal extraction)
- `SignalToSlidesTransformer` from `flex/lib/signal-to-slides-transformer.ts`
- Abyssal Depth theme config from `flex/config/abyssal-depth-theme.yaml`

---

## Execution Protocol

### Step 1: Fetch Profile Signals from Sync Module

```typescript
import { Sync } from '@linkright/sync';

const profileSignals = await Sync.getProfileSignals(profileId);
// Returns: {
//   hook: string,
//   skills: Array<{skill, relevance, yearsExperience}>,
//   featuredProject: {...},
//   careerGrowth: {...},
//   cta: {...}
// }
```

### Step 2: Validate Signal Structure

```typescript
import { validateSignalInput } from '@linkright/flex/lib/frontend-slides-errors';

try {
  validateSignalInput(profileSignals);
  console.log('✓ Signal validation passed');
} catch (error) {
  console.warn(`Signal validation issue: ${error.message}`);
  // Apply defaults for missing fields
}
```

### Step 3: Rank Skills by Relevance to JD

```typescript
const rankedSkills = profileSignals.skills
  .sort((a, b) => b.relevance - a.relevance)
  .slice(0, 6);  // Top 6 skills

console.log(`Top skills: ${rankedSkills.map(s => s.skill).join(', ')}`);
```

### Step 4: Extract Metrics from Featured Project

```typescript
import { extractMetrics } from '@linkright/flex/lib/content-extraction';

const projectMetrics = extractMetrics(
  profileSignals.featuredProject.metrics
);
// Returns: Array<{label, value}>
```

### Step 5: Normalize to SyncSignal Format

```typescript
import type { SyncSignal } from '@linkright/flex/lib/signal-to-slides-transformer';

const syncSignal: SyncSignal = {
  profileId,
  hook: profileSignals.hook,
  yearsExperience: calculateYearsInField(profileSignals.skills),
  skills: rankedSkills,
  featuredProject: {
    title: profileSignals.featuredProject.title,
    description: profileSignals.featuredProject.description,
    metrics: profileSignals.featuredProject.metrics,
    timelineMonths: profileSignals.featuredProject.timelineMonths,
    technologies: profileSignals.featuredProject.technologies,
    teamSize: profileSignals.featuredProject.teamSize,
  },
  careerGrowth: {
    narrative: profileSignals.careerGrowth.narrative,
    keyMilestones: profileSignals.careerGrowth.keyMilestones,
    learnings: profileSignals.careerGrowth.learnings,
  },
  cta: {
    headline: profileSignals.cta.headline,
    message: profileSignals.cta.message,
    contactInfo: profileSignals.cta.contactInfo,
  },
  context: {
    targetRole: profileSignals.context?.targetRole,
    targetCompany: profileSignals.context?.targetCompany,
    jdKeywords: profileSignals.context?.jdKeywords,
  },
};

console.log(`Normalized signal for: ${syncSignal.hook}`);
```

### Step 6: Store for Next Step

```typescript
// Pass to port-01c via workflow context
workflowContext.signal = syncSignal;
workflowContext.timestamp = new Date().toISOString();
workflowContext.status = 'signal_ranked';
```

---

## Output Contract

```typescript
interface WorkflowContext {
  profileId: string;
  signal: SyncSignal;              // Normalized & ranked
  timestamp: string;                // ISO 8601
  status: 'signal_ranked';
  metrics: {
    topSkillCount: number;
    projectMetricCount: number;
    validationErrors: string[];
  };
}
```

---

## Error Handling

| Error | Detection | Recovery |
|-------|-----------|----------|
| Missing hook | `hook` is empty or null | Use default: "Professional" |
| No skills | `skills.length === 0` | Create 3 default skills |
| Invalid metrics | Regex parse fails | Log warning, use raw text |
| Bad structure | Validation throws | Apply schema defaults |

---

## Validation Rules

✓ Hook: 10+ characters
✓ Skills: 1+ with relevance 0-100
✓ Project: title + description required
✓ CTA: headline + message required
✓ Metrics: Parse quantified impact (%, x, $)

---

## Next Step

→ **port-01c:** Slide Rendering (transform SyncSignal → HTML slides)

---

*Step Definition: 2026-03-09 | Part of E2 v2 Portfolio Integration*
