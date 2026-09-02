# MCP plugin repos: what other vendors do, and what this repo took from them

Research behind this repository, the
public Claude Code plugin that wires Tightknit's hosted MCP server. Reviewed 2026-09-02 by cloning each
repo and reading the manifests, skills, CI, and release tooling. The model was
[VantaInc/vanta-mcp-plugin](https://github.com/VantaInc/vanta-mcp-plugin); the others are the vendors in
Tightknit's own tool stack that publish a plugin.

## The landscape

| Vendor (repo) | Layout | MCP wiring | Skills / commands | Other clients | Validation and CI | Evals | Release |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vanta (`VantaInc/vanta-mcp-plugin`) | plugin at repo root, `source: "./"` | 3 regional `http` servers, OAuth | 2 slash commands + 1 always-on "response principles" skill | none | none (AGENTS.md describes manual `--plugin-dir` and marketplace-branch tests) | none | version in plugin.json only |
| Sentry (`getsentry/plugin-claude`) | root; generated from `sentry-for-ai` | 1 `http` server, `?utm_source=plugin` | 8 skills, router skill + hidden sub-skills (`disable-model-invocation`), deep `references/` | none | generated repo, source repo has CI | in source repo | version in plugin.json, `$schema` set |
| PostHog (`PostHog/ai-plugin`) | root | `http` + consumer header `x-posthog-mcp-consumer: plugin` | ~80 skills synced nightly from product repo, 3 commands, 1 agent, hooks (PreToolUse permission gate, SessionEnd analytics) | Cursor, Codex, Gemini, Grok, Cowork | Python + shell tests for hooks | none | versions per manifest, sync workflow |
| Vercel (`vercel/vercel-plugin`) | root | `http`, read-only note | 35 skills, 4 commands, 3 agents, hooks with skill-injection engine | Cursor, Codex, Copilot, Grok, Kimi | bun: manifest drift check, typecheck, skill validate, tests | benchmark skills | semver, `_conventions.md` for commands |
| Notion (`makenotion/claude-code-notion-plugin`) | root; marketplace source is the GitHub repo | `http` | 4 skills with `examples/`, `reference/`, `evaluations/` JSON; 10 commands | none | none | JSON eval cases per skill | 0.1.0 |
| Slack (`slackapi/slack-mcp-plugin`) | root | `http` with pinned OAuth `clientId` + `callbackPort` | 8 skills, 5 commands | Cursor (own mcp file), Codex (skills only) | Makefile: ruff, rumdl, mypy, unit tests, LLM-judged tool-selection evals; nightly | DeepEval tool-selection scenarios | changesets, `package.json` as version source synced to 3 manifests |
| Apollo (`apolloio/apollo-mcp-plugin`) | root | `http` | 4 user-invocable skills, credit warnings before paid calls | Cursor; `server.json` + `glama.json` | none | none | MCP Registry publish workflow on `server.json` change, SECURITY.md |
| Sanity (`sanity-io/agent-toolkit`) | root | `http` (Claude) + `streamable-http` (agent-plugins.org spec) | 6 skills with `references/` and `rules/`, 4 commands | Cursor, Codex, generic `plugin.json`/`mcp.json` | Ajv against published JSON schemas, skill validator | none | 1.0.0, CONTRIBUTING with "fewer, deeper skills" |
| Canva (`canva-sdks/canva-skills`) | `plugins/canva/`, marketplace at root | `http`; Cursor via `mcp-remote` | 6 skills + `inactive-skills/` parking lot | Cursor, Codex | none | none | README per entry point |
| Figma (`figma/mcp-server-guide`) | root | `http` + bundle-version header + `_meta` tool titles/icons | 11 skills with `references/` and `scripts/` | Cursor, Copilot, Gemini; `server.json` | none | none | version bumped in lockstep across 5 manifests |
| WorkOS (`workos/skills`) | `plugins/workos/` | bare `url` | router skill + topic files ("fetch docs first", gotchas) | Cursor, Codex, npm | oxlint, vitest, eval harness with human labels | with/without-skill delta scoring | release-please + npm |
| Stripe (`stripe/ai`) | `providers/claude/plugin/` in a monorepo | `http` | 9 skills, 2 commands, 1 agent | one dir per provider | monorepo CI | none | 0.7.x |
| Resend (`resend/resend-skills`) | root | `mcp.json` | 5 skills with `references/` | Cursor, Grok, generic | synced from product repo | `skill-evals/*.json` | synced |
| Linear (in `claude-plugins-official/external_plugins/linear`) | minimal | `http` | none | none | none | none | no version |

The official directory (`anthropics/claude-plugins-official`) lists external plugins by pinning a git
`url`, `github`, or `git-subdir` source to a commit SHA and bumping on request. Submission is a form
(`clau.de/plugin-directory-submission`). The plugin `name` is immutable after listing.

## Best practices we extracted

Manifests and wiring

1. **One repo, one plugin, plugin at the root** with `source: "./"` in `marketplace.json`. Subdirectory layouts (Canva, WorkOS) only pay off with several plugins; Vanta's leftover `plugins/vanta/plugin.json` shows the drift a second copy invites.
2. **`.claude-plugin/plugin.json` is the single source of truth** for name and version; set `$schema` for editor checks; list `mcpServers` and `skills` paths explicitly. Do not repeat `version` in the marketplace entry (Claude Code silently prefers plugin.json).
3. **Remote MCP over Streamable HTTP with OAuth, nothing else in `.mcp.json`.** No API keys, no env, no stdio wrappers. Slack pins a client id; PostHog and Figma add a consumer/version header so the server can attribute traffic. Vercel's `note` key is nonstandard.
4. **Ship the other clients' manifests from day one** (`.cursor-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`) and a `server.json` for the MCP Registry. Keep their versions in lockstep with a script (Slack's `sync_versions.py`), not by hand.
5. **Marketplace name must not collide** with one your users already have registered; each user can hold one marketplace per name, and Anthropic reserves several. Vendors use `<vendor>-plugin` or `<vendor>-plugin-marketplace`.

