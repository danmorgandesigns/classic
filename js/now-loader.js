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

    const nextBtn = document.getElementById("nav-next");
    const prevBtn = document.getElementById("nav-prev");
    
    // Set "Prev" to disabled image and no click
    prevBtn.src = "images/prev-arrow-disabled.svg";
    prevBtn.onclick = null;
    
    // Set "Next" to enabled if available
    if (posts.length > 1) {
      nextBtn.src = "images/next-arrow.svg";
      nextBtn.onclick = () => loadPost(posts[1].filename, 1);
    } else {
      nextBtn.src = "images/next-arrow-disabled.svg";
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

    const prevBtn = document.getElementById("nav-prev");
    const nextBtn = document.getElementById("nav-next");
    
    // Reset
    prevBtn.onclick = null;
    nextBtn.onclick = null;
    
    // Set default to disabled icons
    prevBtn.src = "images/prev-arrow-disabled.svg";
    nextBtn.src = "images/next-arrow-disabled.svg";
    
    // Enable Prev if available
    if (index > 0) {
      prevBtn.src = "images/prev-arrow.svg";
      prevBtn.onclick = () => loadPost(posts[index - 1].filename, index - 1);
    }
    
    // Enable Next if available
    if (index + 1 < posts.length) {
      nextBtn.src = "images/next-arrow.svg";
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
