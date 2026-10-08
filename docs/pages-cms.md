# Editing with Pages CMS

[Pages CMS](https://pagescms.org/docs/) is a free, open-source editor that works directly on this repository. Editors fill in forms; each save becomes a Git commit, so the preview, the checks and the history all still apply. Its configuration is the file [`.pages.yml`](../.pages.yml) in the repository root, read per branch. Official reference: [pagescms.org/docs/configuration](https://pagescms.org/docs/configuration/).

## What can be edited there

| Screen | Edits | Notes |
|---|---|---|
| News and commentary | One post per entry in `_posts/` | Headline, date, list under, link, outlet, text. |
| Reports | `_data/reports.yml` | A list; add, edit or reorder entries. |
| Team | `_data/team.yml` | A list; bio is one item per paragraph. |
| Partners | `_data/partners.yml` | Groups, each with partners (name, optional website). |
| Newsletter banner | `_data/newsletter.yml` | |
| Page text (advanced) | The five main pages | Opens the raw file. Change only the words. See [EDITING.md](../EDITING.md). |
| Media | `_uploads/` | Upload images, for example report covers. |

Not editable there, by design: the menu, footer, contact form, image library, CSS and templates. Those are changed by a developer or an AI assistant following [AGENTS.md](../AGENTS.md).

## What Pages CMS cannot do

- **Resize images.** A report cover uploaded in Media lands in `_uploads/` as it is. The website uses resized copies made by `node scripts/process-covers.mjs`, so a new cover needs that script run, by a developer or an assistant ([prompts/report.md](prompts/report.md)), before the thumbnail appears. Until then the report shows the year placeholder.
- **Check facts.** It checks that links start `https://` and required boxes are filled in. Whether a name, date or claim is right is for the person editing and the person approving.
- **Keep YAML comments.** It may rewrite a data file without the explanatory comments at the top. The guidance is therefore also in [data-files.md](data-files.md).

## First-time setup (once)

1. Sign in at [app.pagescms.org](https://app.pagescms.org) with GitHub, and install the Pages CMS GitHub App on the `planetarysolvencyadmin/ps-website` repository when asked.
2. Anyone who will edit needs a free GitHub account and access to the repository. Add them under the repository's Settings, Collaborators.
3. Decide how editors save. The safest arrangement: editors work on their own branch (or one shared "editing" branch) and a named person merges a pull request into `main` after checking the Cloudflare preview. Check Pages CMS's `settings` options for commit and merge behaviour before turning editors loose on `main`.

## Trying it safely (recommended before real use)

Do this once, after this configuration has been merged.

1. In GitHub, create a throwaway branch from `main` called `cms-test`.
2. In Pages CMS choose the repository and the `cms-test` branch.
3. Make one small edit in each screen: change a partner's website, add a report entry, edit a team bio, add a news post.
4. In GitHub open the commits on `cms-test` and read the **diff** of each. You are looking for:
   - Only the lines you changed differ. A whole file reflowed or comments removed is acceptable (the guidance is in [data-files.md](data-files.md)), but **content disappearing is not**.
   - Dates in `_posts/` still read like `2026-09-08` (the old post had a time as well; a date alone is enough, because Jekyll treats it as midnight in the site's time zone).
   - Quotes and special characters (curly apostrophes, the en dash in report titles) are intact.
5. Run `ruby scripts/validate-site.rb` on the branch, or open a pull request and read the checks. They fail if the CMS has written something the site cannot use.
6. Open the Cloudflare preview for the branch and look at Intelligence, Explore, Connect and Press & commentary.
7. Delete `cms-test` when you are done.

If anything is lost or mangled, do not use that screen for real work yet. Tell a developer which field and what happened, and keep editing that content through the AI prompts in [prompts/](prompts/README.md).

## Changing the configuration

- Add a field to a data file: add it to its `fields` in `.pages.yml` **in the same pull request**, or the CMS will drop it on the next save. `scripts/validate-site.rb` fails if they disagree.
- Every field type and option is documented at [pagescms.org/docs/configuration/content/fields](https://pagescms.org/docs/configuration/content/fields/). Stick to what is documented there; do not guess option names.
- The `date` option `format: yyyy-MM-dd` and the page-text raw editor are the two parts of this configuration not yet seen working. They are what to look at first in the trial above.
