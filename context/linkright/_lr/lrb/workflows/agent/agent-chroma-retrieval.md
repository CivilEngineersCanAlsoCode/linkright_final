# Semantic Search with Chroma Database

## Overview

Agents leverage Chroma vector database for semantic search capabilities, enabling natural language queries against document collections and contextual information.

## Integration Points

### Document Embedding
- Convert documents to embeddings using configured model
- Store embeddings in Chroma collection with metadata
- Maintain mapping between Chroma IDs and MongoDB document IDs

### Query Execution
- Transform user intent into semantic query
- Execute similarity search against Chroma collection
- Retrieve top-k relevant documents with scores

### Result Ranking
- Filter results by confidence threshold
- Re-rank results using domain-specific criteria
- Return enriched results with source attribution

## Common Patterns

### Skill-Based Matching
Query: "Find candidates with Python and cloud architecture experience"
- Embed query as semantic vector
- Search resume collection for similar skills
- Return ranked candidates with confidence scores

### Contextual Document Search
Query: "Jobs similar to this JD in healthcare technology"
- Embed target JD as reference
- Find similar documents in collection
- Filter by relevant metadata (location, salary range)

### Historical Pattern Recognition
Query: "What signals preceded previous successful hires?"
- Search signal collection for semantic similarity
- Return relevant historical patterns
- Rank by recency and relevance

## Configuration

### Collection Settings
- Model: Configured embedding model (e.g., OpenAI, local)
- Distance metric: Cosine similarity (default)
- Batch size: Optimal batch size for embedding operations

### Performance Tuning
- Index frequently queried fields
- Implement caching for common queries
- Monitor embedding generation latency

## Best Practices

1. **Metadata Tagging**: Include rich metadata with embeddings
2. **Version Management**: Track embedding model version
3. **Quality Thresholds**: Set confidence thresholds per use case
4. **Fallback Logic**: Implement MongoDB fallback for low-confidence results

## References

- See `agent-mongodb-patterns.md` for complementary structured queries
- See `agent-orchestration.md` for service routing
