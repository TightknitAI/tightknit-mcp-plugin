---
name: onboarding-journey
description: Design and build a member onboarding journey in a Tightknit community, with milestones such as joining, adding a profile photo, a first post in an introductions channel, reacting and replying, registering for an event, and a completion award like a badge or profile frame. Use when the user asks to set up onboarding, a welcome or getting-started journey, a new-member checklist, gamification, milestones, or a badge members earn for getting active.
argument-hint: "[goal for new members, e.g. get active in the first two weeks]"
user-invocable: true
---

# Build an onboarding journey

A journey is an ordered set of up to 10 milestones, each tracking one member action, with an
optional award on completion. Members see their progress; admins see who finished. Build it
inactive, review it together, then activate, because active journeys count against the plan
limit and start tracking immediately.

## Steps

1. **Resolve the community.** `list_tenants`; ask if several.
2. **Check what exists.** `list_journeys`. If there is already an onboarding-style journey,
   show it and ask whether to edit it (`edit_journey`, `edit_milestone`, `add_milestone`) or
   build a second one. Also `list_awards` so an existing badge can be reused.
3. **Propose the plan before touching anything.** From `$ARGUMENTS` and what you know about
   the community (feeds from `list_feeds`, channels from `list_slack_channels`), draft 4 to 6
   milestones in the order a new member would do them, each with a label, an action from the
   table below, a count where the action takes one, and channel scoping where it helps. Add
   the award: name, what it is (badge, frame, or both), and whether to reuse an existing one.
   Show it as a table and ask for changes. Default proposal:

   | # | Label | Action | Count | Scope |
   | --- | --- | --- | --- | --- |
   | 1 | Join the community | `join_workspace` | | |
   | 2 | Add a profile photo | `update_slack_profile_photo` | | |
   | 3 | Introduce yourself | `send_post_in_channel` | 1 | the introductions channel |
   | 4 | React to three posts | `num_reactions_given_not_to_self` | 3 | |
   | 5 | Reply in a thread | `send_reply_in_channel_not_to_self` | 1 | |
   | 6 | Register for an event | `register_for_event` | | |

4. **Create the award, if new.** `create_award` with `label`, `description`, and
   `default_award_message` (the DM members get when they earn it). For a badge image:
   `prepare_file_upload` with `file_category: award-badge` (500x500), PUT the bytes, pass the
   id as `badge_image_file_id`. For a profile frame: `award-overlay-frame`, 512x512 PNG with
   transparency, `overlay_frame_image_file_id`. Only upload files the user provided. Leave
   `can_be_given_by_non_admin` off unless asked.
5. **Create the journey inactive.** `create_journey` with `label`, `award_id`, and
   `is_active` omitted (defaults to false). Set `start_date` or `end_date` only for a
   time-boxed campaign.
6. **Add milestones in order.** One `add_milestone` per row, in sequence, with
   `journey_id`, `label`, `action`, and `multiplier` for count-based actions.
   `slack_channel_id` scopes an action to one channel; `scoped_to_emoji_name` scopes a
   reaction action to one emoji. Stop at 10.
7. **Review.** `get_journey` and show the ordered milestones and award. Fix anything with
   `edit_milestone` or `edit_journey`.
8. **Activate on a yes.** Say that activation counts against the plan's active-journey
   limit and starts tracking now, then `edit_journey` with `is_active: true`. If the server
   reports the limit is reached, list active journeys and ask which to disable.
9. **Optional follow-ups.** Offer to update the welcome message with
   `edit_community_onboarding_settings` so new members hear about the journey, and to check
   progress later with `get_member_journey_progress`.

## Milestone actions

| Action | Tracks | Takes count | Scoping |
| --- | --- | --- | --- |
| `join_workspace` | joined the Slack workspace | no | |
| `update_slack_profile_photo` | set a profile photo | no | |
| `log_in_to_forums_site` | signed in to the community site | no | |
| `send_post_in_channel` | posted a parent message | yes | channel |
| `send_message_in_channel_not_to_self` | posted, excluding self-threads | yes | channel |
| `send_reply_in_channel_not_to_self` | replied in someone else's thread | yes | channel |
| `num_reactions_given_not_to_self` | reactions given | yes | channel, emoji |
| `num_reactions_received_not_from_self` | reactions received | yes | channel, emoji |
| `num_msgs_reacted_to_not_to_self` | distinct messages reacted to | yes | channel, emoji |
| `num_msgs_that_received_react_not_from_self` | own messages that got a reaction | yes | channel, emoji |
| `num_polls_voted_in` | polls voted in | yes | |
| `register_for_event` | registered for any event | no | |

## Edge cases

- **No Slack workspace on the tenant:** most actions are Slack-based. Keep to
  `log_in_to_forums_site`, `register_for_event`, and `num_polls_voted_in`, and say why.
- **Award image missing:** create the award without an image; it still works. Do not generate
  or fetch an image unless the user gives one.
- **Deleting a milestone or journey** (`delete_milestone`, `delete_journey`) also deletes
  members' progress and is permanent. Prefer editing, or `edit_journey` with
  `is_active: false`, and require explicit confirmation for a delete.
