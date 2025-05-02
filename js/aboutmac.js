function toggleAboutMac() {
    const aboutmac = document.getElementById("aboutmacModal");
    if (aboutmac) {
        // Show it with flex (required for modal centering)
        const isVisible = aboutmac.style.display === "block";
        aboutmac.style.display = isVisible ? "none" : "block";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    fetch("components/aboutmac-component.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("aboutmac-container").innerHTML = html;

            // TEMP test button:
            // const testButton = document.createElement("button");
            // testButton.innerText = "Open About Modal";
            // testButton.className = "classic-default-button fixed bottom-6 left-6 z-50";
            // testButton.addEventListener("click", toggleAboutMac);
            // document.body.appendChild(testButton);
        });
});


function closeAboutMac() {
    const modal = document.getElementById("aboutmacModal");
    if (modal) {
      modal.style.display = "none";
    }
  }