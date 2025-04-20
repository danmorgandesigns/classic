---
layout: none
title: Now Test
permalink: /now-test/
---

**Post count:** {{ site.posts | size }}  
**Posts loaded:** {{ site.posts }}

{% if site.posts.size > 0 %}
  {% assign latest_post = site.posts.first %}
  <article>
    <h2>{{ latest_post.title }}</h2>
    <p><em>{{ latest_post.date | date: "%B %d, %Y" }}</em></p>
    <div>
      {{ latest_post.content }}
    </div>
  </article>
{% else %}
  <p>No posts found.</p>
{% endif %}