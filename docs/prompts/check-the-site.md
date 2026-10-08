# Check the site

Use this after a pull request is merged, after a long gap, or whenever something looks off. It changes nothing.

## Prompt

```
Check the website repository for problems and report them. Do not change any files. Read AGENTS.md first.

1. Run `ruby scripts/validate-site.rb` and `bundle exec jekyll build`, and report any errors or warnings, with the file and line.
2. Read _data/team.yml, _data/partners.yml and _data/reports.yml and list anything that looks stale, inconsistent or unfinished (for example "to be confirmed" roles, partners with no link, a report with no cover).
3. Check that every external link in the page files and data files responds, and list any that do not or that redirect somewhere unexpected.
4. Read the pages for typos, inconsistent spelling (British English expected) and any em dashes.

Give me a short prioritised list: what is broken, what is untidy, what is fine. Suggest fixes but do not make them.
```

## When to use it

Before a launch, quarterly, and after anyone has edited files directly on GitHub or in Siteleaf.
