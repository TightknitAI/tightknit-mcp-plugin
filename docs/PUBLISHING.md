# Publishing checklist

Where this plugin can be listed, what each place needs, and what is still to do. The repo is
the single source; every directory below points back at it.

| Harness | Reads | Listing |
| --- | --- | --- |
| Claude (claude.ai, Cowork, Claude Code) | `.claude-plugin/plugin.json`, `.mcp.json`, `skills/` | Anthropic developer portal: connector + plugin |
| ChatGPT and Codex | `plugin.json`, `mcp.json`, `skills/` (portable Agent Plugins format) | OpenAI plugin directory (ZIP upload) |
| Codex CLI, older builds | `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json` | `codex plugin marketplace add` |
| Cursor | `.cursor-plugin/plugin.json` | Cursor marketplace submission |
| Any Agent Skills client | `skills/` | `npx skills add TightknitAI/tightknit-mcp-plugin` (skills.sh) |
| Any MCP client | `server.json` | Official MCP Registry |

## Before the first public release

- [x] Make the GitHub repository public. Marketplace installs, the skills CLI, and the Claude
  directory all read it anonymously.
- [x] Confirm the MCP server is out of pilot, or that the README's pilot note is still accurate.
- [x] Logo: `assets/logo.png` (the rope-heart mark, 575x575, transparent) is the icon in every
  manifest; the wordmarks in `assets/` are for READMEs and listings.
- [x] Listing URLs resolve: privacy `https://tightknit.ai/legal/privacy-policy`, terms
  `https://tightknit.ai/legal/terms-of-service`, support `https://docs.tightknit.ai/support/contact`.
- [ ] Seed a reviewer tenant with sample data (members including "Riley Chen" with notes,
  question posts with and without replies, a draft event, a Message Blaster draft) and a
  reviewer login with the MCP User role. Both directories need it, and OpenAI's sign-in must
  work without MFA, magic links, or email codes.
- [ ] Decide whether the server should log a consumer header (PostHog sends
  `x-posthog-mcp-consumer: plugin`, Figma a bundle version). OpenAI's public submission rejects
  non-empty `headers`, so this would apply to `.mcp.json` only.
- [ ] Merge the skills from `TightknitAI/tightknit-skills` (events, journeys and awards, site
  setup and branding) here, and archive that repo, so there is one source.
- [ ] Tag `v0.2.0`.

## Claude (claude.ai, Cowork, Claude Code)

Works today from GitHub: `/plugin marketplace add TightknitAI/tightknit-mcp-plugin`.

The directory takes two submissions at [claude.ai/directory/manage](https://claude.ai/directory/manage),
both under **Submit new**:

1. **MCP connector** for `https://mcp.tightknit.ai/mcp`. Every tool already has a `title` and a
   read-only or destructive hint, the server uses one URL for every customer, and reads and
   writes are separate tools. Have ready: the docs, privacy, and support URLs above, the icon,
   reviewer credentials, and a one-liner (200 chars) and description (2,000 chars). The URL
   slug is permanent. Reviewers reject tool descriptions that steer Claude beyond the tool
   itself (for example `create_event`'s "ask them and explain the options"), so audit those on
   the server first. See the [connector checklist](https://claude.com/docs/connectors/building/review-criteria).
2. **Plugin bundle** from this repo (root folder, tracked branch `main` or a tag), paired with
   the connector listing. Run **Validate**, fix anything **Blocking**, then answer the data
   handling step: reads personal data (member profiles and notes) yes; stores data outside
   Tightknit no; sends data to other services no; for under-18s no. See the
   [plugin checklist](https://claude.com/docs/plugins/pre-submission-checklist).

Each new commit on the tracked branch is scanned before it goes live, so raise `version` with
every release. The plugin `name` is permanent once listed.

## ChatGPT and Codex

One listing serves both, in OpenAI's universal plugin directory. See
[Upload and submit your plugin](https://developers.openai.com/plugins/deploy/submission).

- The portable `plugin.json` holds the listing (`extensions.com.openai.interface`), the
  onboarding skill (`setup`), and the review test cases (five positive, three negative, which
  the validator enforces). `mcp.json` declares the server with OAuth dynamic client
  registration. When `extensions.com.openai` is present it replaces `.codex-plugin/plugin.json`
  entirely; keep that file only for older Codex builds.
- Upload a ZIP of the repo root, excluding `.git/`, `.github/`, `docs/`, `evals/`, and `scripts/`:
  `git archive --format=zip -o tightknit.zip HEAD plugin.json mcp.json skills assets LICENSE README.md`.
  Lifecycle hooks and `.app.json` block submission; this plugin has neither.
- In [platform.openai.com/plugins](https://platform.openai.com/plugins): pick the verified
  Tightknit developer identity (business verification needed), upload, then under **MCPs**
  connect the server. Domain verification serves a token at
  `https://mcp.tightknit.ai/.well-known/openai-apps-challenge` (plain text, exact token), which
  needs a route on the MCP worker.
- Before submitting: record a walkthrough video of the five positive cases and set
  `review.demo_recording_url`, and enter reviewer credentials in **Review details**, never in
  the package.
- After publication, server tool changes are picked up and re-scanned automatically; changes
  to skills or metadata need a new ZIP.

## Cursor

Cursor reads `.cursor-plugin/plugin.json`. Listing on the Cursor marketplace is a submission to
Cursor; until then users add the server manually (README).

## Agent Skills (skills.sh)

The skills CLI installs `skills/` into 40+ agents from the public repo:
`npx skills add TightknitAI/tightknit-mcp-plugin`. It installs skills only, so the README tells
users to add the MCP server separately, and the `setup` skill walks them through it. Listing on
[skills.sh](https://skills.sh) follows from installs; there is no submission.

## MCP Registry

`server.json` describes the remote server for the [official MCP Registry](https://registry.modelcontextprotocol.io/).
Publish with `mcp-publisher` authenticated by GitHub OIDC from a workflow, as Apollo and Figma
do; the `io.github.tightknitai/` namespace is verified by the org. Add a `publish-mcp.yml`
workflow when ready.

## Gemini CLI (optional)

Figma and PostHog ship a `gemini-extension.json` (`mcpServers.<name>.httpUrl` plus
`oauth.enabled: true`). Add one if there is demand; the skills already reach Gemini CLI
through the skills CLI.

## Every release

1. `node scripts/bump-version.mjs <version>`
2. `CHANGELOG.md` entry, and `publication.release_notes` in `plugin.json`
3. `node scripts/validate.mjs && claude plugin validate . --strict`
4. Commit, tag `v<version>`, push
5. Upload a new ZIP to OpenAI if skills or metadata changed; re-publish `server.json` (if listed)
