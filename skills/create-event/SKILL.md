---
name: create-event
description: Create a calendar event in a Tightknit community from a plain-English brief, including title, time and timezone, hosts and speakers, registration mode, Slack announcement channels, reminders, tags, and cover image, saved as a draft and published only on confirmation. Use when the user asks to schedule, add, create, or announce a community event, meetup, webinar, office hours, AMA, workshop, or launch in Tightknit.
argument-hint: "[title, date and time, and any details]"
user-invocable: true
---

# Create an event

Take `$ARGUMENTS` (or the conversation) and produce a calendar event the admin is happy with,
as a draft first. Publishing announces the event in Slack and DMs reminders to people, so it
is the one step that is not quietly reversible. Everything before it is.

## Steps

1. **Resolve the community.** `list_tenants`; ask if there are several and none was named.
2. **Check for a duplicate.** `list_events` with `search` on the title and `status: all`. If a
   close match exists, show it and ask whether to edit that one instead (`edit_event`).
3. **Gather the required fields.** Title, start, end. Convert to ISO 8601 with an explicit
   offset or `Z`. If no timezone was given and you cannot infer it from the conversation,
   ask; do not assume UTC. If no end time was given, propose one (60 minutes) and say so. A
   start in the past or an end before the start: stop and ask.
4. **Registration: ask, don't default.** The tool description asks for this explicitly.
   Offer the three options in one short question:
   - **Register in Tightknit** (`enable_registration_button: true`): members click to
     register, attendance is tracked, reminders go to registrants.
   - **Register elsewhere** (`use_registration_btn_as_link: true` plus `link`): the button
     sends members to Zoom, Luma, or another system.
   - **No registration**: just a calendar entry.
   Also ask whether the guest list should be public (`allow_public_guest_list`, default off).
5. **Hosts and speakers.** For each named person, `list_members` with `search` by name or
   email and take the `prof_...` id (up to 10 each). Show who you matched. Someone not found:
   either they are external, so put them in `external_speakers` as free text, or they need
   adding first with `create_member`, which is destructive-annotated and invites them to
   Slack, so ask before doing that.
6. **Where to announce.** If the user wants a Slack announcement, `list_slack_channels` and
   map names to `channel_id` values for `publish_to_slack_channel_ids`. The announcement
   posts on publish, not on create.
7. **Tags.** Only if the user mentioned them. `list_tags` and pass labels that exist; offer
   `create_tag` for a missing one and confirm before creating it.
8. **Cover image.** If the user supplied an image file: `prepare_file_upload` with
   `file_category: calendar-event-cover`, the filename, and the exact byte size; PUT the raw
   bytes to the returned URL from the local environment; pass the returned `file_...` id as
   `cover_image_file_id`. Recommended 1280x720, 16:9. Without an image, skip it; do not
   invent one.
9. **Reminders.** Default is a 10-minute reminder. Offer 1 day (`1440`) plus 1 hour (`60`)
   for webinars; pass `[]` only if the user wants none.
10. **Create as draft.** Call `create_event` with `status` omitted. Reply with a summary
    table: title, when (in the user's timezone), hosts, speakers, registration mode, channels,
    reminders, cover, and the event id. Ask: publish now, edit, or leave as draft?
11. **Publish on a yes.** `edit_event` with `status: published`. Then `get_event` and share
    the community-site `url`. If the user asked up front to publish immediately and gave every
    detail, you may pass `status: published` on create, after one confirmation line.

## Edge cases

- **Webhooks:** leave `triggers_webhooks` off unless the user says their events sync to an
  outside system; then set it and offer `webhook_custom_metadata` for their record id.
- **Unlisted event:** `is_unlisted: true` hides it from listings but keeps it reachable by
  link; use it for invite-only sessions on request.
- **Plan or role limits:** if `create_event` is not available, say the Events Manager role
  (or Admin) is needed and stop.
- **Recurring events:** the tools create single events. Offer to create each occurrence,
  confirm the list of dates first, and create them as drafts in one pass.
