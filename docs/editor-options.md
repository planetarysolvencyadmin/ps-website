# Options for a friendlier editing interface

Notes for choosing how less technical people edit the site. Pages CMS has since been configured (see [pages-cms.md](pages-cms.md)); the rest is background. Last researched October 2026; check each tool's current docs before committing, as these projects move quickly.

## What we need

- Easy enough for people who have never used GitHub.
- Free or very cheap; open source preferred.
- Edits become commits and pull requests, so the Cloudflare preview and the checks still protect the live site.
- Works with the data files (reports, team, partners) and not just pages.

## The options

| Option | What it is | Fit | Watch out for |
|---|---|---|---|
| **[Pages CMS](https://pagescms.org/docs/)** | Open-source editor for Git-hosted static sites, configured by one `.pages.yml` file in the repo. Edits files directly, no separate database. Hosted version at app.pagescms.org, or self-host on Cloudflare. Supports Jekyll. | Strong. Forms for YAML data files and collections, image uploads, a GitHub sign-in. | Editors need a (free) GitHub account and access to the repo. Does not run our image scripts. Check how current pull request or branch workflow support is. |
| **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)** | Open-source, Decap-compatible editor that lives at `/admin` on the site. Lighter and more actively developed than Decap, which is largely stagnant. | Strong. Polished editing UI, built-in image optimiser. | Needs a small OAuth helper (a Cloudflare Worker, for example [sveltia-cms-auth](https://github.com/pai0801/sveltia-cms-auth)) to let people sign in with GitHub. Editors need repo access. Publishing is a commit to the branch unless set up for editorial workflow. |
| **Decap CMS** | The original Netlify CMS, now community-run. | Adequate. | Same OAuth setup as Sveltia but less actively developed. Prefer Sveltia. |
| **Siteleaf (current)** | Hosted editor for Jekyll. Good for pages and posts. | Fine for news and copy. | Weak for large YAML data files, and cannot run the image scripts. |
| **Google Sheets as a data source** | Team and partners kept in a Sheet. A build step downloads it as CSV into `_data/`. | Very familiar to the team, no GitHub accounts for editors. | Needs a build step or Action to fetch the CSV (the build must be re-triggered on edit, for example by an Apps Script calling a Cloudflare deploy hook). No review step unless added. Images and logos in Drive are awkward. Adds a moving part to a site designed to have almost none. |
| **Google Docs for copy** | Draft copy in Docs, then have an AI assistant move it into the page. | Good for drafting and approval. | An extra copy step; the assistant needs the final text pasted in. |
| **Build our own editor** | A small custom form app. | Possible. | Rebuilds what Pages CMS and Sveltia already do, and then needs maintaining. Not recommended. |

## Recommendation

1. **Keep the AI prompt route** ([docs/prompts](prompts/README.md)) for the one or two people comfortable with GitHub. It works now.
2. **Trial Pages CMS** for the less technical editors, starting with partners (the most frequently changed data). It is the lowest-effort path to forms over the existing YAML files, and it is easy to remove if it doesn't suit. Keep Sveltia as the fallback if more control over the editing UI is wanted.
3. **Solve images separately.** Any editor needs covers, photos and logos processed to the right sizes without anyone running a script. The likely answer is a GitHub Action that runs `scripts/process-covers.mjs` (and a similar one for logos) when files in `_uploads/` change, and commits the results.
4. **Convert team and partners to collections** (one file per person or organisation) only if the YAML files turn out to cause errors in practice. The validator in `scripts/validate-site.rb` and CI should make these rarer first.

## Things to decide

- Do editors get write access to the repository, or only through pull requests from forks or branches? (Safer: a branch each, pull requests only, with `main` protected.)
- Who is the named person who merges?
- Should Siteleaf stay for news and copy, or should one tool cover everything?
