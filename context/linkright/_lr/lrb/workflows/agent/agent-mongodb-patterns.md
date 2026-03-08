# MongoDB Patterns for Agent Data Access

## Overview

Agents interact with MongoDB to perform CRUD operations on core Linkright data structures: signals, job descriptions (JDs), and resumes.

## Core Data Structures

### Signals Collection
```
{
  _id: ObjectId,
  agentId: string,
  type: "opportunity|risk|insight",
  timestamp: Date,
  data: { /* context-specific */ },
  status: "active|archived|resolved"
}
```

### Job Descriptions (JDs) Collection
```
{
  _id: ObjectId,
  title: string,
  requirements: string[],
  salary_range: { min: number, max: number },
  metadata: { /* hiring context */ },
  created_at: Date,
  updated_at: Date
}
```

### Resumes Collection
```
{
  _id: ObjectId,
  candidate_id: string,
  skills: string[],
  experience: [ { title, company, duration } ],
  metadata: { /* candidate info */ },
  indexed_at: Date
}
```

## CRUD Operations

### Create
- Validate data against schema before insert
- Generate appropriate metadata and timestamps
- Return created document with _id for reference

### Read
- Use indexed fields for efficient queries
- Include pagination for large result sets
- Filter sensitive data based on agent permissions

### Update
- Use partial updates ($set) rather than full replacements
- Maintain audit trail via timestamps
- Validate changes before persistence

### Delete
- Implement soft deletes (status field) when possible
- Archive historical data before hard deletion
- Maintain referential integrity

## Query Patterns

### Find by Agent/Context
```
db.signals.find({ agentId: agentId, status: "active" })
```

### Time-Range Queries
```
db.signals.find({ timestamp: { $gte: startDate, $lte: endDate } })
```

### Multi-Field Filters
```
db.resumes.find({ skills: { $in: requiredSkills }, experience: { $exists: true } })
```

## References

- See `agent-architecture.md` for context preservation patterns
- See `agent-chroma-retrieval.md` for semantic search alternatives
