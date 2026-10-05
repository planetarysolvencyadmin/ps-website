# Editing the site safely

Page text is plain Markdown. You can edit paragraphs, headings and links without touching any code. Everything that builds cards, grids, lists and forms lives in `_includes/` and `_data/`, not in the page text.

## Safe to change

- The words in paragraphs, headings, bullet lists and quotes.
- Links: `[link text](https://example.org)`
- The page `title`, `subtitle` and `description` at the top of a page (between the `---` lines).

## Leave alone (or copy exactly)

| You will see | What it does | If you delete it |
|---|---|---|
| `{% include team.html %}` (any line starting `{%`) | Draws the team, reports, partners, post lists or contact form | That block disappears from the page |
| `{: #mission .band-navy}` (a line starting `{:` under a heading) | Sets the section's jump-link name and its colour | The jump link or the colour is lost |
| `{: .button}` straight after a link | Makes the link a button | It becomes an ordinary link |
| The `---` lines and `layout:` at the very top | Tell the site how to build the page | The page may not build |

Do not put HTML tags in page text. Use the patterns below instead.

## Patterns to copy

- **Button:** `[Visit the site](https://example.org){: .button}` (use `{: .button .secondary}` for an outlined one)
- **"In development" tag on a heading:** `## Page name *In development*{: .tag}` then the next line `{: #page-name}`
- **Section colour:** under a heading add `{: #some-name .band-navy}` (or `.band-lilac`, `.band-coral`)
- **Large statement text:** put `{: .statement}` on the line under the paragraph
- **Callout box:** start the lines with `> ` and put `{: .note}` on the line after
- **Page photo:** section pages (Explore, Intelligence, Act, Connect, Press) take theirs from `_data/home_sections.yml`; see IMAGES.md

## Home page pictures

- **Hero:** a random image from the pool in `_data/hero_images.yml` on each visit. In `index.md`, `hero_title:` is the h1 text, and `hero_image:` can be set to one id to pin an image (leave as `random` for the pool).
- **Section circles and page headers:** `_data/home_sections.yml` sets the picture for each link and for the round header on that section's page. The label comes from the menu in `_data/navigation.yml`.
- **Image library:** each picture has an entry in `_data/images.yml` (alt text, credit, licence, optional `focal` crop point). Adding pictures needs a script run; the full steps are in [IMAGES.md](IMAGES.md).
- **Circles to squares:** add `section-links--square` to the `<nav>` class in `_includes/section-links.html`.

## News and commentary

Add a Post in Siteleaf. Set `kind` to `news` or `commentary`. Add `link` to send readers straight to an outside article, and `source` for the outlet name.

## Data files (more careful)

Menu, footer links, reports, partners, team and the contact form settings live in `_data/*.yml`. These are strict: indentation matters, and a title containing a colon needs quotes. Edit them in GitHub on a branch, and check the Cloudflare preview before merging.

## If something breaks

If a build fails, Cloudflare Pages should keep the last good version of the site live, and GitHub shows a red cross next to the commit. Nothing reaches visitors until a build succeeds. To undo a bad edit, open the commit in GitHub and click Revert.
