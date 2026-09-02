# Changelog

All notable changes to this plugin are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the plugin follows semver.

## [0.1.0] - 2026-09-02

### Added

- Plugin manifests for Claude Code, Cursor, and Codex, plus an MCP Registry `server.json`, all wiring the hosted Tightknit MCP server at `https://mcp.tightknit.ai/mcp`.
- `community-manager` skill: the rules Claude follows for every Tightknit task (tenant selection, read-before-write, confirm-before-publish, destructive-tool handling, rate limits, file uploads).
- `/tightknit:setup`, `/tightknit:community-health`, `/tightknit:create-event`, and `/tightknit:onboarding-journey` slash commands.
- `scripts/validate.mjs`, a tool catalog, trigger eval scenarios, and CI.
