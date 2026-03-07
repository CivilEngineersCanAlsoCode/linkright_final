# Agent Orchestration & LR-Orchestrator Routing

## Overview

Agents interact with the Linkright ecosystem through the **lr-orchestrator**, a central router that directs agent requests to appropriate services and workflows.

## Routing Patterns

### Service Discovery
- Agents query the orchestrator with service type and intent
- Orchestrator routes to appropriate module (Sync, Flex, Core, etc.)
- Response includes service endpoint and authentication context

### Workflow Integration
- Agents can trigger existing workflows via orchestrator
- Workflows return status and result data for agent processing
- Error handling propagates back to agent context

### Context Preservation
- Each request includes agent metadata and session context
- Orchestrator maintains request/response correlation
- Multi-step workflows preserve agent state across calls

## Best Practices

1. **Stateless Requests**: Keep each orchestrator call independent
2. **Error Handling**: Implement retry logic for transient failures
3. **Timeout Management**: Set appropriate timeouts for orchestrator calls
4. **Context Cleanup**: Clear sensitive context after workflow completion

## References

- See `agent-architecture.md` for agent structure decisions
- See `agent-beads-integration.md` for task workflow coordination
- See `agent-mcp-tools.md` for external service integration
