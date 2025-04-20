async function loadLatestPost() {
  const contentContainer = document.getElementById("now-content");
  const navContainer = document.getElementById("post-nav");

  try {
    const res = await fetch("posts.json");
    const posts = await res.json();
    const latest = posts[0];

    const postRes = await fetch("posts/" + latest.filename);
    const md = await postRes.text();
    contentContainer.innerHTML = marked.parse(md);

    // Add previous posts
    if (posts.length > 1) {
      let navHtml = "<h3>Past Entries:</h3><ul>";
      for (let i = 1; i < posts.length; i++) {
        navHtml += `<li><a href="#" onclick="loadPost('${posts[i].filename}');return false;">${posts[i].title}</a></li>`;
      }
      navHtml += "</ul>";
      navContainer.innerHTML = navHtml;
    }

  } catch (err) {
    contentContainer.innerText = "Failed to load post.";
    console.error(err);
  }
}

async function loadPost(filename) {
  const contentContainer = document.getElementById("now-content");
  try {
    const res = await fetch("posts/" + filename);
    const md = await res.text();
    contentContainer.innerHTML = marked.parse(md);
  } catch (err) {
    contentContainer.innerText = "Failed to load selected post.";
    console.error(err);
  }
}

loadLatestPost();
