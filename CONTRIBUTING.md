# Contributing

Thanks for helping make Tightknit work well with AI agents.

## What belongs here

- **Skills** that encode a workflow an agent would otherwise get wrong on the Tightknit MCP server: the right order of calls, the confirmation a write needs, the edge case that fails quietly.
- **Fixes** to manifests, docs, and the validator.

What does not belong here: the MCP server itself (hosted by Tightknit), generic community-management advice the model already knows, and anything that needs a secret to run.

## Adding a skill

1. Create `skills/<kebab-name>/SKILL.md` with frontmatter `name` (must equal the directory), `description`, and, for a slash command, `user-invocable: true` and `argument-hint`.
2. Write the body: prerequisites, numbered steps naming the exact tools, an output format if it produces a report, and edge cases. Look at `skills/create-event/SKILL.md` for the shape.
3. Reference tools by bare name. If a tool is new, add it to `scripts/tool-catalog.json` with a link to where it is documented.
4. Add at least two scenarios to `evals/scenarios.json`: one that should fire the skill and one near-miss that should not.
5. Run `node scripts/validate.mjs` and `claude plugin validate . --strict`.
6. Load it with `claude --plugin-dir .`, run it against a test community, and paste the transcript into the PR.
7. Bump the version with `node scripts/bump-version.mjs` and add a `CHANGELOG.md` entry.

## Rules the validator enforces

- Frontmatter `name` matches the directory and is kebab-case; `description` is 60 to 1024 characters.
- Every backticked tool name exists in the catalog.
- No secrets (API keys, tokens, private keys), no machine-specific paths.
- Manifests agree on name and version; the marketplace entry carries no version.
- `.mcp.json` points at `https://mcp.tightknit.ai/mcp` over Streamable HTTP with no auth headers.

## Reporting problems with the server

If a tool misbehaves, that is a server issue rather than a plugin issue. Ask the agent to call `submit_feedback`, or email [support@tightknit.ai](mailto:support@tightknit.ai). Security issues: see [SECURITY.md](SECURITY.md).
