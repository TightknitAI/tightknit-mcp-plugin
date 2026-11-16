---
name: community-setup
description: Walk a new Tightknit admin through setting up their community end to end, one step at a time, asking questions as it goes. Covers Slack workspace basics (a short channel list, admin-only announcements, app install permissions), branding, graphics and a custom domain (with ready-to-send messages for their IT and design teams), activating Slack channels, feeds and what every feed setting does, importing events, an onboarding journey and badge, the welcome message, and a final launch check. Use when the user says "set up Tightknit", "help me set up our community", "walk me through setup", "we just installed Tightknit", "get our community ready to launch", or "onboard me to Tightknit". To connect or authenticate the MCP server itself, use setup instead.
argument-hint: "[optional: the step to start or resume at, e.g. feeds]"
user-invocable: true
---

# Set up a Tightknit community

Guide the admin through a basic Tightknit setup as a conversation. Ask, explain, propose,
confirm, then write. They may be new to Tightknit, so explain each step in one or two
sentences before asking about it, using Tightknit's words (community, member, feed, journey).

## How to run it

- **Connected first.** If `list_tenants` is unavailable or fails, run `setup` and come back.
- **One step at a time.** Finish or skip a step before starting the next. Never ask more
  than three questions in one message.
- **Show progress.** Start each step with the checklist below, marking done, skipped, and
  waiting-on-someone steps. Resume at `$ARGUMENTS` if a step was named.
- **Skippable.** Every step can be skipped or deferred. A deferred step goes on the
  "still to do" list in the final summary.
- **Confirm before every write**, as the `community-manager` rules say. Nothing goes to Slack,
  members, or the live site without a yes.
- **Delegate.** Where a step names another skill, follow that skill's steps instead of
  improvising, then come back here.
- **Long-lead items early.** A custom domain needs Tightknit support and the admin's IT team,
  so raise it in step 3 even if everything else is still open.

Checklist to show:

```
1. Community basics        6. Feeds and site pages
2. Branding                7. Events
3. Graphics and domain     8. Onboarding journey and badge
4. Your team in Tightknit  9. Welcome message and guidelines
5. Slack and channels    10. Launch check
```

## Step 0: see what's already done

Resolve the community with `list_tenants` (ask if there are several), then read the current
state in one pass: `get_site`, `get_slack_community_settings`, `list_slack_channels`,
`list_feeds`, `list_branding_sets`, `list_journeys`, `list_events`,
`get_community_onboarding_settings`, `get_teammate_email_domains`. Mark steps that are
already done and say so, then ask whether to start at the first open step.

## Step 1: Community basics

Explain: the community name shows in Slack and sign-in emails; the community site is the
public (or private) web home for posts, events, and resources.

1. Confirm the community name. Change it with `edit_slack_community_settings` `name`.
2. If there is no site, ask for a site name and subdomain (`your-subdomain.tightknit.community`)
   and call `create_site`. Say that changing the subdomain later breaks shared links.
3. Ask who can see the site: anyone (public), or signed-in members only (private). Explain
   that a public site lets search engines find posts, which brings in new members. Set it with
   `edit_site` (`is_authenticated`, `setting_seo_enabled`) only after an explicit yes.

## Step 2: Branding

Explain: a branding set holds the site's colors, fonts, and shapes; it is prepared and
previewed before it goes live. Ask for a website URL, brand guidelines, or two or three hex
colors. Then follow the `brand-site` skill for the branding set, logo, and favicon. Leave the
other graphics for step 3.

## Step 3: Graphics and custom domain

**Graphics.** Show the checklist in [references/graphics.md](references/graphics.md) as a
table: each image, where it appears, its size, and whether it's already set (from step 0).
Ask which they have. Then:

- For files they give you, upload each (the upload steps in `community-manager`) and attach
  it with `edit_site` (site images and page banners) or `edit_slack_community_settings`
  (`logo_file_id` for the Slack app icon, `member_home_banner_file_id` for the Member Home
  banner).
