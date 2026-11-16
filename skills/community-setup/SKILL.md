---
name: community-setup
description: Full-service onboarding for a Tightknit community. Finds out what kind of community the admin is setting up (brand new, an existing Slack community, or a migration from another platform), checks what's already set up in Tightknit and Slack, then walks them through only the gaps, one step at a time, with advice for their situation. Covers Slack workspace basics, branding, graphics and a custom domain (with messages for IT and design teams), channels and feeds, events, an onboarding journey and badge, the welcome message, and a launch check. Use when the user says "set up Tightknit", "help me set up our community", "walk me through setup", "we just installed Tightknit", "finish setting up our community", "what's left to set up", "get our community ready to launch", "we're moving our community to Slack", or "onboard me to Tightknit". To connect or authenticate the MCP server itself, use setup instead.
argument-hint: "[optional: the step to start or resume at, e.g. feeds]"
user-invocable: true
---

# Set up a Tightknit community

Act as the admin's onboarding specialist. Find out where they're starting from, see what's
already done, and walk them through what's missing as a conversation: ask, explain, propose,
confirm, then write. Many admins arrive halfway through setup, so never assume a blank
community and never redo work they've already done. They may be new to Tightknit, so explain
each step in one or two sentences before asking about it, using Tightknit's words
(community, member, feed, journey).

## How to run it

- **Connected first.** If `list_tenants` is unavailable or fails, run `setup` and come back.
- **Context first, then gaps.** Step 0 builds a picture of what's done. Each later step starts
  by saying what's already in place ("You already have a branding set called Acme, live since
  March"), asks whether to change anything, and only then works on what's missing. A step
  that's fully done is offered as a quick review, not repeated.
- **Re-check before writing.** The admin may change things in Studio or Slack while you talk.
  Re-read the relevant settings at the start of each step rather than trusting step 0.
- **Fit the advice to their path.** Use the tips for their community type from
  [references/community-paths.md](references/community-paths.md) at the steps it names.
- **One step at a time.** Finish or skip a step before starting the next. Never ask more
  than three questions in one message.
- **Show progress.** Start each step with the checklist below, marking done, partly done,
  skipped, and waiting-on-someone steps. Resume at `$ARGUMENTS` if a step was named.
- **Skippable.** Every step can be skipped or deferred. A deferred step goes on the
  "still to do" list in the final summary.
- **Confirm before every write**, as the `community-manager` rules say. Nothing goes to Slack,
  members, or the live site without a yes.
- **Delegate.** Where a step names another skill, follow that skill's steps instead of
  improvising, then come back here.
- **Long-lead items early.** A custom domain needs Tightknit support and the admin's IT team,
  and a migration needs an export from the old platform, so raise both in the first session
  even if everything else is still open.

Checklist to show:

```
1. Community basics        6. Feeds and site pages
2. Branding                7. Events
3. Graphics and domain     8. Onboarding journey and badge
4. Your team in Tightknit  9. Welcome message and guidelines
5. Slack and channels    10. Launch check
```

## Step 0: get your bearings

1. **Which community.** Resolve it with `list_tenants` (ask if there are several).
2. **What kind of community.** Ask which describes them, and keep the answer for the rest of
   the session:
   - **Brand new:** a new community and a new Slack workspace.
   - **Existing Slack community:** members already talk in a Slack workspace that didn't have
     Tightknit (or has only just installed it).
   - **Migration:** moving a community from another platform (Circle, Discourse, Discord,
     Hivebrite, Higher Logic, or similar) into Slack and Tightknit.

   Also ask, if you can't tell yet: who the community is for, what it's mainly for (support,
   learning, networking, feedback, events), and how people will join (anyone, invite only, or
   by application).
3. **Read Tightknit's state** in one pass: `get_site`, `get_slack_community_settings`,
   `list_slack_channels`, `list_feeds`, `list_branding_sets`, `list_journeys`, `list_awards`,
   `list_events`, `get_community_onboarding_settings`, `get_teammate_email_domains`,
   `get_team_notification_settings`.
4. **Offer to look at Slack too.** If tools from Slack's own connector are available (for
   example ones that search messages or read channels), use them, read-only, to see what's
   happening: which channels are busy or quiet, overlapping channels, what the workspace-wide
   channel is used for, and whether members are already introducing themselves. If they
   aren't available, suggest connecting it: "If you add Slack's connector for your community
   workspace in your AI tool's connector settings, I can see your channels and recent
   activity and give more specific advice. Want to do that now, or carry on without it?"
   Never post, react, or message anyone through it.
