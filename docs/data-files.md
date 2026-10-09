# Data files: what each one is and the rules for editing it

Everything in `_data/` is configuration the templates read. Some of these files are edited through Pages CMS, and a CMS may rewrite a YAML file **without its comments**. So the guidance that used to live only as comments at the top of each file is kept here as well. If a comment is lost, nothing is lost: this page is the reference.

General rules for every file:

- It is YAML. Indentation matters (two spaces, never tabs). A value containing a colon, or starting with a quote or special character, must be wrapped in double quotes.
- Links start `https://`.
- After any edit run `ruby scripts/validate-site.rb`, or check that the pull request's checks pass.
- Never edit `image_files.yml` or `cover_files.yml`. Scripts write them.

Files marked **CMS** can be edited in Pages CMS (see [pages-cms.md](pages-cms.md)). If you change the fields in one of them, update [`.pages.yml`](../.pages.yml) too, or the CMS will drop the new field when it saves. The validator warns you.

## `reports.yml` (CMS)

The report series. A list; each entry is one report. Shown on the Intelligence page as questions with cover thumbnails.

| Field | Required | Notes |
|---|---|---|
| `year` | yes | Four digits. |
| `title` | yes | Copy it exactly from the publisher. |
| `url` | yes | The page where people read the report. |
| `pdf` | no | Direct PDF link. If it is the same as `url`, the card shows only "Download PDF". |
| `cover` | no | The cover image's filename in `_uploads/` without its extension, for example `parasol-lost`. Run `node scripts/process-covers.mjs` after adding a new image (see [IMAGES.md](../IMAGES.md), Report covers). With no cover the grid shows the year as a placeholder. |
| `question` | yes | The public question the report answers, shown in the Research list. |
| `summary` | yes | One or two sentences. |

Order in the file is the order on the page. Put new reports at the end, which keeps them in date order.

## `team.yml` (CMS)

The people shown as cards on the Explore page. A list.

| Field | Required | Notes |
|---|---|---|
| `name` | yes | As it should appear. |
| `role` | yes | Job title. A role saying "to be confirmed" is allowed but flagged by the validator. |
| `bio` | no | A list of paragraphs, one item each. May contain `<a href="https://...">text</a>` links. With no bio the card shows "Biography to follow." |
| `linkedin` | no | The person's LinkedIn profile URL (starts `https://`). A "... on LinkedIn" link appears on the card only if this is filled in. |

Only list people who have agreed to be listed. Order is the order on the page.

### Team photos

`photo` (optional) is shown as a small round picture on the person's card, and `linkedin` as a LinkedIn icon beside their name. Each appears only if filled in. To add a photo: put the original (with the person's agreement) in `_uploads/team/`, for example `jesse-abrams.jpg`, run `node scripts/process-team-photos.mjs`, then set `photo: jesse-abrams` in `team.yml`. The script makes a 320px square (cropped from the centre) as WebP and JPEG in `assets/images/team/`, which it owns: never edit that folder by hand. The photo's alt text is generated from the person's name.

## `partners.yml` (CMS)

Partner organisations in groups (Science, Solutions, Impact), shown on the Connect page. A list of groups.

```yaml
- group: Science
  partners:
    - name: University of Exeter
    - name: The Rising Earth Fund
      url: "https://risingearth.fund/"
```

- Every partner is written `- name: ...`, with an optional `url:`. A partner with a `url` is shown as a link, one without as plain text. A bare name without `name:` is rejected by the validator, because the CMS cannot edit it.
- `logo` (optional): the filename of an agreed logo in `assets/images/partners/`, for example `exeter.svg`. If set, the logo is shown instead of the name (the name becomes its alt text, and it links to the `url` if there is one). Leave it out until the partner has agreed a logo with us. The validator checks the file exists.
- Only list organisations that have agreed to be listed.

## `social.yml` (CMS)

The organisation's social accounts, listed under "Follow" on the Connect page. Each has `name`, `url` and `show`. `show: false` keeps an account stored but hidden; set it to `true` to publish it. If none are shown, the Follow section disappears, so also remove the "Follow" item from `navigation.yml` in that case.

## `analytics.yml` (developers)

Google Analytics and the cookie banner. `enabled: true` loads the Google tag **only after a visitor clicks Accept** on the banner at the bottom of the page (their choice is kept in their browser, and the footer "Cookie settings" button reopens it). `measurement_id` is the GA4 ID and `banner_text` the banner wording. To stop using Google Analytics, set `enabled: false`: the tag, banner, footer button and the analytics wording on the Cookies and Privacy pages all disappear. The code is `_includes/analytics.html`, `_includes/consent-banner.html` and `assets/js/consent.js`.

## `newsletter.yml` (CMS)

The sign-up banner above the footer of every page: `url` (the Substack subscribe link), `title`, `text` and `button`. To hide it on one page, add `newsletter: false` at the top of that page.

## `navigation.yml` (developers)

The top menu. Each section is one page (`url`), and its `items` are jump links to anchors on that page. An item's `anchor` must match a `{: #anchor}` line (or `{#anchor}` after a heading) in that page, which the validator checks. The home page section circles take their labels from here, matched by `url`.

## `footer.yml` (developers)

A list of `{ title, url }` footer links.

## `contact.yml` (developers)

Settings for the contact form on `/connect/`. It posts to `/api/contact` (`functions/api/contact.js`), which checks the message and passes it on to the Google Form. The Google Form ID and question numbers live in that function file. `fallback_url` is the Google Form link used if the form cannot be sent.

`turnstile_site_key` is an optional spam check. Leave it blank to switch it off. To switch it on, create a free Turnstile widget in Cloudflare, paste its Site key here, and add its Secret key in Cloudflare Pages as `TURNSTILE_SECRET`.

## `images.yml`, `hero_images.yml`, `home_sections.yml` (developers)

The home page image library. Full explanation in [IMAGES.md](../IMAGES.md); in short:

- **`images.yml`** has one entry per picture, keyed by its id (the filename without extension, lower case, hyphenated): `alt` (describes the picture for screen readers, never "image of"; empty only if purely decorative), `credit`, `licence`, and optional `focal` (a CSS `object-position` such as `"50% 30%"` that keeps part of the picture in view when the hero is cropped). Entries marked `TO CONFIRM` need real details before launch. Each key must sit at the left edge with its fields indented two spaces beneath it.
- **`hero_images.yml`** is the pool of ids the home page hero picks from at random. Add, remove or comment out lines freely. Dark images are left out because the headline is less readable on them.
- **`home_sections.yml`** sets the five circles under the home page introduction, in order: `url`, then either `colour` (one of `teal-dark`, `navy`, `coral`, `lilac`, `deep`) or `image` (an id from `images.yml`, which also puts that picture in the round header on the section's page). If both are set, `image` wins. Each `url` must match the menu in `navigation.yml`.

## Generated files (never edit)

- `image_files.yml`: written by `node scripts/process-images.mjs`.
- `cover_files.yml`: written by `node scripts/process-covers.mjs`.

## News and commentary are posts, not data

Each is one file in `_posts/` named `YYYY-MM-DD-short-title.md`, with front matter: `title`, `date`, `kind` (`news` or `commentary`; `news` if missing), and for a link to an outside article `link` and `source` (the outlet). Newest first. See [prompts/add-news-mention.md](prompts/add-news-mention.md).
