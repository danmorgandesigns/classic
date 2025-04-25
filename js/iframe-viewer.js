window.addEventListener("DOMContentLoaded", () => {
    fetch("components/iframe-viewer-component.html")
      .then(res => res.text())
      .then(html => {
        document.getElementById("viewer-container").insertAdjacentHTML("beforeend", html);
  
        // Add launch behavior
        document.querySelectorAll(".iframe-launcher[data-pdf]").forEach(el => {
          el.addEventListener("click", () => {
            const pdfUrl = el.getAttribute("data-pdf");
            const title = el.getAttribute("alt") || "PDF Preview";
  
            document.getElementById("pdfFrame").src = pdfUrl;
            document.getElementById("iframeModalTitle").textContent = title;
            document.getElementById("iframeModal").style.display = "flex";
          });
        });
      });
  });
  
  // Close logic
  function closeIframeModal() {
    const modal = document.getElementById("iframeModal");
    if (modal) {
      modal.style.display = "none";
      document.getElementById("pdfFrame").src = ""; // clear to stop loading
    }
  }