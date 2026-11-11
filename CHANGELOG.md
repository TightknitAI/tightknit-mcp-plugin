# Changelog

All notable changes to this plugin are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the plugin follows semver.

## [0.2.0] - 2026-11-02

### Added

- Portable Agent Plugins manifests (`plugin.json`, `mcp.json`) for the OpenAI plugin directory, which serves ChatGPT and Codex: listing metadata, the `setup` onboarding skill, review test cases, and OAuth dynamic client registration.
- `unanswered-questions`, `member-brief`, and `draft-announcement` skills.
- Agent Skills install for any supporting agent: `npx skills add TightknitAI/tightknit-mcp-plugin`.
- 56 server tools added to the tool catalog, including Message Blaster compositions, member notes, selected answers, event registrants, feed members, and Slack channel tools.
- Validator checks for the portable manifests, and a "What this plugin runs and sends" section in the README.

### Fixed

- Privacy policy and terms URLs in the Codex manifest pointed at pages that 404.

## [0.1.0] - 2026-09-02

### Added

- Plugin manifests for Claude Code, Cursor, and Codex, plus an MCP Registry `server.json`, all wiring the hosted Tightknit MCP server at `https://mcp.tightknit.ai/mcp`.
- `community-manager` skill: the rules Claude follows for every Tightknit task (tenant selection, read-before-write, confirm-before-publish, destructive-tool handling, rate limits, file uploads).
- `/tightknit:setup`, `/tightknit:community-health`, `/tightknit:create-event`, and `/tightknit:onboarding-journey` slash commands.
- `scripts/validate.mjs`, a tool catalog, trigger eval scenarios, and CI.
