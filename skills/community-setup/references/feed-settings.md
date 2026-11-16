# Feed settings, explained

Ask about these in order, in plain language, one group at a time. Each row gives the
`update_feed` field, what to tell the admin, and a sensible default by feed purpose. Only
send the fields the admin wants changed. Fields marked *plan* exist only on some plans; if a
call refuses one, say so and move on.

## 1. Who can see it

| Field | Explain it as | Default |
| --- | --- | --- |
| `visibility` | Who can read this feed on the community site: `public` (anyone, and search engines), `authenticated` (signed-in members), `feed_members` (only people in the Slack channel), or `disabled` (not on the site). A private channel's feed can only be `feed_members` or `disabled`. | Announcements, Q&A, help: `public` on a public site, else `authenticated`. Internal or private channels: `disabled`. |
| `show_in_navigation_menu` | Whether the feed is listed in the site's navigation. | On for the 3 to 5 main feeds. |
| `is_unlisted` | Hides the feed from feed listings while keeping it reachable by link. | Off. |

Making a feed `public` posts a second disclosure message in its Slack channel saying messages
can appear publicly on the site. Mention it before confirming.

## 2. What gets posted

| Field | Explain it as | Default |
| --- | --- | --- |
| `sync_all_incoming_messages` | On: every new message in the channel becomes a post on the site. Off: only messages someone promotes from Slack become posts. | On for Q&A and discussion; off for busy chatter channels. |
| `stores_new_messages` | Whether Tightknit keeps new messages from the channel at all. Off means they aren't synced, credited to journeys, or searchable. Going forward only. | On. |
| `allow_site_posting` *plan* | Whether members can start posts from the site, not just Slack. | On for Q&A and discussion; off for announcements. |
| `is_post_sync_reminder_agent_enabled` | Reminds admins to sync a good Slack message to the site. | On when sync-all is off. |

## 3. How it looks

| Field | Explain it as | Default |
| --- | --- | --- |
| `label` | The feed's name on the site. | The channel name, tidied (e.g. "Help & questions"). |
| `slug` | The feed's web address, e.g. `/help`. Must be unique. | Short and lowercase. |
| `emoji_icon` | An emoji shown next to the feed name. | One that fits the purpose. |
| `banner_file_id` | A banner at the top of the feed, 2560 x 640 px. | Optional; see graphics.md. |
| `list_view_display_format` | How the feed's list looks: `card`, `snippet`, `compact`, or `changelog`. | `snippet` for discussion, `card` for announcements, `changelog` for product updates. |
| `post_detail_display_format` | How a single post looks: `discussion` (thread with replies) or `blog` (article). | `discussion`; `blog` for announcements and articles. |
| `show_pinned_posts` | Shows pinned posts at the top of the feed. | On. |

## 4. Q&A and AI help

| Field | Explain it as | Default |
| --- | --- | --- |
| `selected_answers_enabled` | Lets admins mark the best reply to a question, so answers stand out on the site. | On for Q&A and help. |
| `ai_titles_enabled` | Gives each synced post an AI-written title instead of its first sentence. | On. |
| `ai_post_title_prompt` *plan* | Style guidance for those titles (tone, casing). | Leave default unless they have a voice guide. |
| `ai_post_description_prompt` *plan* | Style guidance for the search-engine description of each post. | Leave default. |
| `is_related_discussions_agent_enabled` *plan* | Suggests related past discussions in the Slack channel when someone asks a question. | On for Q&A and help. |
| `related_discussions_message_preface` *plan* | The text shown above those suggestions. | A short friendly line, if they want one. |

## 5. Slack etiquette

| Field | Explain it as | Default |
| --- | --- | --- |
| `is_reply_in_thread_reminder_enabled` | Privately nudges members who send several top-level messages in a row to reply in threads. | On for busy channels. |
| `is_anonymous_posting_enabled` | Lets members post anonymously in the channel. | Off, unless the channel is for sensitive questions. |

Docs: https://docs.tightknit.ai/channels-and-feeds/create-feed
