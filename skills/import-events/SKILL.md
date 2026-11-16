---
name: import-events
description: Create several events at once in a Tightknit community from a pasted list, a spreadsheet, or another calendar, and get them onto the community site's events page, as drafts first and published on confirmation. Use when the user says "add these events", "bulk upload events", "import our event calendar", "put these events on our community site", pastes or attaches a list of events, or asks to publish a batch of draft events. For a single event, use create-event instead.
argument-hint: "[list of events, or a file or link with them]"
user-invocable: true
---

# Import events

Turn a list of events into Tightknit events that show on the community site's events page.
The thing most often missed: `create_event` makes **drafts**, and a draft appears nowhere on
the site and announces nothing, even when `publish_to_site` is true. The second most often
missed: the site's events page itself can be unpublished.

For one event, `create-event` is the better fit. This skill is for two or more.

## Steps

1. **Resolve the community.** `list_tenants`; ask if there are several and none was named.
2. **Parse the list.** Each event needs a title, a start, and an end. Read the rest if present:
   description, location, video-call or registration link, hosts and speakers, tags. Ask for
   the timezone once for the whole batch if it is not stated; do not assume UTC. Send every
   time as ISO 8601 with an explicit offset. A missing end: propose 60 minutes and say so.
   Rows with a start in the past or an end before the start: list them and ask.
3. **Check for duplicates.** `list_events` with `status: all` and compare titles and dates.
   Show any matches and ask whether to skip them or edit the existing events (`edit_event`).
4. **Ask once, for the whole batch:**
   - **Registration.** Tightknit registration (`enable_registration_button: true`), an
     external link (`enable_registration_button: true`, `use_registration_btn_as_link: true`,
     and the URL in `link`; all three are needed), a Luma event (the Luma URL with its `evt-`
     id in `link`), or none. The tool description asks for this explicitly; don't default.
   - **Slack announcements.** `publish_to_slack_channel_ids` posts one announcement per event
     on publish. For a large batch or back-filled events, recommend none.
   - **Publish now, at a set time, or review first.** Default is drafts for review.
     `scheduled_publish_at` publishes a draft automatically at a future time.
5. **Resolve references before writing.** `list_tags` for tags (an unknown tag label fails the
   call), `list_members` for host and speaker `prof_...` ids (unmatched people go in
   `external_speakers`), `list_slack_channels` for channel ids.
6. **Show the full list and wait for a yes.** A table: title, when (in the user's timezone),
   location or link, registration, hosts, tags, and status (draft, published, or scheduled).
7. **Create each event.** One `create_event` per row. Omit `status` for drafts; pass
   `status: published` only if the user asked to publish now. Leave `publish_to_site` and
   `is_unlisted` unset. Keep a running list of created ids so a retry never duplicates.
8. **Check the events page.** `get_site`. If the events page is unpublished, say that no
   event will show on the site until it is, and ask before calling `edit_site_pages` with
   `route_events_enabled: true`.
9. **Publish drafts on a yes.** Name the Slack channels each event will announce in, then
   `edit_event` with `status: published` for each.

## Output

A table of every event: title, when, status, and the link. `create_event` returns `url`, the
event's page on the community site, once it is live there, and null while it is not. Give
the Studio link for drafts. Then list anything skipped or failed, with the reason.

## Edge cases

- **Event created but not on the site:** it is still a draft, it is unlisted, `publish_to_site`
  is false, or the site's events page is unpublished. Check all four before anything else.
- **Wrong hour:** a timestamp without the user's offset. Compare with the source and fix with
  `edit_event`.
- **Rate limit partway through:** writes are capped at 60 a minute. Wait a minute, check
  `list_events` against your list of created ids, and continue from the first one missing.
- **Cover images:** follow the upload steps in `community-manager` with
  `file_category: calendar-event-cover`, once per image. Only use files the user gave you.
- **Settings for every event** (cover shape, unregister option, Add to Calendar, button label)
  live in `edit_event_settings`, not on each event. Change them only if asked.
- **Removing an event from the site:** set it back to `draft` with `edit_event`. Deleting is
  permanent and drops its registrations; never delete without explicit confirmation.

Full walkthrough: https://docs.tightknit.ai/integrations/mcp/events
