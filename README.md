# Planetary Solvency

Jekyll source for planetarysolvency.org, migrated from WordPress.com.

## Local development

```
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000

**Windows:** install Ruby from [RubyInstaller](https://rubyinstaller.org/) (the "with Devkit" build) and tick the `ridk install` step at the end. If `bundle install` fails building the `wdm` gem, pull the latest version of this repo (the `wdm` dependency has been removed, as it does not compile on Ruby 3.4 or later). If a stale install is lingering, run `bundle install` again after `git pull`.

## Editing content

Using an AI assistant? See [AGENTS.md](AGENTS.md) (the rules), [docs/prompts](docs/prompts/README.md) (ready-made prompts for common jobs) [docs/pages-cms.md](docs/pages-cms.md) (editing through forms) and [docs/editor-options.md](docs/editor-options.md) (the options considered). `ruby scripts/validate-site.rb` checks content and data.

See [EDITING.md](EDITING.md) for the safe-editing rules (what to change, what to leave alone, and the patterns to copy).

* **Pages:** `explore.md`, `intelligence.md`, `act.md`, `connect.md`, `press-and-commentary.md` and the footer pages are plain markdown.
* **Top menu and footer links:** `_data/navigation.yml` and `_data/footer.yml`.
* **Reports, partners and team:** `_data/reports.yml`, `_data/partners.yml`, `_data/team.yml`.
* **News and commentary:** add a post (Posts in Siteleaf). Set `kind` to `news` or `commentary` to choose its list. Set `link` to send readers straight to an outside article, and `source` to name the outlet.
* **Report covers:** `cover` in `_data/reports.yml`, built by `scripts/process-covers.mjs`. See [IMAGES.md](IMAGES.md#report-covers).
* **Images:** the home page hero and section circles come from an image library. See [IMAGES.md](IMAGES.md) for how it works, how to add or change pictures and how to run `scripts/process-images.mjs`.
* **Colours:** the variables at the top of `assets/css/style.css`.
* **Font:** [Inter](https://rsms.me/inter/) (SIL Open Font License), self-hosted from `assets/fonts/` so no request goes to Google or any other third party. The `@font-face` rules and the font stack are at the top of `assets/css/style.css`. To update it, replace the `.woff2` files and keep the filenames.

## Contact form

The form on `/connect/` posts to `functions/api/contact.js`, a Cloudflare Pages Function (free plan), which checks the message and passes it to the Google Form so responses still land in the same Google Sheet. The Google Form ID and question numbers are constants at the top of that file.

* **Spam check (optional):** create a free Turnstile widget in Cloudflare, paste the Site key into `_data/contact.yml` (`turnstile_site_key`) and add the Secret key in Pages under Settings, Variables and Secrets as `TURNSTILE_SECRET`.
* **Rate limiting (optional):** add a free Cloudflare rate limiting rule for `/api/contact`.
* **Tests:** `node --test tests/contact.test.mjs`
* The Google Form must allow responses without a Google sign-in.

## Deployment

This repo is built and deployed via Cloudflare Pages. See `DEPLOYMENT.md` for
the full setup guide, including connecting the repo to Cloudflare Pages and
configuring the test.planetarysolvency.org custom domain.
