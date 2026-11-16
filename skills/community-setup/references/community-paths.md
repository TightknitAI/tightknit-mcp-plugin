# Advice by community path

Use the section for the path the admin chose in step 0. Each gives what to prioritize, tips
for the steps it names, and launch items for step 10.

## Brand new community

A new community in a new Slack workspace. The chance to set good habits from day one.

**Priorities:** Slack basics (step 5a) before anyone is invited, since posting permissions,
default channels, and the workspace URL are much harder to change once members arrive.

- **Step 5:** create only the starter channels. Rename the workspace-wide channel to
  `#announcements` and restrict posting before the first invitation.
- **Step 6:** with no history yet, start feeds hidden or private, and make them visible as
  good conversations build up.
- **Step 9:** test the welcome message on a teammate before inviting anyone.

**Launch (step 10):**

- Give teammates who'll help run the community Slack admin rights.
- Pick 3 to 5 champions who will start conversations and model the tone you want.
- Invite a pilot group of 10 to 20 engaged members first. Ask them to test joining and say
  what felt confusing.
- Seed each core channel with a useful post or question, so nobody arrives in an empty room.
- Then invite members in small waves, so the team can welcome each one personally.

## Existing Slack community

Members already talk in a Slack workspace. The goal is to add Tightknit without disrupting
how they participate.

**Priorities:** tell members before anything changes for them, and review old conversations
before any of them become visible on the site.

- **Step 5a:** suggest channel changes gently. Merge or archive only quiet or duplicate
  channels, and warn members before renaming or archiving one. If posting permissions are
  already used elsewhere on the Free plan, ask before moving them.
- **Step 5b:** activating a channel posts a disclosure message in it, so send the member
  announcement (below) first. Activate every channel they want analytics for.
- **Step 6:** decide which activated channels get a visible feed and which stay disabled.
  Making a feed public posts a second disclosure. Before that, review old discussions for
  anything sensitive, private, outdated, or customer-specific.
- **Older conversations:** feeds don't pull in messages from before a channel was activated.
  For a few valuable threads, an admin can use the **Post to site** message shortcut in Slack,
  or you can use `publish_slack_message_to_site`, which brings the whole thread. For bulk
  history, the admin should ask Tightknit support (support@tightknit.ai) about a backport.
- **Step 9:** update the welcome message with the community site and other key links. It
  goes to new members only, so existing members learn about the change from the announcement.

**Launch (step 10):**

- Post the announcement: what Tightknit adds, why, that they can keep using Slack as usual,
  and where to ask questions. Give clear notice before any channel becomes publicly searchable.

## Migration from another platform

Moving from Circle, Discourse, Discord, Hivebrite, Higher Logic, or similar into Slack and
Tightknit.

**Priorities:** raise the export and cut-over plan in the first session, because they depend
on the old platform and Tightknit support, and they decide what the channels will be.

- **Plan first:** confirm the old platform, the date activity stops there, and whether it
  will be archived, kept read-only, or taken offline. List what exists (discussions,
  comments, resources, events, categories, tags, member profiles).
- **Export:** the admin exports from the old platform and agrees the format and a secure way
  to share it with Tightknit support. Remind them to remove anything that shouldn't move,
  confirm they're allowed to transfer member data, and keep an untouched copy.
- **Not everything moves:** prioritize evergreen discussions, common answers, and key
  resources. Leave out old announcements, duplicates, and expired promotions.
- **Step 5:** map the old categories or spaces to a short list of distinct channels; don't
  recreate every category as a channel.
- **Step 7:** import upcoming events, and past events or recordings worth keeping, with
  `import-events`.
- **Resources:** offer to rebuild key resources as content collections.

**Launch (step 10):**

- Prepare the final member list and decide when invitations go out and when access opens.
- Brief admins and champions so they can answer questions during the move.
- Seed the new community with current conversations and an upcoming event.
- Send the announcement with the key dates and what members need to do.
- Add redirects or notices on the old platform, and keep it available until the migration is
  checked.
- Watch closely for access problems and questions in the first few days.

## Announcement template

For an existing community or a migration. Fill in the brackets, adjust the tone to the
admin's voice, and drop the migration line if it doesn't apply. The admin sends it.

```
Subject: A better way to experience our community

We're excited to share the next chapter of our community.

You've told us the conversations here are valuable but hard to find and keep up with. So
starting [launch date], our community combines the real-time conversations in Slack with a
community site at [site url] where you can find discussions, events, resources, and answers.

- Join the conversation your way: Slack or the web, it's the same conversation.
- Nothing gets lost: questions and answers are organized, searchable, and easy to share.
- One place for everything: events, discussions, resources, and member profiles together.

[Migration only: We're bringing over the most useful discussions and resources from
[old platform], which will stay [read-only / available] until [date].]

You don't need to change anything about how you use Slack. Questions? Ask in [channel] or
reply to this message.

[admin name]
```
