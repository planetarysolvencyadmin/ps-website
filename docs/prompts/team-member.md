# Add, update or remove a team member

The team is a list in `_data/team.yml`, shown as cards on the Explore page. Each has a name, role and a bio of one or more paragraphs.

## Prompt: add a team member

```
Add a team member to the website. Read AGENTS.md first and follow it.

Name: [as it should appear]
Role: [exact job title as it should appear]
Position in the list: [e.g. "after Jenny Poulter", or "at the end"]
Bio (use as written, one paragraph per bullet):
"""
[PASTE THE APPROVED BIO]
"""
They have agreed to be listed: [yes]

Add the entry to _data/team.yml in the same format as the others. Use the bio exactly as given: do not shorten, improve or add to it, and do not look the person up and add anything from the web. If the bio has links, use `<a href="https://...">text</a>` as other entries do. Wrap values that contain a colon in double quotes.

Create a branch, run the checks in AGENTS.md, open a pull request, and tell me where it appears in the preview (Explore page, Team section).
```

## Prompt: update or remove

```
In _data/team.yml, [change the role of / replace the bio of / remove] [name]. [New text, if any, between triple quotes.] Change nothing else. Then follow AGENTS.md: branch, checks, pull request.
```

## What the assistant should touch

Only `_data/team.yml`.

## Watch out for

- Photos are not supported yet. Don't ask for them in this recipe.
- Removing someone is a people matter first and a website change second. Check with them and the team before asking for it.
- The order in the file is the order on the page.
- A role containing "to be confirmed" is allowed but produces a warning from the checker, as a reminder.
