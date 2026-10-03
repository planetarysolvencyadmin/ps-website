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

## Deployment

This repo is built and deployed via Cloudflare Pages. See `DEPLOYMENT.md` for
the full setup guide, including connecting the repo to Cloudflare Pages and
configuring the test.planetarysolvency.org custom domain.
