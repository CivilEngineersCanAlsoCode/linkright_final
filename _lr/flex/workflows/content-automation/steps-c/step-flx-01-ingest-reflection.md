# Step flx-01: Ingest Reflection

**Agent**: lr-tracker
**Status**: open
**Epic**: sync-wgh (Flex Module Initialization)

## Objective

Automatically ingest daily user reflections and extract raw atomic signals for the MongoDB collection.

## Process

1. **Fetch Reflection**: Direct read from `_lr/_memory/reflections/latest.md`.
2. **Decompose**: Split text into atomic task/achievement blocks.
3. **Register Signals**: Pass blocks to `lr-tracker` for MongoDB insertion.

## Output

- `new_signals[]` in MongoDB.

## Next Step

- `step-flx-02-query-viral-insights.md`
