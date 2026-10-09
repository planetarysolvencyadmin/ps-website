# Editing with Pages CMS

[Pages CMS](https://pagescms.org/docs/) is a free, open-source editor that works directly on this repository. Editors fill in forms; each save becomes a Git commit, so the preview, the checks and the history all still apply. Its configuration is the file [`.pages.yml`](../.pages.yml) in the repository root, read per branch. Official reference: [pagescms.org/docs/configuration](https://pagescms.org/docs/configuration/).

## What can be edited there

| Screen | Edits | Notes |
|---|---|---|
| News and commentary | One post per entry in `_posts/` | Headline, date, list under, link, outlet, text. |
| Reports | `_data/reports.yml` | A list; add, edit or reorder entries. |
| Team | `_data/team.yml` | A list; bio is one item per paragraph. |
| Fellows | `_data/fellows.yml` | Same fields as Team; move someone by cutting and pasting their entry. |
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
3. Create the `editing` branch and name the merger (see the next section).

## How editors save changes (agreed process)

**Decision (October 2026): editors work on a shared `editing` branch, and a named person merges it into `main`.** Nothing editors do can reach the public site until that merge, and it keeps the number of production deployments down on Cloudflare's free plan. This can be revisited: see "Switching to saving straight to `main`" below.

Pages CMS commits to whichever branch is open in it and does not open pull requests itself, hence the steps.

**Named merger:** [name to be filled in]. If they are away, someone else with merge rights can do it.

### One-off: create the branch

In GitHub, create a branch called `editing` from `main`. Cloudflare Pages builds a preview of it (branch previews are on for this project).

### For editors

1. Open Pages CMS and choose the **`editing`** branch every time. Never `main`.
2. Make your changes. Each save is a commit and triggers a preview build, so it is kinder to the build allowance to make several related changes and then stop, rather than saving after every small tweak.
3. Open the preview link for the `editing` branch (Cloudflare shows it; the merger can send it) and check the pages you changed, on a phone as well if you can.
4. Tell the merger it is ready, and what changed, in a sentence.

### For the merger

1. In GitHub, open a pull request from `editing` into `main`. The checks run on it; wait for them to pass. A red cross means something the CMS wrote is not valid. Read the message, or ask a developer or an AI assistant ([prompts/](prompts/README.md)) to fix it on the `editing` branch.
2. Open the preview and read the changes properly. Whether names, dates, links and wording are right is a human job: the checks cannot tell.
3. Merge. Use "Squash and merge" to keep the history to one line per round of edits (it also keeps the commit messages naming who edited, in the description).
4. Bring `editing` back in line with `main` before the next round, or the next pull request will show conflicts or old changes. The simplest way: open a pull request from `main` into `editing` in GitHub ("base: editing, compare: main"), merge it, and delete nothing. (A developer can also reset the branch; ask if unsure.)
5. If a merged change turns out to be wrong, open it in GitHub and click **Revert**, then merge the revert pull request.

### Switching to saving straight to `main`

Quicker, with no review step. A broken build leaves the last good site live and the checks run after the fact, but wrong words go live as soon as they are saved, and every save is a production deployment. It may suit a very small team who trust each other. To switch:

1. Tell editors to choose `main` in Pages CMS instead of `editing`.
2. Make sure everyone knows how to revert: open the commit in GitHub and click Revert.
3. Delete the `editing` branch, so no one saves to it by mistake, and update this section.

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
