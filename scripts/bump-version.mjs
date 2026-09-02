#!/usr/bin/env node
/**
 * Bump the plugin version everywhere it is declared.
 *   node scripts/bump-version.mjs 0.2.0
 *
 * .claude-plugin/plugin.json is the source of truth; this script copies the version to the
 * Cursor and Codex manifests and to server.json so the validator stays green. The marketplace
 * entry deliberately carries no version.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const next = process.argv[2]
if (!next || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(next)) {
  console.error('usage: node scripts/bump-version.mjs <semver>')
  process.exit(1)
}

const files = [
  '.claude-plugin/plugin.json',
  '.cursor-plugin/plugin.json',
  '.codex-plugin/plugin.json',
  'server.json',
]
for (const f of files) {
  const p = join(ROOT, f)
  const json = JSON.parse(readFileSync(p, 'utf8'))
  const prev = json.version
  json.version = next
  writeFileSync(p, JSON.stringify(json, null, 2) + '\n')
  console.log(`${f}: ${prev} -> ${next}`)
}
console.log(`\nNow add a ${next} section to CHANGELOG.md, commit, and tag v${next}.`)
