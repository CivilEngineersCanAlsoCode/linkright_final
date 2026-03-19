# ADR-002: ChromaDB for Semantic Memory

**Date:** 2026-03-09
**Status:** Accepted
**Author:** Phoenix (RoseGlacier)

## Context
Linkright agents need to retrieve relevant career signals and testing patterns based on semantic meaning rather than just keyword matching. This requires a vector database that can store embeddings and perform efficient similarity searches.

## Decision
Adopt **ChromaDB** as the primary vector database for semantic memory across the Linkright ecosystem.

## Rationale
- **Simplicity**: Easy to set up and run via Docker with minimal configuration.
- **Semantic Retrieval**: Provides high-quality similarity search, essential for matching user signals to job requirements.
- **Agent Integration**: Has strong existing library support and a clear API for AI agent interactions.
- **Local First**: Can run entirely on the local machine, ensuring data privacy and low latency for the development loop.

## Consequences
- Requires Docker to be running during active development/execution.
- Agents must be configured with embedding model details (e.g., `text-embedding-3-small`).
- Requires a persistent bind mount for data storage.

## Alternatives Considered
- **File-based (JSON/Pickle)**: Too slow for large signal libraries and lacks a standardized query interface.
- **Redis (Vector Similarity)**: High performance but adds complexity to the infrastructure stack.
- **pgvector (PostgreSQL)**: Robust but requires maintaining a relational database, which is overkill for semantic-only memory.
