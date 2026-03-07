---
name: "shard-doc"
description: "Splits large markdown documents into smaller, organized files."
---

# Task: Shard Doc

Process a large markdown document and split it into atomic, manageable files based on structural headers.

## Rules

1.  **Split by H2 headers**: Use secondary headers as the primary boundary for splitting.
2.  **Maintain Link Integrity**: Ensure all internal links are updated to the new relative paths.
3.  **Preserve Metadata**: Copy any critical frontmatter or tags to each shard.
4.  **Index Generation**: Create an `index.md` in the target directory referencing all shards.

## Instructions

- Confirm the target directory before writing any shards.
- Report the total count of files generated.
