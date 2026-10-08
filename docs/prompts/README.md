# Prompts for maintaining the site

Ready-made prompts for the jobs that come up most. Copy one, replace the `[BRACKETED]` parts, and give it to an AI assistant that can read and edit this repository (for example Claude Code or Gemini CLI). The assistant reads [AGENTS.md](../../AGENTS.md) for the ground rules, so the prompts stay short.

| Job | Prompt |
|---|---|
| Change the wording on a page | [edit-page-copy.md](edit-page-copy.md) |
| Add a news item or press mention | [add-news-mention.md](add-news-mention.md) |
| Add, update or remove a report | [report.md](report.md) |
| Add, update or remove a team member | [team-member.md](team-member.md) |
| Add, update or remove a partner | [partner.md](partner.md) |
| Check the site before or after a change | [check-the-site.md](check-the-site.md) |

Editors who prefer forms to prompts can use Pages CMS for most of these jobs: see [../pages-cms.md](../pages-cms.md). The prompts remain the route for anything the forms cannot do, such as resizing a new report cover.

## How to work

1. Start the assistant in a fresh session on this repository, so it begins from the latest `main`.
2. Paste the prompt. Give it the real source material (the article link, the text from Jenny, the image file). The assistant must not guess.
3. It should create a branch, make the change, run the checks and open a pull request.
4. **Open the Cloudflare preview link on the pull request and look at the page.** The assistant's checks catch broken files, not wrong facts or odd wording. You are the editor.
5. Merge when it looks right. If it doesn't, tell the assistant what is wrong in the same session; don't merge and fix later.

## If your assistant cannot access the repository

An ordinary chat assistant (for example the Gemini or Claude apps) can still draft the entry. Paste the prompt and add: "I can't give you access to the repository. Give me the exact text to paste, and tell me which file to edit in the GitHub web editor." Then edit the file on GitHub yourself, on a new branch, and open a pull request. Always ask the assistant to also show the entry as YAML in the style of the existing ones, and check that indentation matches.

## Writing your own prompts

Good prompts for this site share four parts: **what** (the outcome), **source** (the material to use, and nothing else), **boundaries** ("change only X"), and **proof** ("tell me which checks you ran and what to look at in the preview"). Add a recipe here when you find yourself repeating one.

## What these prompts cannot do yet

- **Team photos and partner logos** are not supported by the templates yet. Do not ask an assistant to hack them in with inline HTML or CSS. Ask for a proper change instead (and expect it to touch templates, so review it more closely).
- **Anything that needs a design decision** (a new kind of page, a new section layout). Describe the goal and ask for options first, with no changes.
