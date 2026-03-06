# External Tools & MCP Integration

## Overview

Agents access external services and tools through the Model Context Protocol (MCP), enabling integration with n8n, webhooks, and third-party APIs.

## MCP Architecture

### Tool Registration
- Tools define input schema and execute logic
- Tools are exposed to agents through MCP interface
- Agents discover and invoke tools dynamically

### Tool Invocation
- Agent requests tool with specific inputs
- MCP handles authentication and routing
- Response formatted as structured data for agent processing

### Error Handling
- Tool failures return error codes and messages
- Agents implement retry logic for transient failures
- Critical tool failures escalate to human review

## N8N Integration

### Workflow Triggers
- Agents can trigger n8n workflows via MCP
- Pass parameters and context data
- Receive workflow results synchronously or asynchronously

### Data Transformation
- n8n handles complex data transformations
- Agents consume transformed data for decision-making
- Bidirectional data flow for stateful processes

### Use Cases
- **ETL Pipelines**: Extract and transform Linkright data
- **Third-Party Sync**: Keep external systems in sync
- **Complex Calculations**: Leverage n8n nodes for computation
- **Email/Notification**: Send communications via n8n integrations

## API Integrations

### Authentication Patterns
- API keys stored securely in credentials vault
- Agents never handle raw credentials
- MCP layer manages authentication token refresh

### Rate Limiting
- Implement backoff strategies for rate-limited APIs
- Queue requests through rate-limit-aware layer
- Cache responses when appropriate

### Webhook Callbacks
- Agents can register callbacks for external events
- Webhooks invoke agent decision logic
- Maintain request correlation for async workflows

## Tool Patterns

### Execute & Wait
```
Agent invokes tool → Waits for response → Processes result
```
Best for: Fast operations, simple transformations

### Fire & Forget
```
Agent invokes tool → Returns immediately → Tool updates state later
```
Best for: Long-running jobs, notifications

### Poll & Retry
```
Agent invokes tool → Polls status periodically → Continues when ready
```
Best for: Eventual consistency, batch operations

## Security Considerations

1. **Credential Management**: Use MCP credential vault, never inline secrets
2. **Request Validation**: Validate tool inputs before invocation
3. **Output Sanitization**: Sanitize tool outputs before use
4. **Audit Logging**: Log tool invocations for compliance
5. **Timeout Policies**: Set reasonable timeouts to prevent hangs

## Best Practices

1. **Tool Composition**: Chain tools for complex workflows
2. **Error Recovery**: Implement fallback logic for failed tools
3. **Performance**: Cache results to minimize tool invocations
4. **Monitoring**: Track tool performance and reliability
5. **Documentation**: Keep tool definitions current with changes

## References

- See `agent-orchestration.md` for service routing
- See `agent-beads-integration.md` for workflow coordination
