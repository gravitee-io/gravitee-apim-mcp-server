# Gravitee APIM MCP Server

This repository contains a Model Context Protocol (MCP) server for Gravitee API Management (APIM). It lets MCP-compatible clients call the APIM Management API through tools.

This version targets the APIM 4.12 Management API v2 APIs surface.

## Scope

The MCP server covers the APIM Management API v2 APIs surface only. It does not expose the full Management API family.

The tool surface includes API creation, import, update, deployment, plans, subscriptions, members, analytics, logs, health, scoring, integrations, and related read operations. Some high-impact operations such as delete, stop, migrate, promote, rollback, transfer ownership, debug, and subscription key actions are available when the configured APIM token has permission to perform them.

Use a dedicated APIM service user and grant only the roles required for the intended workflow.

## Requirements

- Access to an APIM Management API endpoint
- An APIM bearer token
- Node.js 18 or later, npm, and Bun when installing from source

## Create an APIM Token

Create a dedicated APIM service user and generate a personal token for it.

Recommended flow:

1. Open the APIM Console.
2. Go to Organization Settings, then Users.
3. Create a service user for MCP usage.
4. Assign only the organization and environment roles required for the workflows you want to allow.
5. Generate a personal token for that service user.
6. Use that token as `APIM_BEARER_TOKEN` or as the value for `--bearer-auth`.

## Install

### From npm (recommended)

Run directly with `npx`:

```bash
npx @gravitee/apim-mcp-server start \
  --bearer-auth "$APIM_BEARER_TOKEN" \
  --server-url "http://localhost:8083/management/v2"
```

Or install globally:

```bash
npm install -g @gravitee/apim-mcp-server
apim-mcp-server start \
  --bearer-auth "$APIM_BEARER_TOKEN" \
  --server-url "http://localhost:8083/management/v2"
```

### Claude Desktop Bundle

Official GitHub releases include a Claude Desktop bundle named `gravitee-apim-mcp-server.mcpb`. Install that file in Claude Desktop to use the packaged server. The bundle prompts for the APIM connection settings and bearer token.

### From GitHub Source

Clone and build locally (requires Node.js 18+ and Bun):

```bash
git clone https://github.com/gravitee-io/gravitee-apim-mcp-server.git
cd gravitee-apim-mcp-server
npm install
npm run build
```

The build creates the server executable at `./bin/mcp-server.js`.

## Basic Usage

Use the Management API v2 base URL as `--server-url`.

Self-hosted example:

```bash
npx @gravitee/apim-mcp-server start \
  --bearer-auth "$APIM_BEARER_TOKEN" \
  --server-url "http://localhost:8083/management/v2"
```

Cloud example:

```bash
npx @gravitee/apim-mcp-server start \
  --bearer-auth "$APIM_BEARER_TOKEN" \
  --server-url "https://<your-org>.<region>.api.gravitee.io/management/v2"
```

You can also use templated server arguments:

```bash
npx @gravitee/apim-mcp-server start \
  --protocol https \
  --management-api-host "<management-api-host>" \
  --org-id DEFAULT \
  --bearer-auth "$APIM_BEARER_TOKEN"
```

## Dynamic Mode

Dynamic mode exposes a compact set of discovery and execution tools instead of registering every APIM operation as a separate MCP tool:

- `list_scopes`
- `list_tools`
- `describe_tool_input`
- `execute_tool`

```bash
npx @gravitee/apim-mcp-server start \
  --mode dynamic \
  --bearer-auth "$APIM_BEARER_TOKEN" \
  --server-url "$APIM_SERVER_URL"
```

In dynamic mode, an MCP client first discovers a tool, inspects its input schema, then calls it through `execute_tool`.

## Read-Only Profile

For safer exploration, mount only tools marked with the `read` scope:

```bash
npx @gravitee/apim-mcp-server start \
  --mode dynamic \
  --scope read \
  --bearer-auth "$APIM_BEARER_TOKEN" \
  --server-url "$APIM_SERVER_URL"
```

This keeps read-oriented operations available and excludes write/high-impact operations such as member changes, migration, promotion, and debug tools.

## Write Profile

MCP scopes and APIM permissions both control write tools. For operational use, configure a service user with the smallest APIM role set that can perform the target workflow.

Example:

```bash
npx @gravitee/apim-mcp-server start \
  --mode dynamic \
  --scope read \
  --scope write \
  --bearer-auth "$APIM_BEARER_TOKEN" \
  --server-url "$APIM_SERVER_URL"
```

The `dangerous` scope marks high-impact tools. Only enable that scope for controlled workflows:

```bash
npx @gravitee/apim-mcp-server start \
  --mode dynamic \
  --scope read \
  --scope write \
  --scope dangerous \
  --bearer-auth "$APIM_BEARER_TOKEN" \
  --server-url "$APIM_SERVER_URL"
```

## MCP Client Configuration

Claude Desktop or compatible stdio clients can use:

```json
{
  "mcpServers": {
    "GraviteeApim": {
      "command": "npx",
      "args": [
        "-y",
        "@gravitee/apim-mcp-server",
        "start",
        "--mode",
        "dynamic",
        "--scope",
        "read",
        "--bearer-auth",
        "YOUR_BEARER_TOKEN",
        "--server-url",
        "https://your-management-api-url/management/v2"
      ]
    }
  }
}
```

## Contributions

Open issues or pull requests for documentation, installation problems, or reproducible runtime issues.
