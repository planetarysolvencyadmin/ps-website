# Add a news item, press mention or commentary piece

News and commentary are posts: one small file each in `_posts/`. A post can have its own page, or can send readers straight to an article elsewhere (the usual case for press mentions).

## Prompt: press mention that links elsewhere

```
Add a press mention to the website. Read AGENTS.md first and follow it.

Article URL: [https://...]
Outlet: [e.g. The Guardian]
Date published: [YYYY-MM-DD]
Headline: [exact headline, or "use the article's headline"]
List it under: [news OR commentary]

Create one new file in _posts/ named YYYY-MM-DD-short-title.md with front matter: title, date, kind, link and source, and no body text unless I give you some. Look at the existing post for the format. Read the article at the URL to check the headline, outlet and date, and tell me if anything differs from what I gave you. Do not summarise or quote the article.

Create a branch, run the checks in AGENTS.md, open a pull request, and tell me where it appears in the preview (Press & commentary page).
```

## Prompt: an article hosted on our own site

```
Add a news post to the website. Read AGENTS.md first and follow it.

Title: [...]
Date: [YYYY-MM-DD]
List it under: [news OR commentary]
Text (use as written):
"""
[PASTE THE TEXT]
"""

Create one new file in _posts/ named YYYY-MM-DD-short-title.md. Leave `link` and `source` empty. Use the text exactly as given, formatted as markdown (headings, paragraphs, links). Do not add anything.

Create a branch, run the checks in AGENTS.md, open a pull request, and tell me where it appears in the preview.
```

## What the assistant should touch

Only a new file in `_posts/`. Nothing else.

## Watch out for

- `kind` must be `news` or `commentary`. The default if missing is `news`.
- A post with a `link` should always have a `source` (the outlet). The validator checks this.
- The date controls the order. Newest is shown first.
- Check the preview: the card shows the date, outlet and a short opening excerpt.
