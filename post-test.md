---
layout: none
title: Post Debug
permalink: /post-test/
---

# Post Debug

**Post count:** {{ site.posts | size }}

<ul>
{% for post in site.posts %}
  <li>{{ post.url }} – {{ post.title }}</li>
{% endfor %}
</ul>