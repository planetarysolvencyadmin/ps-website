---
image: /assets/images/banners/power-station.webp
title: Press & commentary
permalink: "/press-and-commentary/"
description: Planetary Solvency news, commentary and media enquiries.
layout: page
---

## News and announcements {#news-and-announcements}

{% assign news = site.posts | where: "kind", "news" %}
{% if news.size > 0 %}
<ul class="post-list">
{% for post in news %}
<li>
<p class="post-date">{{ post.date | date: "%-d %B %Y" }}{% if post.source != "" and post.source %} · {{ post.source }}{% endif %}</p>
<h3><a href="{% if post.link != "" and post.link %}{{ post.link }}{% else %}{{ post.url | relative_url }}{% endif %}">{{ post.title }}</a></h3>
{% assign summary = post.excerpt | strip_html | strip_newlines | truncatewords: 40 %}{% if summary != "" %}<p>{{ summary }}</p>{% endif %}
</li>
{% endfor %}
</ul>
{% else %}
News and announcements will appear here. In the meantime, follow us on the [Planetary Solvency Substack](https://planetarysolvency.substack.com/).
{% endif %}

## Commentary {#commentary}

{% assign commentary = site.posts | where: "kind", "commentary" %}
{% if commentary.size > 0 %}
<ul class="post-list">
{% for post in commentary %}
<li>
<p class="post-date">{{ post.date | date: "%-d %B %Y" }}{% if post.source != "" and post.source %} · {{ post.source }}{% endif %}</p>
<h3><a href="{% if post.link != "" and post.link %}{{ post.link }}{% else %}{{ post.url | relative_url }}{% endif %}">{{ post.title }}</a></h3>
{% assign summary = post.excerpt | strip_html | strip_newlines | truncatewords: 40 %}{% if summary != "" %}<p>{{ summary }}</p>{% endif %}
</li>
{% endfor %}
</ul>
{% else %}
Opinion and analysis from the Planetary Solvency team will appear here.
{% endif %}

## Media enquiries
{: #media-enquiries .band-lilac}

For interviews, comment or background briefings, please get in touch via our [contact form](https://forms.gle/6nAWLYNDxW4ChwsT6).
