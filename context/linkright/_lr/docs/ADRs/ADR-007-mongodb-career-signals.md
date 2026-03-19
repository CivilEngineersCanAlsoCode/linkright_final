# ADR-007: MongoDB for Career Signals

**Date:** 2026-03-09
**Status:** Accepted
**Author:** Phoenix (RoseGlacier)

## Context
Linkright needs a way to store large volumes of structured, semi-structured, and historical career data (signals, resumes, optimization logs) that doesn't fit well into the vector-only model of ChromaDB or the task-only model of Beads.

## Decision
Adopt **MongoDB** as the primary document store for persistent career signals, workflow execution history, and user profiles.

## Rationale
- **Schema Flexibility**: JSON-like documents are perfect for storing diverse career signals with varying metadata.
- **Scalability**: Capable of handling high volumes of execution logs and historical resume versions.
- **Rich Querying**: Allows for complex queries across multiple dimensions (date, signal type, ownership level).
- **Persistence**: Provides long-term, durable storage for the user's primary "Career Vault."

## Consequences
- Requires a MongoDB instance (or compatible API) to be available.
- Agents must be equipped with MongoDB client libraries.
- Requires regular backups of the `linkright_career` database.

## Alternatives Considered
- **SQL (PostgreSQL)**: Robust but the rigid schema makes it harder to store highly variable career signal data.
- **Redis**: Fast but lacks the complex querying and long-term durability needed for a career vault.
- **Pure Files (YAML/JSON)**: Simple for small amounts of data but fails to scale for thousands of signals or logs.
