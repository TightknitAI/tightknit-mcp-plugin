# Slack workspace basics

Most of these are Slack settings that only a Slack workspace Owner or Admin can change, in
Slack itself. The Tightknit tools cannot change them, so walk the admin through each one and
ask them to say "done" or "skip". Slack moves its menus from time to time; if a path doesn't
match what they see, tell them to search Slack's help center for the setting's name.

First ask: **which Slack plan is the workspace on** (Free, Pro, Business+, or Enterprise
Grid)? Several answers below depend on it.

## 1. Keep the channel list short

Recommend **5 to 6 channels** to start. A new community with many quiet channels feels empty;
a few busy ones feel alive. Add channels later when a topic keeps coming up in another one.

A starter set to propose, adjusted to the community's purpose:

| Channel | For |
| --- | --- |
| `#welcome-start-here` | First stop: community norms and how things work |
| `#announcements` | Updates from the team, admins only |
| `#introductions` | New members say hello (pairs with the onboarding journey) |
| `#general` | Open conversation |
| `#help` | Questions and support |
| `#events` | Event announcements and discussion (optional) |

## 2. Make announcements admin-only

Members should read `#announcements`, not post in it. In Slack: open the channel, click its
name, go to **Settings**, and under **Posting permissions** choose admins only (or specific
people). Do this before activating the channel in Tightknit.

**Free plan:** Slack lets you restrict posting in only one channel, the workspace's default
channel (usually `#general`). If they're on Free, suggest one of these:

- Rename `#general` to `#announcements` and restrict posting there, and use another channel
  (for example `#chat`) for open conversation.
- Or keep `#general` open and accept that announcements can get replies; ask members to reply
  in threads.

On any paid plan, posting permissions can be set on any channel.

## 3. Only admins can install apps

Without this, any member can add apps to a community workspace, including ones that read
messages. In Slack: **Tools & settings > Workspace settings > Permissions**, then the app
management settings. Turn on app approval, or restrict app installs to Workspace Owners and
Admins. Where approval is on, Owners and Admins review each request.

## 4. Who can invite people

**Tools & settings > Workspace settings > Invitations.** "Admins only" for an invite-only or
customer-only community; "All members" for an open one. Tightknit's `/invite-all` and
`/invite-channel` commands help admins add existing members to channels later.

## 5. Who can create channels

**Workspace settings > Permissions > Channel Management.** Restrict creating public channels
to admins so the channel list stays at 5 or 6. Members can still create private channels
unless that's restricted too.

## 6. Default channels

**Workspace settings > Default Channels.** Every new member is added to these on joining. Set
the starter channels from section 1 (at least `#welcome-start-here`, `#announcements`,
`#general`, and `#help`).

## 7. Channel descriptions

Every channel needs a one-line description so members know what goes where. Offer to write
them with `edit_slack_channel` (`purpose` is the description, `topic` the line under the
channel name), using this pattern:

> Purpose: [what the channel is for]. Post here: [what belongs]. Not here: [where else to go].

## 8. Things worth knowing on the Free plan

- Slack Free only shows the last 90 days of message history. Posts synced to the community
  site from activated channels stay on the site.
- Posting permissions: one channel only (section 2).

## 9. Security, if the community is for customers or partners

- **Two-factor authentication:** Owners can require it for everyone under
  **Workspace settings > Authentication**.
- **Guests:** single- and multi-channel guests (paid plans) limit someone to certain
  channels. See https://docs.tightknit.ai/slack/guests
- **Separate workspace:** a community belongs in its own workspace, not the company's
  internal one. See https://docs.tightknit.ai/guides/where-to-install-tightknit

Sources: https://docs.tightknit.ai/guides/create-your-slack-workspace and
https://docs.tightknit.ai/guides/create-your-core-channels
