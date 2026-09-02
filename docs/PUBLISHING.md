# Publishing checklist

Where this plugin can be listed, what each place needs, and what is still to do. The repo is
the single source; every directory below points back at it.

## Before the first public release

- [ ] Make the GitHub repository public. Marketplace installs clone it anonymously.
- [ ] Confirm the MCP server is out of pilot, or that the README's pilot note is still accurate.
- [ ] Add a logo (`assets/logo.svg`) and reference it from the Cursor manifest (`logo`) and the Codex manifest (`interface.logo`). Both are optional but the directories show it.
- [ ] Confirm `privacyPolicyURL` and `termsOfServiceURL` in `.codex-plugin/plugin.json` resolve.
- [ ] Decide whether the server should log a consumer header (PostHog sends `x-posthog-mcp-consumer: plugin`, Figma a bundle version). If so, add a `headers` block to `.mcp.json` and relax the validator.
- [ ] Tag `v0.1.0`.

## Claude Code and Claude Cowork

Works today from GitHub: `/plugin marketplace add TightknitAI/tightknit-mcp-plugin`.

To be listed in the official directory (`/plugin install tightknit@claude-plugins-official` and claude.com/plugins), submit through the [plugin directory submission form](https://clau.de/plugin-directory-submission). Anthropic pins the entry to a commit SHA in `anthropics/claude-plugins-official` and bumps it on request, so releases should be tagged. The plugin `name` is immutable once listed; renames go through the marketplace `renames` map.

## Cursor

Cursor reads `.cursor-plugin/plugin.json`. Listing on the Cursor marketplace is a submission to Cursor; until then users add the server manually (README).

## Codex

Codex reads `.agents/plugins/marketplace.json` and `.codex-plugin/plugin.json`:
`codex plugin marketplace add TightknitAI/tightknit-mcp-plugin`.

## MCP Registry

`server.json` describes the remote server for the [official MCP Registry](https://registry.modelcontextprotocol.io/). Publish with `mcp-publisher` authenticated by GitHub OIDC from a workflow, as Apollo and Figma do; the `io.github.tightknitai/` namespace is verified by the org. Add a `publish-mcp.yml` workflow when ready.

## Gemini CLI (optional)

Figma and PostHog ship a `gemini-extension.json` (`mcpServers.<name>.httpUrl` plus `oauth.enabled: true`). Add one if there is demand.

## Every release

1. `node scripts/bump-version.mjs <version>`
2. `CHANGELOG.md` entry
3. `node scripts/validate.mjs && claude plugin validate . --strict`
4. Commit, tag `v<version>`, push
5. Ask Anthropic to bump the official-directory SHA (if listed); re-publish `server.json` (if listed)
