# Slack workspace basics

Most of these are Slack settings that only a Slack workspace Owner or Admin can change, in
Slack itself. The Tightknit tools cannot change them, so walk the admin through each one and
ask them to say "done" or "skip". When the admin asks you to do one of these, say it's a Slack
setting, then tell them where it is. Slack moves its menus from time to time; if a path
doesn't match what they see, link the Slack help article given for that setting.

First ask: **which Slack plan is the workspace on** (Free, Pro, Business+, or Enterprise)?
Several answers below depend on it.

## 1. Workspace basics

- **Name and URL:** short, memorable, and on brand. Both appear in every invitation and
  shared link.
- **A workspace just for the community**, not the company's internal one, unless the company
  is on Enterprise Grid. See https://docs.tightknit.ai/guides/where-to-install-tightknit
- **Roles:** put the Primary Owner role on a shared company account, not one person's, and
  give admin rights only to the people who need them.
  https://slack.com/help/articles/201314026-Roles-and-permissions-in-Slack

## 2. Keep the channel list short

Recommend **5 or 6 channels** to start. A new community with many quiet channels feels empty;
a few busy ones feel alive. Add channels later when a topic keeps coming up in another one,
and archive channels that go quiet rather than leaving them empty.

A starter set to propose, adjusted to the community's purpose:

| Channel | For |
| --- | --- |
| `#welcome-start-here` | First stop: community norms and how things work |
| `#announcements` | Updates from the team, admins only |
| `#introductions` | New members say hello (pairs with the onboarding journey) |
| `#general` | Open conversation |
| `#help` | Questions and support |
| `#events` | Event announcements and discussion (optional) |

For a product community, `#product-feedback` or `#resources` can replace `#events`.

## 3. The workspace-wide channel and admin-only announcements

Every workspace has one workspace-wide channel (`#general`, or `#all-<workspace>` on newer
workspaces). Every member is added to it and can't leave. It can be renamed but not archived
or made private.

Members should read `#announcements`, not post in it. Posting permissions are set in the
channel: click its name, open the **Settings** tab, then **Posting permissions**.
https://slack.com/help/articles/360004635551

**Free and Pro plans: only one channel can have restricted posting.** Business+ and
Enterprise can restrict any channel. On Free or Pro, recommend:

- Rename the workspace-wide channel to `#announcements` and set posting to admins only,
  **before inviting anyone**. Members are all in it automatically, so nobody misses an update.
- Create a new channel (for example `#general` or `#chat`) for open conversation.

The restriction can be moved to another channel later, but choose with care. Owners can also
limit who may change posting permissions. Do this before activating the channel in Tightknit.

## 4. Only admins can install apps

Without this, any member can add apps to the workspace, including ones that read messages.
A Workspace Owner turns it on: **Admin > Apps and workflows > App Management Settings >
Require approved apps**, then chooses who approves requests (App Managers; by default the
Owners). https://slack.com/help/articles/222386767

## 5. Other permissions to restrict

Settings live under **Admin > Workspace settings**:

- **Channel creation:** a Workspace Owner limits it under **Roles & permissions > Account
  types** (Create public channels, Create private channels), so the list stays at 5 or 6.
  https://slack.com/help/articles/115004988303
- **Inviting people:** under **Permissions > Invitations**, turn on **Require admin
  approval** for an invite-only or customer community; leave it open for an open one.
  https://slack.com/help/articles/115004854783
- **Who can change posting permissions:** Owners can limit it under **Roles & permissions >
  Account types**.
- **@channel and @here:** admins only, or at least limited in large channels.

Also decide how people join: an invite link, approved email domains, or requests to join.

## 6. Default channels

**Admin > Workspace settings > Default Channels.** New members are added to these when they join.
Set at least `#welcome-start-here`, `#introductions`, and `#help` (the workspace-wide
channel is automatic). https://slack.com/help/articles/201898998

- Only public channels can be defaults, and guests aren't added to them.
- Changing defaults doesn't add people already in the workspace. Use Tightknit's
  `/invite-channel` or `/invite-all` to add them.
- If the welcome message or journey points to a channel, make sure it's a default channel.

## 7. Channel names, descriptions, and order

Every channel needs a clear name and a one-line description so members know what goes where.
Offer to write them with `edit_slack_channel` (`purpose` is the description, `topic` the line
under the channel name), using this pattern:

> Purpose: [what the channel is for]. Post here: [what belongs]. Not here: [where else to go].

To control the order channels appear in, prefix names with numbers (`01-welcome`,
`02-announcements`).

## 8. Analytics need activation

Activate every channel you want analytics or journey credit for in Tightknit (step 5b), even
ones you won't show on the site as feeds.

## 9. Free plan limits worth knowing

- Members see only the last 90 days of messages, and data older than one year is deleted.
  Posts synced to the community site from activated channels stay on the site.
- One restricted posting channel (section 3).
- Up to 10 apps, Tightknit included.
- No workflows, guests, user groups, or new canvases and lists; huddles are one-on-one.
- Basic Slack analytics only. Tightknit's analytics cover activated channels on any plan.

## 10. Security, if the community is for customers or partners

- **Message retention:** set it to match the company's compliance needs.
  https://slack.com/help/articles/203457187-Customize-data-retention-in-Slack
- **Two-factor authentication:** Owners can require it for everyone, on any plan, under
  **Admin > Workspace settings > Security**. https://slack.com/help/articles/212221668
- **Guests** (paid plans): limit someone to certain channels. See
  https://docs.tightknit.ai/slack/guests

Sources: https://docs.tightknit.ai/guides/create-your-slack-workspace,
https://docs.tightknit.ai/guides/create-your-core-channels, and Slack's help center.
