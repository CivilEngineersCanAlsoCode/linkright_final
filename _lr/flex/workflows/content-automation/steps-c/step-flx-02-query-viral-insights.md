# Step flx-02: Query Viral Insights

**Agent**: flex-publicist
**Status**: open
**Epic**: sync-wgh (Flex Module Initialization)

## Objective

Retrieve top-performing narrative patterns from ChromaDB to influence the current content draft.

## Process

1. **Semantic Query**: Use `new_signals` to query the `viral_insights` ChromaDB collection.
2. **Match Patterns**: Find posts that previously achieved high reach/engagement on similar topics.
3. **Extract "Hooks"**: Identify the opening sentence patterns that worked.

## Output

- `narrative_hooks[]`

## Next Step

- \`step-flx-03-generate-social-copy.md\`