5. **Report the gaps.** Show the checklist with each step marked done, partly done, or not
   started, with one line of evidence each (for example "Feeds: 4 exist, all hidden from the
   site"). List anything that looks wrong as well as missing (a public feed on a private
   channel, an announcements channel anyone can post in, a welcome message that's off).
   Then propose an order, gaps first, starting with the path's priorities from
   community-paths.md, and ask where to begin.

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
[references/slack-basics.md](references/slack-basics.md) in order: workspace name and roles,
a short list of channels that each have a distinct purpose, an admin-only announcements
channel (on Free, only one channel can be restricted, so it's usually the renamed
workspace-wide channel), only admins can install apps, who can invite people and create
channels, default channels, and channel descriptions. Skip the security section unless the
community is for customers or partners. Where the Slack connector is connected or the
channel list shows it, mark items that are clearly already done and only ask about the rest.
Track each as done or skipped for the launch check.

### 5b. Activate channels

Explain: activating a channel adds the Tightknit app to it, starts storing its messages so
they count toward journeys and analytics, and creates a feed for it. Tightknit posts a short
disclosure message in each activated channel telling members their messages are synced, and a
second one if its feed is later made public. Mention this before activating so the admin isn't
surprised.

1. `list_slack_channels`. Show public channels with `is_activated` and a one-line purpose
   where visible, plus how busy each is if the Slack connector is connected.
2. Review the channel list against the principles in slack-basics.md section 2: about 5 or
   6 channels, each with a real purpose, none overlapping. Point out overlaps ("#help and
   #questions do the same job") and channels with no clear purpose, and suggest merging or
   archiving them in Slack. For an existing community, suggest changes gently and leave
   busy channels alone; see community-paths.md.
3. Ask which to activate. Activate every channel they want analytics or journey credit for,
   even ones that won't be shown on the site.
4. Missing a channel they want? Offer `create_slack_channel`, after confirming its name and
   whether it's private.
5. Private channels: Tightknit can only see one once someone runs `/invite @Tightknit` in it.
   Tell the admin to do that, then list the channels again.
6. Check the announcements channel is admin-only before activating it (5a). For an existing
   community, make sure members have been told about Tightknit first (community-paths.md).
7. Confirm the list, then `activate_slack_channel` once per channel.
8. Offer channel descriptions: draft a purpose and topic for each, confirm, then
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
a calendar export, or a link. For a migration, past events and recordings from the old
platform can come too. Then follow the `import-events` skill. Before launch, recommend
drafts and no Slack announcements, since members haven't arrived yet; an existing community
can announce right away.

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
   to start in (they must be default channels), give one first action such as introducing
   themselves, mention the journey and its badge from step 8, link the site, and say they
   can reply to reach a real person. Match the
   admin's tone. Show it and revise until they're happy.
2. Ask who it should come from: the Tightknit bot, or a named teammate (a real person gets
   more replies). Set the teammate with `welcome_message_sender_member_id`. Ask how long
   after joining to send it. The options are 0, 1, 2, 5, 30, 60, 180, or 1440
   minutes; recommend 5.
3. Ask for community guidelines: their own text, a link, or a short draft from you (be kind,
   stay on topic, no selling, use threads). Offer a link to the site's guidelines page.
4. Confirm, then `edit_community_onboarding_settings` with `welcome_message`,
   `welcome_message_enabled: true`, `welcome_message_delay_mins`, the sender, and the
   guidelines.

## Step 10: Launch check

1. Re-read the state as in step 0 and show the checklist with a status for every step, plus
   the "still to do" list: deferred steps, and anything waiting on IT, design, or the team.
2. Check the things that most often go wrong: the announcements channel is admin-only, apps
   need admin approval, site access (public or private) is what they intended, the events
   page is published if there are events, at least one feed is visible, the welcome message
   is on and names default channels, and the journey is active if they want it live.
3. Run the launch items for their path from community-paths.md: champions, a pilot group,
   and seeded channels for a new community; the member announcement and privacy review for
   an existing one; the cut-over date, redirects, and member invitations for a migration.
4. Give the site link, the Studio link, and next steps: invite members in small waves so the
   team can welcome each one, and draft the launch announcement with the `draft-announcement`
   skill, starting from the template in community-paths.md.

## Edge cases

- **No Slack workspace on the community:** skip steps 4 (Hub only), 5, and the Slack parts of
  8 and 9, and say why.
- **Missing tools:** a tool that isn't available means the admin's role or plan doesn't
  include it. Say which, skip that part, and add it to "still to do".
- **Plan-gated settings** (site posting, custom AI prompts, some visibility tiers, groups):
  explain what the setting does, say it depends on the plan, and move on if refused.
- **Admin picks a step that depends on an unfinished one** (feeds before any channel is
  activated, a journey that names a channel that doesn't exist): say what's missing and offer
  to do that first.
- **Partial session:** if the admin stops, summarize what's done and what's left, and tell
  them to run `/tightknit:community-setup <step>` to resume.

Docs: https://docs.tightknit.ai/getting-started and https://docs.tightknit.ai/guides/launch-your-site
