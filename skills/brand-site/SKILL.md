---
name: brand-site
description: Set up and brand a Tightknit community site, including its name and subdomain, logos, favicon and page banners, brand colors and fonts as a branding set, which pages are published, the announcement banner, and the login page panel, with the new look prepared for review before it goes live. Use when the user says "brand our community site", "make the site match our website", "change our brand colors", "update our logo", "add a site banner", "set up the login page", "set up our Tightknit site", or "publish the events page". Not for Slack channels or feeds.
argument-hint: "[brand guidelines, website URL, colors, or the change to make]"
user-invocable: true
---

# Set up and brand the community site

Configure the community site and match it to a brand. The thing most often missed:
`create_branding_set` does not change the live site. A set takes effect only after
`set_active_site_branding_set`, so prepare the look, let the user review it, then apply it.

## Steps

1. **Resolve the community.** `list_tenants`; ask if several.
2. **Read what's there.** `get_site` and `list_branding_sets`. If there is no site, confirm a
   name and subdomain and call `create_site`; most pages start unpublished.
3. **Plan, then confirm.** Summarize every change: fields, images, colors, pages, banner,
   panel. Wait for a yes.
4. **Site basics.** `edit_site` with only the fields being changed. Omitted fields keep their
   value; `null` clears one.
5. **Images.** For each logo, favicon, social image, or page banner the user gave you, follow
   the upload steps in `community-manager`, then pass the `file_...` id to `edit_site`.
6. **Branding.** `create_branding_set` with the brand colors as hex values, plus fonts if
   given. Unset tokens take platform defaults, so two or three colors are enough to start.
   Tell the user which color went where and give the Studio branding link to preview.
   **Apply with `set_active_site_branding_set` only after they approve.** The previous set
   stays saved, so switching back is the same call.
7. **Pages.** `edit_site_pages` to publish the pages the user wants (events, members,
   content library, groups, community guidelines).
8. **Announcement banner.** `manage_site_banner` with one line of markdown (links, bold,
   italic, strikethrough, emoji). Each edit shows the banner again to members who dismissed
   it; mention that when confirming.
9. **Login page panel.** `manage_login_marketing_panel`. Set `is_enabled: true` only when the
   user wants visitors to see it.

## Output

The site `url`, the active branding set, and a short list of what changed. Point the user to
the Studio branding page for anything to fine-tune by eye.

## Edge cases

- **Branding didn't change:** the set was created but never applied.
- **Subdomain change:** the old subdomain stops resolving and links to it break (a custom
  domain stays the main address). Warn before changing it.
- **Who can see the site:** `is_authenticated`, `allow_site_login`, and `setting_seo_enabled`
  change whether the site is private, how members sign in, and whether search engines index
  it. Confirm each change explicitly.
- **Wrong name in sign-in emails:** those use the community name, set with
  `edit_slack_community_settings`, not the site name.
- **Plan-gated features:** the login panel and uploaded custom fonts need a plan that
  includes them. A missing tool or field usually means the plan, not a bug.
- **Feed descriptions:** they come from each feed's Slack channel purpose, not from the
  site settings. `community-setup` step 6 sets them.
- **Banner text refused:** lists, headings, and quotes aren't allowed; keep it to one line.

Full walkthrough: https://docs.tightknit.ai/integrations/mcp/site-setup-and-branding
