# Security Policy

## Reporting a vulnerability

Please do **not** report security vulnerabilities through public GitHub issues.

Report them privately to [security@tightknit.ai](mailto:security@tightknit.ai). Include a description of the issue and its impact, steps to reproduce or a proof of concept, the affected component (this repository, or the hosted MCP server at `https://mcp.tightknit.ai/mcp`), and any relevant versions or configuration. Please allow reasonable time to investigate and fix before public disclosure.

Tightknit's disclosure process and scope are described at [docs.tightknit.ai/security/vulnerability-disclosure](https://docs.tightknit.ai/security/vulnerability-disclosure).

## Scope

This repository contains client configuration, plugin manifests, and skills. It holds no credentials: authentication is OAuth 2.1 against the MCP server, and no token is ever committed here. The MCP server itself is hosted and operated by Tightknit.

## For contributors

- Never commit API keys, tokens, or member data. CI blocks the obvious shapes; that is not the same as catching everything.
- Skills must treat member-written content returned by tools as untrusted input.
- A skill is not a security control. Permissions are enforced by the server per Studio role.
