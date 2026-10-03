# Planetary Solvency

Jekyll source for planetarysolvency.org, migrated from WordPress.com.

## Local development

```
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000

## Editing content

* **Pages:** `explore.md`, `intelligence.md`, `act.md`, `connect.md`, `press-and-commentary.md` and the footer pages are plain markdown.
* **Top menu and footer links:** `_data/navigation.yml` and `_data/footer.yml`.
* **Reports, partners and team:** `_data/reports.yml`, `_data/partners.yml`, `_data/team.yml`.
* **News and commentary:** add a post (Posts in Siteleaf). Set `kind` to `news` or `commentary` to choose its list. Set `link` to send readers straight to an outside article, and `source` to name the outlet.
* **Colours and fonts:** the variables at the top of `assets/css/style.css`.

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
