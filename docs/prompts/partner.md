# Add, update or remove a partner

Partners are grouped (Science, Solutions, Impact) in `_data/partners.yml` and shown on the Connect page. A partner is either a plain name, or a name with a link.

## Prompt: add a partner

```
Add a partner to the website. Read AGENTS.md first and follow it.

Name: [exactly as the organisation writes it]
Website: [https://... or "none"]
Group: [Science, Solutions or Impact]
They have agreed to be listed: [yes]

Add them to the right group in _data/partners.yml, in the same format as the others: a plain name if there is no link, or `{ name: "...", url: "https://..." }` if there is one. Put them at the end of the group unless I say otherwise. Check that the website URL loads and belongs to that organisation, and tell me what you found. Do not add any other details.

Create a branch, run the checks in AGENTS.md, open a pull request, and tell me where it appears in the preview (Connect page).
```

## Prompt: add links to existing partners

```
In _data/partners.yml, add website links to these existing partners, changing each plain name into the `{ name: "...", url: "..." }` form and keeping everything else the same:

[Partner name] : [https://...]
[Partner name] : [https://...]

Check each URL loads and belongs to that organisation, and list what you found under "Facts to check". Then follow AGENTS.md: branch, checks, pull request.
```

## Prompt: remove a partner

```
Remove [name] from _data/partners.yml. Change nothing else. Then follow AGENTS.md: branch, checks, pull request.
```

## What the assistant should touch

Only `_data/partners.yml`.

## Watch out for

- **Logos are not supported yet.** The template shows names and links only. When you are ready, ask the assistant for options first (for example SVG logos in one fixed-size box, with alt text and a link), and expect changes to `_includes/partners.html` and the CSS. That is a bigger change and deserves a closer review.
- Check permission before listing an organisation, and before using its logo.
- Mentioning a partner on a report page or elsewhere in the copy is a separate wording edit.