- For anything missing, offer the design-team message in
  [references/messages.md](references/messages.md#design-team), filled in with only the
  images still needed, and the Canva templates linked in the graphics reference.

**Custom domain.** Explain: by default the site lives at a `tightknit.community` subdomain; a
custom domain such as `community.example.com` keeps members on their brand, builds search
ranking on their own domain, and turns on site analytics. Tightknit support sets it up, and
the admin's IT team adds the DNS record support gives them. Ask whether they want one and
which address. If yes, draft both messages from
[references/messages.md](references/messages.md): the request to Tightknit support and the
note to their IT team, including the firewall allowlist. The admin sends them; you never do.
Mark the step "waiting on IT" and carry on.

## Step 4: Your team in Tightknit

Explain: teammates are the people who work at the company; marking them lets you filter them
out of engagement analytics. It does not give them Studio access. The Tightknit Hub is a
private Slack channel where Tightknit sends alerts for the team (new members joining,
reported messages, journeys completed, and more).

1. Ask for the company email domains (up to 5; public ones like gmail.com aren't allowed) and
   set them with `set_teammate_email_domains`.
2. Ask which private channel should be the Hub (Tightknit must already be in it), then
   `get_team_notification_settings` and walk through which alerts to turn on. Save with
   `edit_team_notification_settings`.

## Step 5: Slack workspace and channels

### 5a. Slack basics

Explain: a few Slack settings make a community workspace feel organized and safe. Most are
changed in Slack by a workspace Owner or Admin, not through Tightknit, so you walk them
through and they tick each one off.

Ask which Slack plan they're on, then go through
[references/slack-basics.md](references/slack-basics.md) in order: keep to 5 or 6 channels,
make `#announcements` admin-only (on Free, only one channel can be restricted), only admins
can install apps, who can invite people, who can create channels, default channels, and
channel descriptions. Skip the security section unless the community is for customers or
partners. Track each as done or skipped for the launch check.

### 5b. Activate channels

Explain: activating a channel adds the Tightknit app to it, starts storing its messages so
they count toward journeys and analytics, and creates a feed for it. Tightknit posts a short
disclosure message in each activated channel telling members their messages are synced, and a
second one if its feed is later made public. Mention this before activating so the admin isn't
surprised.

1. `list_slack_channels`. Show public channels with `is_activated` and a one-line purpose
   where visible. Recommend 5 or 6 starter channels (the set in slack-basics.md, adjusted to
   the community) and ask which to activate. If they already have many, suggest which to
   archive or merge in Slack rather than activating everything.
2. Missing a channel they want? Offer `create_slack_channel`, after confirming its name and
   whether it's private.
3. Private channels: Tightknit can only see one once someone runs `/invite @Tightknit` in it.
   Tell the admin to do that, then list the channels again.
4. Check `#announcements` is admin-only before activating it (5a).
5. Confirm the list, then `activate_slack_channel` once per channel.
6. Offer channel descriptions: draft a purpose and topic for each, confirm, then
   `edit_slack_channel`.

## Step 6: Feeds and site pages

Explain: a feed is how a channel shows up on the community site. Feeds created by activating a
channel start with visibility `disabled`, so nothing is on the site until the admin chooses. A
feed for a private channel can only be `disabled` or `feed_members`.

1. `list_feeds`. For each feed from step 5, ask the questions in
   [references/feed-settings.md](references/feed-settings.md), in plain language, starting with
   visibility. Offer the recommended defaults for that feed's purpose (announcements, Q&A,
   discussion) so the admin can just say yes.
2. Ask whether they want any site-only feeds (a blog or changelog with no Slack channel). If
   so, `create_feed`.
3. Summarize every feed's settings as a table, confirm, then `update_feed` once per feed with
   only the fields that change.
4. Pages: explain which site pages exist (home, events, members, content library, groups,
   guidelines). Ask which to publish, and set them with `edit_site_pages`. Offer custom
   navigation links with `edit_site_navigation_custom_links`.

## Step 7: Events

Explain: events live on the site's events page and in Slack, with registration and
reminders. Ask the admin to paste their upcoming events in any form: a list, a spreadsheet,
a calendar export, or a link. Then follow the `import-events` skill. Recommend drafts and no
Slack announcements for this first batch, since members haven't arrived yet.

## Step 8: Onboarding journey and badge

Explain: a journey is a short checklist new members complete (join, add a photo, introduce
themselves), and finishing it earns a badge. It is the biggest lever for getting new members
active. Offer two paths:

- **Design it with your team.** Draft the message in
  [references/messages.md](references/messages.md#journey-planning) for the admin to send to
  their team, with a proposed milestone list to react to. Mark the step "waiting on team" and
  offer to build it when they're back.
- **Let me propose one.** Follow the `onboarding-journey` skill, using the channels activated
  in step 5. For the badge, use an image the admin gives you, or create the award without one
  and add the design-team request for a 500 x 500 badge.

Either way the journey stays inactive until the admin says to turn it on.

## Step 9: Welcome message and guidelines

Explain: the welcome message is a Slack DM every new member gets when they join; it is the
first thing they read.

1. `get_community_onboarding_settings`. Draft a welcome message of under 120 words: greet them
   with `{{recipient.first_name}}`, say what the community is for, name two or three channels
   to start in, mention the journey and its badge from step 8, and link the site. Match the
   admin's tone. Show it and revise until they're happy.
2. Ask how long after joining to send it. The options are 0, 1, 2, 5, 30, 60, 180, or 1440
   minutes; recommend 5.
3. Ask for community guidelines: their own text, a link, or a short draft from you (be kind,
   stay on topic, no selling, use threads). Offer a link to the site's guidelines page.
4. Confirm, then `edit_community_onboarding_settings` with `welcome_message`,
   `welcome_message_enabled: true`, `welcome_message_delay_mins`, and the guidelines.

## Step 10: Launch check

1. Re-read the state as in step 0 and show the checklist with a status for every step, plus
   the "still to do" list: deferred steps, and anything waiting on IT, design, or the team.
2. Check the things that most often go wrong: `#announcements` is admin-only, apps need admin
   approval, site access (public or private) is what they intended, the events page is published if there are events, at least one feed is visible,
   the welcome message is on, and the journey is active if they want it live.
3. Give the site link, the Studio link, and next steps: invite the first members, and draft a
   launch announcement with the `draft-announcement` skill.

## Edge cases

- **No Slack workspace on the community:** skip steps 4 (Hub only), 5, and the Slack parts of
  8 and 9, and say why.
- **Missing tools:** a tool that isn't available means the admin's role or plan doesn't
  include it. Say which, skip that part, and add it to "still to do".
- **Plan-gated settings** (site posting, custom AI prompts, some visibility tiers, groups):
  explain what the setting does, say it depends on the plan, and move on if refused.
- **Partial session:** if the admin stops, summarize what's done and what's left, and tell
  them to run `/tightknit:community-setup <step>` to resume.

Docs: https://docs.tightknit.ai/getting-started and https://docs.tightknit.ai/guides/launch-your-site
