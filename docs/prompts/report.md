# Add, update or remove a report

Reports appear on the Intelligence page as a list of questions with cover thumbnails (and, if the report grid is ever used again, as cards). Each report is an entry in `_data/reports.yml` plus a cover image in `_uploads/`.

## Prompt: add a report

```
Add a report to the website. Read AGENTS.md and IMAGES.md (the "Report covers" section) first and follow them.

Title: [exact title, copy it from the publisher's page]
Year: [YYYY]
Page URL: [https://... where people read it]
PDF URL: [https://... or "none"]
The question it answers: [one sentence in the same style as the existing ones, or "draft one for me to approve"]
Summary: [paste the approved summary, or "draft a 1 to 2 sentence summary from the report page for me to approve"]
Cover image: [I have put it in _uploads/ as <name>.png, or "no cover yet"]

Add the entry to _data/reports.yml in date order, copying the format of the existing entries (including the `cover` field, which is the image filename without its extension). Then run `node scripts/process-covers.mjs` so the thumbnails are built, and commit the generated files in assets/images/covers/ and _data/cover_files.yml with the rest.

Do not edit the generated files by hand. Do not invent claims about what the report found: summaries must be based only on text I gave you or on the publisher's page at the URL above, and you must tell me which. Any summary or question you drafted must be listed under "Facts to check" in the pull request so I can approve it.

Create a branch, run the checks in AGENTS.md, open a pull request, and tell me where it appears in the preview.
```

## Prompt: update or remove a report

```
In _data/reports.yml, [change the summary of / change the URL of / remove] the report "[title]". [New text or URL, if any.] Change nothing else. If removing, also tell me whether its cover image in _uploads/ and the generated files in assets/images/covers/ are now unused, and remove them if I say yes. Then follow AGENTS.md: branch, checks, pull request.
```

## What the assistant should touch

`_data/reports.yml`, a new image in `_uploads/`, and generated files in `assets/images/covers/` and `_data/cover_files.yml` (via the script only).

## Watch out for

- Covers are shown as A4 portrait. A cover that is not A4 is trimmed from the bottom. Give the assistant the largest image you have; the script never upscales.
- Colons in titles or summaries need the whole value in double quotes.
- Needs Node and ImageMagick. If the assistant's environment doesn't have them, ask it to install them or to leave the image step to you, and say so in the pull request.
