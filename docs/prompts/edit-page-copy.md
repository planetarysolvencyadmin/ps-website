# Change the wording on a page

Use this for edits to paragraphs, headings, links and lists on Explore, Intelligence, Act, Connect, Press & commentary and the footer pages.

## Prompt

```
Edit the website copy. Read AGENTS.md first and follow it.

Page: [e.g. the Act page, the "Briefings" section]
What to change: [describe it, or paste the old text and the new text]
Source of the new wording: [e.g. "the text below, from Jenny, approved on 7 October"]

New text:
"""
[PASTE THE EXACT NEW TEXT]
"""

Rules for this job:
- Change only the text I have given you. Keep the surrounding headings, `{: ...}` lines and `{% include %}` lines exactly as they are.
- Use my wording. If you think it should change (typos, grammar, tone), list your suggestions in the pull request description instead of applying them.
- If a heading changes and the menu links to it, tell me, and do not change the anchor unless I say so.
- Use British English and no em dashes in anything you write yourself.

Create a branch, run the checks in AGENTS.md, open a pull request, and tell me which part of the preview to look at.
```

## What the assistant should touch

One page file in the repo root. Only touch `_data/navigation.yml` if a section is renamed and you asked for the menu to follow.

## Watch out for

- Changing a heading's `{: #anchor}` breaks links to it, including the menu. The validator catches menu links but not links from other sites.
- Pasting from Word or Google Docs can bring curly quotes and odd spacing. That is fine; stray HTML is not.
