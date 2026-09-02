#!/usr/bin/env node
/**
 * Validates this plugin repository. Run before pushing:  node scripts/validate.mjs
 * CI runs the same thing, followed by `claude plugin validate .`.
 *
 * Checks:
 *  - every manifest parses, and name/version agree across Claude, Cursor, Codex, and server.json
 *  - .mcp.json points at the documented Tightknit MCP server URL
 *  - the marketplace entry does not carry its own version (plugin.json is the source of truth)
 *  - every skill has frontmatter with a matching name and a usable description
 *  - every MCP tool a skill references exists in scripts/tool-catalog.json
 *  - no committed secrets or machine-specific paths
 *  - every eval scenario names a skill that exists
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MCP_URL = 'https://mcp.tightknit.ai/mcp'
const RESERVED_MARKETPLACE_NAMES = new Set([
  'claude-code-marketplace', 'claude-code-plugins', 'claude-plugins-official', 'claude-plugins-community',
  'claude-community', 'anthropic-marketplace', 'anthropic-plugins', 'agent-skills', 'anthropic-agent-skills',
  'knowledge-work-plugins', 'life-sciences', 'claude-for-legal', 'claude-for-financial-services',
  'financial-services-plugins', 'first-party-plugins', 'healthcare',
])

const errors = []
const warnings = []
const err = (file, msg) => errors.push(`${file}: ${msg}`)
const warn = (file, msg) => warnings.push(`${file}: ${msg}`)
const rel = (p) => p.replace(ROOT + '/', '')
const readJSON = (p) => {
  if (!existsSync(p)) { err(rel(p), 'missing'); return null }
  try { return JSON.parse(readFileSync(p, 'utf8')) }
  catch (e) { err(rel(p), `invalid JSON: ${e.message}`); return null }
}
const dirs = (p) => existsSync(p) ? readdirSync(p).filter(d => statSync(join(p, d)).isDirectory()) : []

// ---------- manifests ----------
const plugin = readJSON(join(ROOT, '.claude-plugin', 'plugin.json'))
const marketplace = readJSON(join(ROOT, '.claude-plugin', 'marketplace.json'))
const mcp = readJSON(join(ROOT, '.mcp.json'))
const cursor = readJSON(join(ROOT, '.cursor-plugin', 'plugin.json'))
const codex = readJSON(join(ROOT, '.codex-plugin', 'plugin.json'))
const codexMarketplace = readJSON(join(ROOT, '.agents', 'plugins', 'marketplace.json'))
const server = readJSON(join(ROOT, 'server.json'))
const catalog = readJSON(join(ROOT, 'scripts', 'tool-catalog.json'))

const SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/
let name = null, version = null

if (plugin) {
  const f = '.claude-plugin/plugin.json'
  name = plugin.name
  version = plugin.version
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) err(f, `name "${name}" must be lowercase-kebab-case`)
  if (!version || !SEMVER.test(version)) err(f, `version "${version}" is not semver`)
  if (!plugin.description) err(f, 'missing description')
  if (!plugin.mcpServers) err(f, 'missing mcpServers — the plugin exists to wire the MCP server')
  if (plugin.mcpServers && typeof plugin.mcpServers === 'string' && !existsSync(resolve(ROOT, plugin.mcpServers))) err(f, `mcpServers path ${plugin.mcpServers} does not exist`)
  if (plugin.skills && typeof plugin.skills === 'string' && !existsSync(resolve(ROOT, plugin.skills))) err(f, `skills path ${plugin.skills} does not exist`)
  for (const k of ['homepage', 'repository', 'license']) if (!plugin[k]) warn(f, `no ${k}`)
}

if (marketplace) {
  const f = '.claude-plugin/marketplace.json'
  if (!marketplace.name) err(f, 'missing name')
  else if (RESERVED_MARKETPLACE_NAMES.has(marketplace.name)) err(f, `marketplace name "${marketplace.name}" is reserved by Anthropic`)
  if (!marketplace.owner?.name) err(f, 'owner.name is required')
  const entries = marketplace.plugins || []
  if (entries.length !== 1) err(f, `expected exactly one plugin entry, found ${entries.length}`)
  for (const e of entries) {
    if (e.name !== name) err(f, `entry name "${e.name}" does not match plugin.json name "${name}"`)
    if (e.source !== './') err(f, `entry source should be "./" (the plugin lives at the repo root), found ${JSON.stringify(e.source)}`)
    if (e.version) err(f, 'entry carries a version — remove it; Claude Code always uses plugin.json and a stale copy here confuses reviewers')
    if (!e.description) warn(f, 'entry has no description (shown in /plugin browse)')
  }
}

if (mcp) {
  const f = '.mcp.json'
  const servers = mcp.mcpServers || {}
  const keys = Object.keys(servers)
  if (keys.length === 0) err(f, 'no mcpServers defined')
  for (const k of keys) {
    const s = servers[k]
    if (s.type !== 'http') err(f, `${k}: type must be "http" (Streamable HTTP), found ${JSON.stringify(s.type)}`)
    if (s.url !== MCP_URL) err(f, `${k}: url must be ${MCP_URL}, found ${JSON.stringify(s.url)}`)
    if (s.headers && Object.keys(s.headers).some(h => /auth|token|key|secret/i.test(h))) err(f, `${k}: never ship auth headers — the server uses OAuth`)
    if (s.env) err(f, `${k}: remote servers take no env block`)
  }
}

for (const [label, m] of [['.cursor-plugin/plugin.json', cursor], ['.codex-plugin/plugin.json', codex]]) {
  if (!m) continue
  if (m.name !== name) err(label, `name "${m.name}" != plugin.json "${name}"`)
  if (m.version !== version) err(label, `version ${m.version} != plugin.json ${version} — run: node scripts/bump-version.mjs ${version}`)
  if (m.mcpServers && typeof m.mcpServers === 'string' && !existsSync(resolve(ROOT, m.mcpServers))) err(label, `mcpServers path ${m.mcpServers} does not exist`)
  if (m.skills && typeof m.skills === 'string' && !existsSync(resolve(ROOT, m.skills))) err(label, `skills path ${m.skills} does not exist`)
}
if (codexMarketplace) {
  const e = (codexMarketplace.plugins || [])[0]
  if (!e || e.name !== name) err('.agents/plugins/marketplace.json', `first plugin entry must be named "${name}"`)
}
if (server) {
  const f = 'server.json'
  if (server.version !== version) err(f, `version ${server.version} != plugin.json ${version}`)
  const remote = (server.remotes || [])[0]
  if (!remote || remote.url !== MCP_URL) err(f, `remotes[0].url must be ${MCP_URL}`)
  if (remote && remote.type !== 'streamable-http') err(f, 'remotes[0].type must be "streamable-http"')
}

// ---------- skills ----------
const knownTools = new Set(Object.values(catalog?.tools || {}).flat())
const notTools = new Set(catalog?.non_tool_identifiers || [])
const TOOL_TOKEN = /`((?:list|get|create|edit|update|delete|add|remove|set|search|give|archive|unarchive|activate|deactivate|move|prepare|submit)_[a-z_]+)`/g
const FORBIDDEN_PATHS = [/\/Users\/[a-z]/i, /\/home\/(?!user\b)[a-z]/i, /[A-Z]:\\Users\\/]
const SECRETS = [
  { re: /\bsk_[A-Za-z0-9]{16,}/, what: 'Tightknit API key' },
  { re: /\bsk-[A-Za-z0-9]{16,}/, what: 'OpenAI-style key' },
  { re: /\bghp_[A-Za-z0-9]{20,}/, what: 'GitHub token' },
  { re: /\bxox[bapr]-[A-Za-z0-9-]{10,}/, what: 'Slack token' },
  { re: /\bAKIA[0-9A-Z]{16}\b/, what: 'AWS access key id' },
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, what: 'private key' },
]

function parseFrontmatter(text, file) {
  if (!text.startsWith('---\n')) { err(file, 'missing YAML frontmatter'); return null }
  const end = text.indexOf('\n---', 4)
  if (end === -1) { err(file, 'unterminated frontmatter'); return null }
  const fm = {}
  let key = null
  for (const line of text.slice(4, end).split('\n')) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (m) { key = m[1]; fm[key] = m[2]; continue }
    if (key && line.trim()) fm[key] += ' ' + line.trim()
  }
  for (const k of Object.keys(fm)) fm[k] = fm[k].replace(/^[>|][-+]?\s*/, '').replace(/^["']|["']$/g, '').trim()
  return fm
}

const skillsDir = join(ROOT, 'skills')
const skillNames = new Set()
const skillDirs = dirs(skillsDir)
if (skillDirs.length === 0) err('skills/', 'no skills found')
for (const sd of skillDirs) {
  const file = join(skillsDir, sd, 'SKILL.md')
  const f = rel(file)
  if (!existsSync(file)) { err(`skills/${sd}`, 'no SKILL.md'); continue }
  const text = readFileSync(file, 'utf8')
  const fm = parseFrontmatter(text, f)
  if (!fm) continue

  if (!fm.name) err(f, 'frontmatter missing "name" — without it the invocation name changes whenever the directory is renamed')
  else {
    if (fm.name !== sd) err(f, `frontmatter name "${fm.name}" != directory "${sd}"`)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name)) err(f, `name "${fm.name}" must be lowercase-kebab-case`)
    if (skillNames.has(fm.name)) err(f, 'duplicate skill name')
    skillNames.add(fm.name)
  }
  if (!fm.description) err(f, 'frontmatter missing "description" — the skill will never trigger')
  else {
    if (fm.description.length < 60) err(f, `description is ${fm.description.length} chars — too short to trigger reliably (min 60)`)
    if (fm.description.length > 1024) err(f, `description is ${fm.description.length} chars — exceeds the 1024 limit`)
    if (!/\buse (this |it )?when\b|\buse whenever\b|\bwhenever\b|\btrigger\b/i.test(fm.description)) warn(f, 'description does not say when to use the skill')
  }
  for (const k of ['user-invocable', 'disable-model-invocation']) {
    if (fm[k] !== undefined && !/^(true|false|yes|no|on|off|1|0)$/i.test(fm[k])) err(f, `${k} must be a boolean, found "${fm[k]}"`)
  }

  const unknown = new Set()
  for (const m of text.matchAll(TOOL_TOKEN)) if (!knownTools.has(m[1]) && !notTools.has(m[1])) unknown.add(m[1])
  for (const t of unknown) err(f, `references tool \`${t}\` which is not in scripts/tool-catalog.json — typo, or the catalog needs updating`)

  text.split('\n').forEach((line, i) => {
    if (line.includes('validate:allow-path')) return
    for (const re of FORBIDDEN_PATHS) { const m = line.match(re); if (m) err(`${f}:${i + 1}`, `machine-specific path "${m[0]}"`) }
  })
  for (const { re, what } of SECRETS) if (re.test(text)) err(f, `looks like a committed ${what} — remove it and rotate`)
  if ((text.match(/TODO:/g) || []).length) warn(f, 'contains TODO: markers — an agent reads these as content')
  const lines = text.split('\n').length
  if (lines > 500) warn(f, `${lines} lines — move reference material into references/ and link to it`)
}

