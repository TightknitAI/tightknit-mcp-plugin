---
name: setup
description: Connect this client to the Tightknit MCP server, authenticate with OAuth, and verify the connection by listing the user's communities. Use when the user wants to set up, connect, install, authenticate, or troubleshoot Tightknit or this plugin, when they paste the Tightknit MCP docs URL, or when any Tightknit tool call fails with an authorization, sign-in, or "no tools" error.
user-invocable: true
---

# Set up the Tightknit MCP server

Get the user from "not connected" to "I can see my communities" without them having to read
the docs. The server is remote and hosted: nothing to install, no API key. One URL and an
OAuth sign-in.

| Setting | Value |
| --- | --- |
| Server URL | `https://mcp.tightknit.ai/mcp` |
| Transport | Streamable HTTP |
| Authentication | OAuth 2.1, sign in with the Tightknit account |
| Access | Admins, and roles granted **MCP User**, in a community in the pilot |

## Steps

1. **Probe.** Try `list_tenants`.
   - It returns communities: skip to step 4.
   - The tool exists but returns an authorization or sign-in error: go to step 2.
   - The tool does not exist at all: go to step 3.
2. **Authenticate.** The server is configured but not signed in.
   - Claude Code: tell the user to run `/mcp`, choose **tightknit**, and pick
     **Authenticate**. A browser window opens on the Tightknit sign-in; they approve, and the
     tools appear without restarting.
   - Claude Desktop, claude.ai, Cowork: Settings > Connectors, find Tightknit, **Connect**.
   - Cursor: Cursor Settings > MCP, click the Tightknit server, authenticate.
   - Any client that asks for an Auth URL, Token URL, or client secret: leave them blank. The
     server publishes its own OAuth metadata and clients register themselves. Only if the
     client insists: authorization `https://signin.tightknit.ai/oauth2/authorize`, token
     `https://signin.tightknit.ai/oauth2/token`, registration
     `https://signin.tightknit.ai/oauth2/register`.
   After they sign in, return to step 1.
3. **Configure.** The server is not registered in this client. This plugin ships the
   configuration, so in Claude Code the fix is usually to load the plugin:
   ```text
   /plugin marketplace add TightknitAI/tightknit-mcp-plugin
   /plugin install tightknit@tightknit-plugin
   /reload-plugins
   ```
   Without the plugin, add the server directly:
   ```bash
   claude mcp add --transport http tightknit https://mcp.tightknit.ai/mcp
   ```
   Other clients: Claude Desktop and claude.ai take it as a custom connector
   (Settings > Connectors > Add custom connector, name `Tightknit`, URL above). Cursor takes
   `{"mcpServers": {"tightknit": {"url": "https://mcp.tightknit.ai/mcp"}}}` in
   `.cursor/mcp.json`; VS Code takes the same shape under `servers` with `"type": "http"` in
   `.vscode/mcp.json`. Then go to step 2.
4. **Verify and orient.** Show the communities from `list_tenants` as a table: name, the
   user's role, and whether it has a Slack workspace. If there is more than one, tell the user
   you will ask which one to use for each task, or that they can name it up front. Offer the
   next steps: `/tightknit:community-health`, `/tightknit:create-event`,
   `/tightknit:onboarding-journey`.
5. **Mention uploads once.** If the user will attach images (event covers, badges, logos),
   the sandbox must reach `mcp.tightknit.ai`. In Claude, that is Settings > Capabilities >
   Additional allowed domains > `*.tightknit.ai`. Say it once; do not repeat it every session.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Sign-in completes, still no tools | Community not in the pilot, or user lacks Admin or MCP User | Ask an admin to grant **MCP User** in Studio, or contact support@tightknit.ai to join the pilot |
| Generic error after sign-in, every time | Client cached a failed handshake | Remove the connector or server and add it again |
| "Cannot connect" | Client only supports local stdio servers, or URL missing `/mcp` | Use a client with remote MCP support; enter the URL exactly |
| Tools appear but a needed one is missing | Studio role does not cover it, or plan lacks the feature | Name the role or feature; do not work around it |
| Upload fails or times out | Sandbox blocked from mcp.tightknit.ai | Allowlist `*.tightknit.ai` (see step 5) |
| Rate-limit message | Per-minute budget spent | Wait a minute; batch list-taking calls |

If none of these apply, gather the client, its version, and the exact error, and point the
user to support@tightknit.ai. Also call `submit_feedback` with `reporter_type: agent` and the
error text, so the Tightknit team sees it.
