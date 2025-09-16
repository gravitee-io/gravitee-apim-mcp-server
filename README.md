# Gravitee API Management (APIM) MCP Server

This repository contains a Model Context Protocol (MCP) server for the Gravitee.io API Management (APIM) platform. It allows you to interact with your Gravitee instance using natural language in AI assistants like Claude, Cursor, and other MCP-compatible clients.

The server is generated from the official Gravitee Management API v2 OpenAPI specification and exposes its functionality as a set of tools for an LLM to use.

<div align="left">
    <a href="https://www.speakeasy.com/?utm_source=gravitee-apim&utm_campaign=mcp-typescript"><img src="https://www.speakeasy.com/assets/badges/built-by-speakeasy.svg" /></a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" style="width: 100px; height: 28px;" />
    </a>
</div>

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Create a Service User and Generate a Token](#1-create-a-service-user-and-generate-a-token)
  - [2. Clone and Build the Server](#2-clone-and-build-the-server)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [Contributions](#contributions)

## Prerequisites
- **Node.js v18+**
- **npm** (included with Node.js)
- Access to a **Gravitee APIM instance** (Self-hosted or Cloud)

## Getting Started

Follow these steps to get the MCP server running and configured with your AI client.

### 1. Create a Service User and Generate a Token

The MCP server authenticates with the Gravitee Management API using a Bearer Token. For security, it is highly recommended to create a dedicated **Service User** for this purpose.

1.  **Log into your Gravitee APIM Management Console.**
    *   **Self-Hosted:** e.g., `http://localhost:8084`
    *   **Cloud:** e.g., `https://<your-org>.<region>.console.gravitee.io`
2.  From the main navigation, select **Organization Settings**, then click on **Users**.
3.  Click the **Add User** button.
4.  In the form, select **Service User** as the user type, provide a meaningful name (e.g., `mcp-server-user`), and click **Create**.
5.  You will be returned to the user list. Find and click on the service user you just created to open its configuration page.
6.  **Assign Permissions.** The capabilities of the AI assistant are directly determined by the permissions granted to this service user. You should assign roles based on the **principle of least privilege** for your intended operations.
    *   **Organization Role:** Sets permissions that apply across the entire organization.
    *   **Environment Roles:** Sets specific permissions for each environment (e.g., Development, Production).
    > **Important**: The Management API is powerful. To understand which permission is required for a specific action, please refer to the official Gravitee Management API documentation.
7.  Click **Save** to apply the roles.
8.  On the user's configuration page, navigate to the **Tokens** section and click **Generate a personal token**.
9.  Enter a descriptive name for the token (e.g., `mcp-server-token`) and click **Generate**.
10. **Copy the generated token immediately and store it in a safe place.** You will not be able to view it again. This token is the value you will use for the `--bearer-auth` argument.

### 2. Clone and Build the Server

```bash
# Clone the repository
git clone https://github.com/gravitee-io/gravitee-apim-mcp-server.git
cd gravitee-apim-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# The server executable is now available at ./bin/mcp-server.js
```

## Installation

The server can be installed in any MCP-compatible client. The required arguments are `--bearer-auth` (the token you generated) and `--server-url`.

#### Server URL Guide
-   **Self-Hosted:** Use the base URL of your Management API. Example: `http://localhost:8083/management/v2`
-   **Gravitee Cloud:** Use your organization-specific API URL. Example: `https://<your-org>.<region>.api.gravitee.io/management/v2`

<details>
<summary>DXT (Desktop Extension for Claude)</summary>

Install the MCP server as a Desktop Extension using the pre-built [`mcp-server.dxt`](./mcp-server.dxt) file.

Simply drag and drop the [`mcp-server.dxt`](./mcp-server.dxt) file onto Claude Desktop to install the extension. The DXT package includes the MCP server and will prompt you for the required configuration values upon installation.

> [!NOTE]
> DXT (Desktop Extensions) provide a streamlined way to package and distribute MCP servers. Learn more about [Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions).

</details>

<details>
<summary>Claude Desktop (Manual Config)</summary>

1. Open Claude Desktop Settings -> Developer -> Edit Config.
2. Add the following JSON, replacing the placeholder values.

```json
{
  "mcpServers": {
    "GraviteeApim": {
      "command": "node",
      "args": [
        "/absolute/path/to/gravitee-apim-mcp-server/bin/mcp-server.js",
        "start",
        "--bearer-auth",
        "YOUR_BEARER_TOKEN",
        "--server-url",
        "https://your-management-api-url/management/v2"
      ]
    }
  }
}
```

</details>

<details>
<summary>Cursor</summary>

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=GraviteeApim&config=eyJtY3BTZXJ2ZXJzIjp7IkdyYXZpdGVlQXBpbSI6eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJncmF2aXRlZS1hcGltIiwic3RhcnQiLCItLWJlYXJlci1hdXRoIiwiLi4uIiwiLS1zZXJ2ZXItdXJsIiwiLi4uIl19fX0=)

Or manually:
1. Open Cursor Settings -> Tools and Integrations -> New MCP Server.
2. Paste the following JSON, replacing the placeholder values.

```json
{
  "mcpServers": {
    "GraviteeApim": {
      "command": "node",
      "args": [
        "/absolute/path/to/gravitee-apim-mcp-server/bin/mcp-server.js",
        "start",
        "--bearer-auth",
        "YOUR_BEARER_TOKEN",
        "--server-url",
        "https://your-management-api-url/management/v2"
      ]
    }
  }
}
```

</details>

<details>
<summary>VS Code</summary>

Refer to the [Official VS Code documentation](https://code.visualstudio.com/api/extension-guides/ai/mcp) for the latest information.

1. Open the Command Palette and search for `MCP: Open User Configuration`.
2. This will open the `mcp.json` file. Paste the following configuration:

```json
{
  "mcpServers": {
    "GraviteeApim": {
      "command": "node",
      "args": [
        "/absolute/path/to/gravitee-apim-mcp-server/bin/mcp-server.js",
        "start",
        "--bearer-auth",
        "YOUR_BEARER_TOKEN",
        "--server-url",
        "https://your-management-api-url/management/v2"
      ]
    }
  }
}
```

</details>

<details>
<summary> Run with Stdio via npx (after publishing) </summary>
Once the package is published to npm, you can run it directly with `npx`.

```bash
# Start the server
npx gravitee-apim start --bearer-auth YOUR_BEARER_TOKEN --server-url https://your-management-api-url/management/v2

# See all available arguments
npx gravitee-apim --help
```
</details>

## Usage Examples

Once configured, you can interact with your Gravitee instance using natural language. For Cloud instances, remember to specify the target environment ID or HRID.

-   `List all of my APIs in the 'dev' environment.`
-   `Get the health status for the API with ID '123-abc-456'.`
-   `Create a new API named "Weather API" that points to http://example.com/weather.`
-   `For the "Weather API", create a keyless plan, publish it, and start the API.`

## Contributions

While we value contributions to this MCP Server, the code is generated programmatically. Any manual changes added to the `src` directory will be overwritten on the next generation.

We look forward to hearing your feedback. Feel free to open a PR with changes to the generation process or open an issue with a proof of concept, and we'll do our best to include it in a future release.

### MCP Server Created by [Speakeasy](https://www.speakeasy.com/?utm_source=gravitee-apim&utm_campaign=mcp-typescript)
