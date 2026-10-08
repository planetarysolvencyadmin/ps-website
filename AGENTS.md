# Instructions for AI assistants (and humans who like rules)

This file is the single source of truth for any AI tool working on this repository, whether that is Claude Code, Gemini CLI, Copilot, Cursor or anything else. `CLAUDE.md` and `GEMINI.md` only point here. Humans: [EDITING.md](EDITING.md) and [IMAGES.md](IMAGES.md) are the friendlier versions of the same rules, and ready-made prompts for common jobs are in [docs/prompts/](docs/prompts/README.md).

## What this is

The website for Planetary Solvency (planetarysolvency.org): a [Jekyll](https://jekyllrb.com) static site, built and hosted by Cloudflare Pages. Nothing runs on a server except one Cloudflare Pages Function for the contact form (`functions/api/contact.js`). Every change reaches the public through a Git commit, so the Git history is the audit trail and the undo button.

## The rules

1. **Work on a branch and open a pull request. Never push to `main`.** Cloudflare builds a preview for each pull request; a human checks it and merges.
2. **Never invent facts.** Do not make up names, job titles, biographies, credits, licences, dates, quotes, report claims or URLs. Use only what the person gave you or what you can read at a URL they gave you. If something is missing, leave it out or ask. Placeholder text such as "to be confirmed" is acceptable only if the person says so.
3. **Never edit generated files by hand.** `assets/images/library/`, `assets/images/covers/`, `_data/image_files.yml` and `_data/cover_files.yml` are written by scripts. Run the script instead (see the table below).
4. **Never commit full-size originals, untreated hero images, secrets, API keys or personal data** (private email addresses, phone numbers, home addresses). Team members' names, roles and bios are published only with their agreement.
5. **Keep changes small and single-purpose.** One pull request per job (one report, one person, one page edit). Do not tidy, reformat or "improve" unrelated content, and do not rewrite wording you were not asked to change.
6. **Do not add dependencies, build steps, JavaScript, tracking, fonts or third-party requests.** The site deliberately makes no requests to third parties (for example, the font is self-hosted rather than loaded from Google). If a task seems to need one, stop and ask.
7. **Do not put HTML in page text.** Use the markdown patterns in [EDITING.md](EDITING.md). Team bios are the one exception (they may contain `<a href>` links).
8. **Stop and ask** if the request is ambiguous, would change page layout or templates, touches `functions/`, `_layouts/`, `_includes/` or `assets/css/`, or would delete something. Editing content must not require code changes. If it seems to, that is a sign to ask.

## Where things live

| To change | Edit | Then run |
|---|---|---|
| Page wording (Explore, Intelligence, Act, Connect, Press, footer pages) | The page's `.md` file in the repo root | Validate and build |
| Menu and jump links | `_data/navigation.yml` (anchors must match `{: #anchor}` lines in the page) | Validate |
| Footer links | `_data/footer.yml` | Validate |
| Reports | `_data/reports.yml`, cover image in `_uploads/` | `node scripts/process-covers.mjs` |
| Team | `_data/team.yml` | Validate |
| Partners | `_data/partners.yml` | Validate |
| News and commentary | A new file in `_posts/` | Validate |
| Home page pictures and the image library | `_data/images.yml`, `_data/hero_images.yml`, `_data/home_sections.yml` | `node scripts/process-images.mjs` (needs the originals; see IMAGES.md) |
| Newsletter banner, contact form settings | `_data/newsletter.yml`, `_data/contact.yml` | Validate |
| Colours, spacing, fonts | `assets/css/style.css` | Ask first |

## Checks to run before every pull request

```
ruby scripts/validate-site.rb          # content and data checks; must say OK
bundle exec jekyll build               # must finish without errors or warnings
node --test tests/contact.test.mjs                     # only if functions/ changed
```

If `bundle exec jekyll` is not found, run `bundle install` first. `validate-site.rb` needs only Ruby. CI runs the same checks, but running them first saves a round trip.

## Style

- **British English** (organisation, programme, colour), plain and concise. The site speaks for a research and advisory body, so keep the tone measured and factual.
- **No em dashes.** Use a comma, colon, brackets or a new sentence. (The existing en dash in report titles, "–", is part of those titles and stays.)
- **Link text says where the link goes** ("Read the Parasol Lost report"), never "click here". Links start `https://`.
- **Every image needs alt text** that describes what is in it, briefly and concretely. Never "image of". Leave alt text empty only for purely decorative images.
- Text must stay readable: do not set text colours or backgrounds in page content.
- Data files are strict YAML: indentation matters, and any value containing a colon, or starting with a quote or special character, must be wrapped in double quotes. Copy the style of the entries already there.

## Pull request description

Use this shape so a non-technical reviewer can approve it:

```
## What changed
One or two plain sentences, e.g. "Adds the 2026 Oceans report to the Research list."

## Where to look in the preview
The page and section, e.g. /intelligence/ under "Research and Reports".

## Facts to check
Every name, title, date, link or claim you added, listed, with where it came from.

## Checks run
validate-site.rb: OK. jekyll build: OK.
```

## If something goes wrong

A failed build leaves the last good version live. To undo a merged change, revert its pull request in GitHub. Do not try to fix a broken `main` by pushing directly to it; open a pull request, or ask a human.
