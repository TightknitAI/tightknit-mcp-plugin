---
name: member-brief
description: Write a one-page brief on one Tightknit community member before a call, interview, or outreach, covering their profile, recent posts and activity, awards and journey progress, and the team's private notes about them. Use when the user asks who someone is in their community, wants to prepare for a conversation with a member, asks how engaged a member is or what they have posted recently, or wants to log a note after talking to them.
argument-hint: "[member name or email] [community name]"
user-invocable: true
---

# Member brief

Take `$ARGUMENTS` (or the conversation) and give the admin what they need before talking to a
member: who they are, how they show up in the community, and what the team already knows.
This skill reads. The only write is a note the admin asks to add afterwards.

## Steps

1. **Resolve the community.** `list_tenants`; ask if there are several and none was named.
2. **Find the member.** `list_members` with `search` on the name or email. Several matches:
   list them with title and company and ask which one. Take the `prof_...` id from the
   listing; never construct one.
3. **Profile and notes.** `get_member` returns the Tightknit profile, the Slack profile behind
   it, dates, and the team's private `notes`. If `has_more_notes` is true, `list_member_notes`
   for the older ones.
4. **Recent activity.** `list_activities` with `member_id` and a `start_date` 90 days back.
   Count what they do (posts, comments, reactions, event registrations, poll votes) and note
   the feeds they are most active in.
5. **What they wrote.** If the brief needs content, `list_posts` with `search` set to their
   name, which matches authors, then `get_post` for the one or two most discussed.
6. **Recognition.** If the community uses awards or journeys: `list_award_assignments` for the
   member, and `get_member_journey_progress` for any active journey.
7. **Write the brief.** One screen:
   - **Who they are** — name, title, company, location, member since.
   - **How they engage** — one sentence on level and pattern, for example "posts about twice a
     month, mostly in #product-feedback, and often answers other members".
   - **Recent activity** — three to five bullets, newest first, with links where posts have them.
   - **Recognition** — awards and journey milestones.
   - **Team notes (internal)** — a summary of the private notes.
   - **Talking points** — two or three, drawn only from the above.
8. **Log a note on request.** After the conversation, if the admin dictates a note,
   `create_member_note` with their words, after showing the text once.

## Edge cases

- **Private notes stay internal.** Label them, and never copy them into anything that goes to
  the member or the community, including a draft announcement.
- **No Slack profile:** `slack_profile` is null for someone who was never in the workspace.
  Say so instead of leaving the section blank.
- **Report, don't infer.** Leave out personal details the data doesn't contain.
