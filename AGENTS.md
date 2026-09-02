# Tightknit Plugin

This repo contains the Tightknit plugin for Claude Code (and manifests for Cursor and Codex). It wires the hosted Tightknit MCP server at `https://mcp.tightknit.ai/mcp` and bundles skills in `skills/`.

For general documentation on Claude Code plugins see the [docs](https://code.claude.com/docs/en/plugins). For the server, tools, rate limits, and auth, see [docs.tightknit.ai/integrations/mcp](https://docs.tightknit.ai/integrations/mcp).

## Layout

```
.claude-plugin/plugin.json      Claude Code manifest — the source of truth for name and version
.claude-plugin/marketplace.json marketplace catalog; one entry, source "./"
.mcp.json                       the MCP server (Streamable HTTP, OAuth; no headers, no env)
.cursor-plugin/plugin.json      Cursor manifest (mirrors the Claude one)
.codex-plugin/plugin.json       Codex manifest
.agents/plugins/marketplace.json Codex marketplace catalog
server.json                     MCP Registry entry
skills/<name>/SKILL.md          one directory per skill; name in frontmatter == directory
evals/scenarios.json            prompt -> expected skill and first tools
scripts/validate.mjs            what CI runs
scripts/bump-version.mjs        keeps every manifest on the same version
scripts/tool-catalog.json       tool names the server publishes; skills may only reference these
docs/                           research notes and the publishing checklist
```

## Testing

It's important to verify changes to the plugin spec.

### Validate

```bash
node scripts/validate.mjs
claude plugin validate . --strict
```

The first checks manifests agree, skills are well-formed, every tool a skill names exists in `scripts/tool-catalog.json`, and eval scenarios point at real skills. The second is the official schema check. CI runs both on every PR.

### Local plugin load (development)

Load the plugin directly from disk without installing:

```bash
claude --plugin-dir /path/to/tightknit-mcp-plugin
```

Then verify:
- `/help` — skills should appear as `/tightknit:setup`, `/tightknit:community-health`, `/tightknit:create-event`, `/tightknit:onboarding-journey`, `/tightknit:community-manager`
- `/mcp` — MCP server `tightknit` should be listed; authenticate and confirm `list_tenants` works

Use `/reload-plugins` to pick up changes without restarting the session.

### Marketplace install (full install path)

This tests the real installation flow: clone, copy to cache, load from cache.

1. Add the marketplace from a branch:
   ```
   /plugin marketplace add TightknitAI/tightknit-mcp-plugin@<branch-name>
   ```
2. Install the plugin:
   ```
   /plugin install tightknit@tightknit-plugin
   ```
3. Verify skills and MCP server load as described above.

This exercises `marketplace.json` resolution, plugin copying to `~/.claude/plugins/cache/`, and component discovery from the cached copy.

### Trigger evals

`evals/scenarios.json` lists prompts with the skill and first tools we expect. Before a release, run each prompt in a fresh session against a test community and check the skill fires (or does not, for the `null` cases). Add a scenario whenever a skill misfires in the wild.

## Writing skills

- Reference tools by their bare server names (`list_events`), never by a client-prefixed name. Clients prefix differently; the bare name is what every client resolves.
- Keep `SKILL.md` under 500 lines. Move reference tables into `references/` next to it and link by relative path.
- The `description` is the trigger. Lead with what the skill does, then the phrases a real person types, then when not to use it.
- Every write gets a confirmation step; every destructive tool gets an explicit human approval and a pointer to the reversible alternative.
- Never embed member data, tenant ids, or real community names in examples.

## Releasing

1. `node scripts/bump-version.mjs <version>` (semver: patch for wording, minor for a new skill or step, major for a removed or renamed skill).
2. Add a section to `CHANGELOG.md`.
3. Commit, tag `v<version>`, push. Installed copies pick up the new version on `/plugin marketplace update`; see [docs/PUBLISHING.md](docs/PUBLISHING.md) for the directories and registries.
