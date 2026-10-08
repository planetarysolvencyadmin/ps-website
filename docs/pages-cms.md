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

- **Resize images.** This is deliberately handled outside the CMS. A report cover uploaded in Media lands in `_uploads/` as it is. The website uses resized copies made by `node scripts/process-covers.mjs`, so a new cover needs that script run, by a developer or an assistant ([prompts/report.md](prompts/report.md)), before the thumbnail appears. Until then the report shows the year placeholder.
- **Check facts.** It checks that links start `https://` and required boxes are filled in. Whether a name, date or claim is right is for the person editing and the person approving.
- **Keep YAML comments.** It may rewrite a data file without the explanatory comments at the top. The guidance is therefore also in [data-files.md](data-files.md).

## First-time setup (once)

1. Sign in at [app.pagescms.org](https://app.pagescms.org) with GitHub, and install the Pages CMS GitHub App on the `planetarysolvencyadmin/ps-website` repository when asked.
2. Anyone who will edit needs a free GitHub account and access to the repository. Add them under the repository's Settings, Collaborators.
3. Decide how editors save (see the next section).

## How editors save changes

Pages CMS commits to whichever branch is open in it. It does not open pull requests itself, so there are two workable arrangements. Choose one and write the choice at the top of this file.

**A. A shared `editing` branch (recommended).** Editors always choose the `editing` branch in Pages CMS. Cloudflare Pages builds a preview for it (branch previews are on by default; check this under the project's Settings, Builds). One named person looks at the preview, opens a pull request from `editing` to `main` in GitHub (the checks run on it) and merges. After a merge, update `editing` from `main` before the next round of edits (GitHub's "Update branch" button on a new pull request does this). Nothing editors do can reach the public site until that person merges.

**B. Editors save straight to `main`.** Quicker, with no review step. A broken build leaves the last good site live and the checks run after the fact, but wrong words go live as soon as they are saved. Reasonable for a very small team who trust each other, if everyone knows how to revert (open the commit in GitHub and click Revert).

Either way, commit messages name who made the change (for example "Update _data/team.yml (via Pages CMS, Jenny Poulter)"), and the Settings page is hidden in Pages CMS so the configuration can only be changed by pull request.

## How the configuration is set up (settings)

- `settings.hide: true`: editors do not see the Settings screen.
- `settings.content.merge: false`: each save rewrites a file from the fields in `.pages.yml` only. The alternative (`true`) keeps unlisted keys, but the docs do not say how it treats entries removed from a list, so it is left off until it has been tested. The validator guards against unlisted keys instead.
- `settings.commit`: commit messages include the editor's name. `identity: app` means the editor's email address is not written into commits as committer metadata.

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