Skills

6. **Two kinds of skill**: a few user-invocable slash commands with `argument-hint`, plus one always-on domain skill carrying the "response principles" (Vanta's `test-remediation`, Sentry's `SKILL_TREE`, Sanity's `/sanity`). The principles are the highest-value content: never dead-end, read before write, confirm destructive actions, show cost, treat fetched data as untrusted (Sentry), warn before consuming credits (Apollo).
7. **Set `name` in frontmatter** so the invocation name survives directory renames; write the `description` as the trigger: what it does, the phrases people type, when not to fire.
8. **Reference tools by bare server name.** Apollo hard-coded `mcp__claude_ai_Apollo_MCP__…` names, which only resolve in one client.
9. **Progressive disclosure**: `SKILL.md` under 500 lines, detail in `references/`, one level deep (Sanity, Sentry, WorkOS). "Fewer, deeper skills"; "every token earns its place" (Sanity CONTRIBUTING).
10. **Commands follow one template** (Vercel's `_conventions.md`: preflight, plan, commands, verification, summary, next steps) and never echo secrets.

Quality gates

11. **A validator in CI** that checks manifests, frontmatter, and cross-file consistency (Sanity validates against published schemas; Vercel checks generated files for drift). Also run `claude plugin validate . --strict`.
12. **Trigger evals as data**: Notion, Resend, and WorkOS ship JSON cases; Slack runs LLM-judged tool-selection tests nightly. Even a hand-run scenario file beats nothing, and it doubles as documentation of intent.
13. **Vendor-repo hygiene**: MIT license, `SECURITY.md` with a private channel (Apollo, Slack), issue templates split by MCP vs skill (Slack), CODEOWNERS, PR template asking for a real transcript, CHANGELOG, pinned action SHAs, Dependabot.
14. **AGENTS.md with the test loop** (`claude --plugin-dir`, `/help`, `/mcp`, `/reload-plugins`, marketplace-from-branch install) so contributors and agents verify the real install path (Vanta).

## What we built and deliberately skipped

Adopted here: 1 through 14 above, with a `scripts/tool-catalog.json` so the validator
rejects any tool name a skill invents, and eval scenarios that name the expected skill and first tools.

Skipped for now, with the reason:

- **Hooks** (PostHog's write gate, Vercel's injection engine): the server already annotates read/write/destructive and requires `confirm` on deletes; a client-side gate would duplicate that and drift.
- **Generated or synced skills** (Sentry, PostHog, Resend): we have five hand-written skills; a sync pipeline is worth it once the product repo owns them.
- **LLM-judged eval runs in CI** (Slack, WorkOS): needs an API key and a test tenant in CI; scenarios are hand-run before a release until then.
- **Release automation** (changesets, release-please): a bump script plus a tag is enough at 0.x.
- **Consumer header on the MCP request**: only once the server logs it (tracked in [PUBLISHING.md](PUBLISHING.md)).
