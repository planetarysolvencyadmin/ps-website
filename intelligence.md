---
title: Intelligence
permalink: "/intelligence/"
subtitle: Intelligence for a changing planet
description: Planetary Solvency research, reports, briefings and tools translating
  Earth system evidence into decision-relevant insight.
layout: page
---

Planetary Solvency translates complex evidence into decision-relevant insight. While scientific research provides essential knowledge about the changing Earth system, risk management adds a different but complementary question: what could happen, how bad could it be, and what should we do about it?

## Research {#research}

**Research in the public interest**

The world has no shortage of climate and Nature information. What is often missing is a realistic assessment of how changing Earth systems could affect societies, economies and financial stability — and how leaders should respond. Planetary Solvency research addresses that gap.

Our publications examine the conditions needed for lasting human prosperity, the risks created by destabilising the Earth system and the practical choices available to reduce those risks. Each of our reports starts from a question:

<ul class="questions">
{% for r in site.data.reports %}
<li><a href="{{ r.url }}">{{ r.question }}</a> <small>{{ r.title }} ({{ r.year }})</small></li>
{% endfor %}
</ul>

## Reports {#reports}

Since 2022, the team behind Planetary Solvency has produced a series of reports, sponsored by the Institute and Faculty of Actuaries (IFoA), combining actuarial risk analysis with the latest Earth system science. Our aim with these is to help deliver a better understanding of the global risks faced by our society and economy.

<div class="report-grid">
{% for r in site.data.reports %}
<article class="report-card">
{% if r.image %}<a class="report-thumb" href="{{ r.url }}"><img src="{{ r.image | relative_url }}" alt="Cover of {{ r.title }}"></a>{% else %}<a class="report-thumb placeholder" href="{{ r.url }}" aria-hidden="true" tabindex="-1">{{ r.year }}</a>{% endif %}
<div class="report-body">
<h3><a href="{{ r.url }}">{{ r.year }}: {{ r.title }}</a></h3>
<p>{{ r.summary }}</p>
<p class="report-links"><a href="{{ r.url }}">Read online</a>{% if r.pdf %} | <a href="{{ r.pdf }}">Download PDF</a>{% endif %}</p>
</div>
</article>
{% endfor %}
</div>

## Briefings {#briefings}

Short, decision-focused summaries of the risks and what to do about them.

* [Planetary Solvency: risks and recommendations (PDF)](https://actuaries.org.uk/media/v1ynflzj/planetary-solvency-risks-and-recommendations.pdf)
* [The UK chancellor is investing in growth and defence. Climate change risks damaging both](https://www.sustainableviews.com/the-uk-chancellor-is-investing-in-growth-and-defence-climate-change-risks-damaging-both-b1c097ed/) (Sustainable Views)

## AMOC2029 {#amoc2029}

*AMOC 2029: When the sea slows*, produced in association with the IFoA, the Strategic Climate Risks Initiative, the University of Exeter and the ASRA Network, is an interactive narrative resource tracking the years one government spends bracing for the slowdown of the Atlantic's overturning circulation.

<span class="tag">Link to follow</span>

## Planetary Risk Dashboard <span class="tag">In development</span> {#planetary-risk-dashboard}

An actionable visualisation of real-time risks across climate, nature, society and economic sectors, building on the illustrative global dashboard pioneered with the University of Exeter and the FCA Sandbox project.

<a class="button" href="https://global-tipping-points.org/planetary-solvency/">View the dashboard</a>

## Planetary Solvency Scenarios <span class="tag">In development</span> {#planetary-solvency-scenarios}

A scenario explorer for national and financial institution planetary solvency scenarios. The systemic risk scenario is being developed with the Climate Financial Risk Forum, with around 40 financial institutions and a number of academics contributing.
