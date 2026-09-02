### Summary

<!-- What changed and why. Link the issue if there is one. -->

### Testing

<!-- Paste the relevant part of a real Claude Code session: the skill firing and doing the right thing, or /mcp showing the server connected. -->

### Checklist

- [ ] `node scripts/validate.mjs` passes
- [ ] `claude plugin validate . --strict` passes
- [ ] Loaded with `claude --plugin-dir .` and exercised the change
- [ ] Version bumped with `node scripts/bump-version.mjs` and `CHANGELOG.md` updated (if user-visible)
- [ ] No secrets, no customer data, no machine-specific paths
