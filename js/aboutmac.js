function toggleAboutMac() {
    const aboutmac = document.getElementById("aboutmacModal");
    if (aboutmac) {
        aboutmac.classList.toggle("hidden");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    fetch("components/aboutmac-component.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("palette-container").innerHTML = html;
        });
});