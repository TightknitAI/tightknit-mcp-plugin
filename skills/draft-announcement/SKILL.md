---
name: draft-announcement
description: Draft, review, and send or schedule a Slack announcement to a Tightknit community with Message Blaster, posting to channels or as DMs to members, groups, feed members, or event registrants, with a teammate review step and a final confirmation before anything goes out. Use when the user wants to announce something to their community, send a message or newsletter to members or channels, share a recap, or schedule a broadcast.
argument-hint: "[what to announce] [audience]"
user-invocable: true
---

# Draft an announcement

Take `$ARGUMENTS` (or the conversation) and turn it into a Message Blaster draft the admin
approves. A sent announcement reaches the community in Slack and cannot be unsent, so
delivery is the one step that always waits for an explicit yes. Drafts are private and free
to change.

## Steps

1. **Resolve the community.** `list_tenants`; ask if there are several and none was named.
2. **Pick the audience.** If the user hasn't said, ask in one question. Two kinds of
   destination, and a draft can have both:
   - **Slack channels** — `list_slack_channels` for `channel_id` values. Posts as `bot` (the
     Tightknit app) or `community` (the app under the community's name and logo), and can
     also publish to the channel's feed on the community site. The Tightknit app must be a
     member of each channel.
   - **Direct messages** — from the bot to members (`list_members`), groups (`list_groups`),
     feed members (`list_feeds`), or event registrants (`list_events`). A member in several
     of them gets one DM.
3. **Write it with the user.** In the conversation first: the point in the first line, short
   paragraphs, Slack formatting used sparingly, one call to action with its link.
4. **Save the draft.** `create_composition` with a clear `label`, the `markdown`, and the
   `deliveries`. It sends nothing; keep the `id` and `revision`. Each destination is checked
   as a send would be, so a channel Slack would refuse fails now, not later. Edits go through
   `update_composition` with the latest `revision`.
5. **Review, if wanted.** `set_composition_sharing` with the teammates the user names; they
   get a Slack DM. It is destructive-annotated because it can replace the share list, so pass
   the full list. Read feedback with `list_composition_comments`, reply with
   `create_composition_comment`.
6. **Confirm the send.** Show a final summary: the text, every destination, who it posts as,
   and when (now, or the time in the user's timezone).
7. **Deliver on a yes to that summary.** `deliver_composition`, with `send_at` for a
   scheduled send and `expected_revision` set to the revision you showed, so an edit someone
   made in the meantime is not sent unseen. Then `get_composition` and report how many
   destinations succeeded and which failed.

## Edge cases

- **Moving or stopping a scheduled send:** `deliver_composition` again with a new `send_at`,
  or `cancel_composition_schedule`.
- **Revision conflict:** someone edited the draft. `get_composition`, show what changed, and
  confirm again before delivering.
- **No extra recipients.** Don't add channels, groups, or members the user didn't ask for, and
  never include private member notes or other internal data in an announcement.
