function togglePalette() {
    const palette = document.getElementById("palette");
    if (palette) {
        palette.classList.toggle("hidden");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    fetch("components/palette-component.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("palette-container").innerHTML = html;
        });
});