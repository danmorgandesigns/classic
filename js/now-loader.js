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

    if (posts.length > 1) {
      let navHtml = `
        <div class="flex justify-center items-center gap-6 mt-4">
          <img src="images/next-arrow.svg" alt="Older post" height="21px" width="22" class="cursor-pointer"
            onclick="loadPost('${posts[1].filename}', 1)" />
        </div>`;
      navContainer.innerHTML = navHtml;
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

    let navHtml = "<div class='flex justify-center items-center gap-6 mt-4'>";
    if (index > 0) {
      navHtml += `<img src="images/prev-arrow.svg" alt="Newer post" height="21"  width="23" class="cursor-pointer" onclick="loadPost('${posts[index - 1].filename}', ${index - 1})" />`;
    }
    if (index + 1 < posts.length) {
      navHtml += `<img src="images/next-arrow.svg" alt="Older post" height="21"  width="23" class="cursor-pointer" onclick="loadPost('${posts[index + 1].filename}', ${index + 1})" />`;
    }
    navHtml += "</div>";
    navContainer.innerHTML = navHtml;

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
