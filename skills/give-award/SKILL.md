---
name: give-award
description: Give an award (a badge, profile frame, or certificate) to one or many members of a Tightknit community, creating the award first if it does not exist, and report who received it, who was skipped, and who already had it. Use when the user says "give these members an award", "recognize our top contributors", "send a badge to", "award everyone who spoke at the event", or "who has the X award". To build a journey that awards members automatically, use onboarding-journey instead.
argument-hint: "[award name, and the members to give it to]"
user-invocable: true
---

# Give an award

Giving an award sends each recipient a Slack DM and posts an announcement. It cannot be
unsent, and `give_award` does not deduplicate, so confirm the recipients and the message
before the call.

## Steps

1. **Resolve the community.** `list_tenants`; ask if several.
2. **Find the award.** `list_awards` and match by name. If none matches, offer to create one
   with `create_award` (`label`, `description`, `default_award_message`). For a badge image:
   `prepare_file_upload` with `file_category: award-badge` (500x500); for a profile frame,
   `award-overlay-frame` (512x512 PNG with transparency). Follow the upload steps in
   `community-manager` and only use files the user gave you. Confirm before creating.
3. **Resolve the recipients.** For each name or email, `list_members` with `search` and take
   the `prof_...` id. Show who you matched. Report anyone not found or ambiguous; never guess.
4. **Check who already has it.** `list_award_assignments` for the award. Show which
   recipients already hold it and ask whether to give it again or skip them.
5. **Confirm.** One summary: the award, the recipients, the message (the award's default
   message unless the user wrote one), and whether to send anonymously (`send_anonymously`).
   Wait for a yes.
6. **Give it.** `give_award` with up to 25 `member_ids` per call. Split a longer list into
   batches of 25.

## Output

Report `given_count`, then every `skipped` member with its reason (for example deactivated)
and every `failed` member with its error. Offer to retry only the failed ones.

## Edge cases

- **Award creation refused:** the plan's active-award limit is reached. Say so; don't
  deactivate another award without asking.
- **Non-admin givers:** `can_be_given_by_non_admin` on the award lets members give it, where
  the plan includes that. Leave it off unless asked.
- **Taking an award back, or deleting one:** `delete_award` removes every record of members
  having received it, permanently. Never call it without explicit confirmation.
- **Rate limits:** `give_award` is an expensive call (20 a minute), but a call with 25
  members counts once.

Full walkthrough: https://docs.tightknit.ai/integrations/mcp/journeys-and-awards