// ---------- evals ----------
const evalsPath = join(ROOT, 'evals', 'scenarios.json')
const evals = readJSON(evalsPath)
if (evals) {
  const f = 'evals/scenarios.json'
  if (!Array.isArray(evals.scenarios) || evals.scenarios.length === 0) err(f, 'scenarios must be a non-empty array')
  for (const [i, s] of (evals.scenarios || []).entries()) {
    const label = `${f} #${i + 1}`
    if (!s.prompt) err(label, 'missing prompt')
    if (s.expected_skill !== null && !skillNames.has(s.expected_skill)) err(label, `expected_skill "${s.expected_skill}" is not a skill in skills/`)
    for (const t of s.expected_tools || []) if (!knownTools.has(t)) err(label, `expected tool "${t}" is not in scripts/tool-catalog.json`)
  }
}

// ---------- README mentions every user-invocable skill ----------
const readme = existsSync(join(ROOT, 'README.md')) ? readFileSync(join(ROOT, 'README.md'), 'utf8') : ''
for (const s of skillNames) if (!readme.includes(`/${name}:${s}`)) warn('README.md', `does not mention /${name}:${s}`)

// ---------- report ----------
console.log(`\nChecked ${skillNames.size} skill(s), ${(evals?.scenarios || []).length} eval scenario(s), ${knownTools.size} catalogued tools.\n`)
if (warnings.length) { console.log(`⚠  ${warnings.length} warning(s):`); warnings.forEach(w => console.log('  ' + w)); console.log('') }
if (errors.length) { console.log(`✖  ${errors.length} error(s):`); errors.forEach(e => console.log('  ' + e)); console.log(''); process.exit(1) }
console.log('✔  plugin is valid.\n')
