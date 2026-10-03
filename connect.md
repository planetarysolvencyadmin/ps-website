---
title: Connect
description: Our partner network, how to work with us, our newsletter and how to get in touch.
permalink: /connect/
layout: page
---

## PS network and partners {#network-and-partners}

We are building a growing network of aligned partners across science, solutions and impact.

{% for g in site.data.partners %}
<div class="partner-group">
<h3>{{ g.group }}</h3>
<ul class="partner-list">
{% for p in g.partners %}{% if p.name %}<li><a href="{{ p.url }}">{{ p.name }}</a></li>{% else %}<li>{{ p }}</li>{% endif %}
{% endfor %}</ul>
</div>
{% endfor %}

## Work with us
{: #work-with-us .band-lilac}

We are actively building our partner network for 2027 and welcome conversations with organisations who share our mission. We welcome conversations with:

**Science partners**
Earth system scientists, research institutions and academics to co-produce and validate our research programme.

**Impact partners**
Membership organisations, individual financial institutions, advisers, actuarial bodies and sustainability platforms who can take PS principles and tools to their clients and members.

**Solution partners**
Funders and foundations who want to support the build of a world leading, independent, non-profit risk programme for the Earth system.
Aligned organisations who support with methodologies, collaborations, toolkits and pro bono support.

<a class="button" href="#contact">Get in touch</a>

## PS Chronicles newsletter sign-up
{: #newsletter .band-navy}

Sign up to the Planetary Solvency newsletter, the PS Chronicles, on Substack.

<a class="button" href="https://planetarysolvency.substack.com/subscribe">Subscribe on Substack</a>

## Contact {#contact}

To find out more about Planetary Solvency or enquire about our products and services, get in touch.

{% include contact-form.html %}
