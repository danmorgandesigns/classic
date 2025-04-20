async function loadLatestPost() {
  const contentContainer = document.getElementById("now-content");
  const navContainer = document.getElementById("post-nav");

  try {
    const res = await fetch("posts.json");
    const posts = await res.json();
    const latest = posts[0];

    const postRes = await fetch("posts/" + latest.filename);
    const md = await postRes.text();
    const html = marked.parse(md);
    const withClass = html.replace("<h1>", "<h1 class='post-date'>");
    contentContainer.innerHTML = withClass;

    // Set up navigation buttons
    const nextBtn = document.getElementById("nav-next");
    const prevBtn = document.getElementById("nav-prev");

    prevBtn.classList.add("hidden");
    prevBtn.onclick = null;

    if (posts.length > 1) {
      nextBtn.classList.remove("hidden");
      nextBtn.onclick = () => loadPost(posts[1].filename, 1);
    } else {
      nextBtn.classList.add("hidden");
      nextBtn.onclick = null;
    }

  } catch (err) {
    contentContainer.innerText = "⚠️ Failed to load latest post.";
    console.error(err);
  }
}

async function loadPost(filename, index) {
  const contentContainer = document.getElementById("now-content");
  const navContainer = document.getElementById("post-nav");

  try {
    const res = await fetch("posts/" + filename);
    const md = await res.text();
    const html = marked.parse(md);
    const withClass = html.replace("<h1>", "<h1 class='post-date'>");
    contentContainer.innerHTML = withClass;

    const resPosts = await fetch("posts.json");
    const posts = await resPosts.json();

    // Show/hide nav icons and attach handlers
    const prevBtn = document.getElementById("nav-prev");
    const nextBtn = document.getElementById("nav-next");

    prevBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");
    prevBtn.onclick = null;
    nextBtn.onclick = null;

    if (index > 0) {
      prevBtn.classList.remove("hidden");
      prevBtn.onclick = () => loadPost(posts[index - 1].filename, index - 1);
    }

    if (index + 1 < posts.length) {
      nextBtn.classList.remove("hidden");
      nextBtn.onclick = () => loadPost(posts[index + 1].filename, index + 1);
    }

  } catch (err) {
    contentContainer.innerText = "Failed to load selected post.";
    console.error(err);
  }
}

function loadNowSafely() {
  if (window._hasLoadedNowContent) return;
  window._hasLoadedNowContent = true;
  loadLatestPost();
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  loadNowSafely();
} else {
  document.addEventListener("DOMContentLoaded", loadNowSafely, { once: true });
  window.addEventListener("pageshow", loadNowSafely, { once: true });
}
