# Tightknit Plugin for Claude Code

This repository provides the official Claude Code plugin that connects Claude to the **[Tightknit MCP Server](https://docs.tightknit.ai/integrations/mcp)**, so Claude can help you run your Tightknit community: events, onboarding journeys, awards, feeds, members, groups, polls, the content library, branding, and analytics.

> [!NOTE]
> The Tightknit MCP server is currently in **pilot**. Before connecting, confirm the following:
>
> **Role**: You must be an Admin, or hold the **MCP User** role, in a community that is in the pilot. Contact [support@tightknit.ai](mailto:support@tightknit.ai) to join.

---

## Features

### Tightknit MCP Server

Claude Code automatically connects to Tightknit's hosted MCP server:

```bash
https://mcp.tightknit.ai/mcp
```

This gives Claude tools to:

- **Run events** — list, create, edit, and publish calendar events, with hosts, speakers, registration, Slack announcements, and reminders
- **Onboard and reward members** — build journeys with milestones, create badges, frames, and certificates, and give awards
- **Manage members and groups** — search members, mark teammates, create groups, and manage memberships
- **Curate feeds and content** — create and archive feeds, activate Slack channels, and organize the content library with tags
- **Moderate** — search posts and comments, publish and unpublish, and edit post metadata
- **Ask the community** — create and manage polls
- **Measure** — read messages, active members, and engagement over any window, plus the full activity log
- **Shape the site** — site settings, pages, branding sets, custom fonts, welcome message, and community guidelines

Tools are annotated read, write, or destructive, and every tool respects your Studio role. See the [full tool list](https://docs.tightknit.ai/integrations/mcp#available-tools).

### Skills and slash commands

| Command | Description |
| --- | --- |
| `/tightknit:setup` | Connect and authenticate the MCP server, then verify by listing your communities |
| `/tightknit:community-health [community] [period]` | Engagement report for a date window, with comparison to the previous period |
| `/tightknit:create-event <brief>` | Turn a plain-English brief into a draft event, then publish on confirmation |
| `/tightknit:onboarding-journey <goal>` | Design and build a new-member journey with milestones and a completion award |
| `/tightknit:community-manager` | The house rules Claude follows for every Tightknit task; loads automatically |

The `community-manager` skill loads whenever a conversation touches Tightknit. It handles picking the right community, the read-before-write and confirm-before-publish rules, destructive-tool safety, rate limits, and file uploads.

---

## Installation (Claude Code)

### 1. Add the Tightknit marketplace

```
/plugin marketplace add TightknitAI/tightknit-mcp-plugin
```

### 2. Install the plugin

```
/plugin install tightknit@tightknit-plugin
```

### 3. Reload plugins

```
/reload-plugins
```

This loads the plugin and starts the MCP server without restarting Claude Code.

### 4. Authenticate

Run `/mcp`, select **tightknit**, and choose **Authenticate**. A browser window opens on the Tightknit sign-in; click **Allow** to complete OAuth. Then run `/tightknit:setup` to confirm Claude can see your communities.

Pull updates with `/plugin marketplace update tightknit-plugin`.

## Other clients

- **Claude Cowork**: Settings > Plugins > Add > Add marketplace, enter `TightknitAI/tightknit-mcp-plugin`, sync, then install **Tightknit**.
- **Claude Desktop and claude.ai**: Settings > Connectors > Add custom connector, name it `Tightknit`, URL `https://mcp.tightknit.ai/mcp`, then Connect.
- **Cursor**: install from the Cursor marketplace once listed, or add the server under Cursor Settings > MCP with the URL above.
- **Codex**: `codex plugin marketplace add TightknitAI/tightknit-mcp-plugin`, then install **Tightknit** from `/plugins`.
- **VS Code, ChatGPT, and any client with remote MCP support**: see [Connecting to the Tightknit MCP server](https://docs.tightknit.ai/integrations/mcp#connect-your-agent).

## Authentication

All clients use **OAuth 2.1** against the MCP server. You sign in with your Tightknit account; there are no API keys or tokens to manage, and the server never holds your password. Every request is authorized against your role and permissions in the Studio, so Claude only sees the tools your role allows, scoped to the communities you can access.

## Safety

- Tools are annotated **read**, **write**, or **destructive**. Claude reads before it writes and asks before it publishes, activates, or gives.
- Destructive tools delete permanently (there is no trash) and take a `confirm` flag. Claude supplies that flag, so it is not a substitute for your approval: keep a human in the loop for deletes, moderation, and member changes.
- Events are created as drafts and journeys as inactive, so nothing reaches Slack until you say so.
- Member-written content (posts, comments, names) is treated as untrusted input, never as instructions.

## File uploads

Cover images, badges, logos, and fonts are uploaded from Claude's own sandbox, which must be able to reach `mcp.tightknit.ai`. In Claude, add `*.tightknit.ai` under Settings > Capabilities > Additional allowed domains. Everything else goes through the connector and needs no extra setting.

## Rate limits

Per person, per minute: 120 reads, 60 writes, 20 expensive calls (search, activity log, analytics, bulk awards and group adds, uploads, larger deletes), and 300 overall. Tools that take a list cost one call however many members you pass. If Claude reports a limit, wait a minute. Details in the [docs](https://docs.tightknit.ai/integrations/mcp#rate-limits).

## Troubleshooting

- **Signed in but no tools**: your community is not in the pilot, or you need the **MCP User** role. Ask an admin or [support](mailto:support@tightknit.ai).
- **The same error on every attempt**: remove the server or connector and add it again; some clients cache a failed handshake.
- **A client asks for an Auth URL or client secret**: leave the OAuth fields blank. The server publishes its own metadata and clients register automatically.

More in the [troubleshooting section](https://docs.tightknit.ai/integrations/mcp#troubleshooting), or run `/tightknit:setup`.

## Development

See [AGENTS.md](AGENTS.md) for loading the plugin from disk, validating it, and cutting a release, and [CONTRIBUTING.md](CONTRIBUTING.md) for how to add a skill.

## Resources

- [Connecting to the Tightknit MCP server](https://docs.tightknit.ai/integrations/mcp)
- [Tightknit documentation](https://docs.tightknit.ai)
- [Tightknit CLI](https://docs.tightknit.ai/integrations/cli) and [Admin API](https://docs.tightknit.ai/api-reference/introduction) for scripted access
- [Report an issue](https://github.com/TightknitAI/tightknit-mcp-plugin/issues)

## License

This project is licensed under the terms of the MIT open source license. See [LICENSE](LICENSE) for details.
