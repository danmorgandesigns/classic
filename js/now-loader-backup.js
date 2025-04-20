async function loadLatestPost() {
  const contentContainer = document.getElementById("now-content");
  const navContainer = document.getElementById("post-nav");

  try {
    const res = await fetch("posts.json");
    const posts = await res.json();
    const latest = posts[0];

    console.log("Loading latest post:", latest.filename);

    const postRes = await fetch("posts/" + latest.filename);
    const md = await postRes.text();

    console.log("Post markdown loaded, parsing...");

    const html = marked.parse(md);
    const withClass = html.replace("<h1>", "<h1 class='post-date'>");

    contentContainer.innerHTML = withClass;

    // Build past entries nav
    if (posts.length > 1) {
      let navHtml = "<h3 class='past-entries'>What I was doing...</h3><ul>";
      const maxShown = 10;
      for (let i = 1; i < Math.min(posts.length, maxShown + 1); i++) {
        navHtml += `<li><a href="#" onclick="loadPost('${posts[i].filename}');return false;">${posts[i].title}</a></li>`;
      }
      if (posts.length > maxShown + 1) {
        navHtml += `<li><a href="/archive.html">More...</a></li>`;
      }
      navHtml += "</ul>";
      navContainer.innerHTML = navHtml;
    }

  } catch (err) {
    console.error("🚨 Failed to load latest post", err);
    contentContainer.innerText = "⚠️ Failed to load latest post.";
  }
}

async function loadPost(filename) {
  const contentContainer = document.getElementById("now-content");
  try {
    const res = await fetch("posts/" + filename);
    const md = await res.text();
    const html = marked.parse(md);
    const withClass = html.replace("<h1>", "<h1 class='post-date'>");
    contentContainer.innerHTML = withClass;
  } catch (err) {
    contentContainer.innerText = "Failed to load selected post.";
    console.error(err);
  }
}

function loadNowSafely() {
  // prevent double-loading
  if (window._hasLoadedNowContent) return;
  window._hasLoadedNowContent = true;
  loadLatestPost();
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  // already loaded
  loadNowSafely();
} else {
  // wait for DOM or bfcache-style restore
  document.addEventListener("DOMContentLoaded", loadNowSafely, { once: true });
  window.addEventListener("pageshow", loadNowSafely, { once: true });
}