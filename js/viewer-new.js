// Set up PDF.js worker and quality settings
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Configure PDF.js with higher quality settings
const pdfViewerOptions = {
    maxImageSize: 10000 * 10000,
    useSystemFonts: true,
    isOffscreenCanvasSupported: true,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
    disableFontFace: false,
    fontExtraProperties: true
};

window.addEventListener("DOMContentLoaded", () => {
    fetch("components/viewer-component.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("viewer-container").innerHTML = html;

            const closeBox = document.querySelector('.close-box');
            if (closeBox) {
                closeBox.addEventListener('click', () => {
                    const modal = document.getElementById('previewModal');
                    if (modal) modal.classList.remove('visible');
                });
            }

            const modal = document.getElementById("previewModal");
            const modalContent = document.getElementById("modalContent");
            const modalBox = document.querySelector(".modal-content");
            const modalTitle = document.getElementById("modalTitle");
            const canvas = document.getElementById("pdf-canvas");
            const ctx = canvas.getContext("2d", {
                alpha: false,
                willReadFrequently: true
            });
            const imageViewer = document.getElementById("image-viewer");

            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            let pdfDoc = null;
            let currentPage = 1;
            let totalPages = 0;

function renderPage(num) {
    const modalContent = document.getElementById("modalContent");
    const modalBox = document.querySelector(".modal-content");
    
    // Clear previous render state
    canvas.width = 0;
    canvas.height = 0;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    if (modalBox.style.display === 'none') {
        modalBox.style.display = 'flex';
    }
    
    modalBox.offsetHeight;
    canvas.style.opacity = 0;

    setTimeout(() => {
        pdfDoc.getPage(num).then(page => {
            const originalViewport = page.getViewport({ scale: 1.0 });
            const availableWidth = modalContent.clientWidth - 20;
            const availableHeight = modalContent.clientHeight - 40;
            
            // Adjust scale calculation based on orientation
            let scale;
            if (originalViewport.width > originalViewport.height) {
                // Landscape calculation
                scale = Math.min(
                    availableWidth / originalViewport.width,
                    availableHeight / originalViewport.height
                );
                scale *= (window.devicePixelRatio || 1) * 1.5;  // Full scale for landscape
            } else {
                // Portrait calculation - reduced scale
                scale = Math.min(
                    (availableWidth * 0.85) / originalViewport.width,
                    (availableHeight * 0.4) / originalViewport.height
                );
    scale *= (window.devicePixelRatio || 1) * 1.2;  // Added multiplier back for better quality
            }
            
            const viewport = page.getViewport({ scale });
            
            // Set canvas size to high-DPI dimensions
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Set display size to CSS pixels
            canvas.style.width = `${viewport.width / (window.devicePixelRatio || 1)}px`;
            canvas.style.height = `${viewport.height / (window.devicePixelRatio || 1)}px`;
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
                intent: 'print',
                renderInteractiveForms: true,
                antialiasing: false,
                backgroundGraphics: true
            };
            
            // Debug logging moved inside promise chain where variables are available
            console.log('Debug:', {
                originalDims: `${originalViewport.width}x${originalViewport.height}`,
                scale: scale,
                finalDims: `${viewport.width}x${viewport.height}`,
                devicePixelRatio: window.devicePixelRatio
            });
            
            return page.render(renderContext).promise;
        }).then(() => {
            canvas.style.opacity = 1;
        }).catch(error => {
            console.error('Render error:', error);
        });
    }, 100);

    document.getElementById("pageInfo").textContent = `Page ${num} of ${totalPages}`;
}

            function closeModal() {
                modal.style.display = "none";
                canvas.classList.add("hidden");
                imageViewer.classList.add("hidden");
                imageViewer.src = "";
                modalBox.style.aspectRatio = "";
                modalBox.style.width = "";
                modalBox.style.height = "";
                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
                pdfDoc = null;
                currentPage = 1;
            }
            window.closeModal = closeModal;

            document.querySelectorAll(".pdf-launcher").forEach(thumb => {
                thumb.addEventListener("click", () => {
                    console.log("📄 PDF launcher clicked!");
                    const fullSrc = thumb.getAttribute("data-full");
                    const isPDF = fullSrc.toLowerCase().endsWith(".pdf");
                    const aspectRatio = parseFloat(thumb.getAttribute("data-aspect") || "0.77");
                    const isMobile = window.innerWidth <= 640;

                    modalTitle.textContent = thumb.getAttribute("alt") || "Untitled";
                    modal.style.display = "flex";
                    modalBox.offsetHeight;

                    const downloadBtn = document.getElementById("downloadPDF");
                    if (downloadBtn) {
                        if (isPDF) {
                            downloadBtn.classList.remove("hidden");
                            downloadBtn.onclick = () => {
                                const a = document.createElement("a");
                                a.href = fullSrc;
                                a.download = fullSrc.split("/").pop();
                                a.click();
                            };
                        } else {
                            downloadBtn.classList.add("hidden");
                            downloadBtn.onclick = null;
                        }
                    }

                    if (aspectRatio >= 1.0 && isMobile) {
    modalBox.style.width = "calc(100vw - 20px)";  // Changed from 100vw
    modalBox.style.height = "auto";
    modalBox.style.maxHeight = "90vh";
    modalBox.style.margin = "10px";  // Added margin
                    } else if (aspectRatio >= 1.0) {
                        modalBox.style.width = "65vw";
                        modalBox.style.maxHeight = "75vh";
                        modalBox.style.height = "auto";
                        modalBox.style.margin = "auto";
                    } else {
                        if (isMobile) {
                            modalBox.style.width = "calc(100vw - 10px)";
                            modalBox.style.height = "80vh";
                            modalBox.style.marginLeft = "auto";
                            modalBox.style.marginRight = "auto";
                        } else {
                            modalBox.style.width = "auto";
                            modalBox.style.height = "80vh"; //reduced from 80 to 70 2025.09.13
                            modalBox.style.margin = "auto";
                        }
                    }

                    if (isPDF) {
                        canvas.classList.remove("hidden");
                        imageViewer.classList.add("hidden");
                        document.getElementById("pdf-controls").classList.remove("hidden");

                        canvas.style.aspectRatio = aspectRatio;
                        canvas.style.marginLeft = "auto";
                        canvas.style.marginRight = "auto";
                        canvas.style.display = "block";

                        if (aspectRatio < 1.0) {
                            canvas.style.width = "auto";
                            canvas.style.height = "80%"; // changed from 100 to 80 2025.09.13
                            canvas.style.maxHeight = "80vh"; // changed from 90 to 80 2025.09.13
                            canvas.style.maxWidth = "auto";
                        } else {
                            canvas.style.width = "100%";
                            canvas.style.height = "auto";
                            canvas.style.maxWidth = "1024px";
                        }

                        if (isMobile && aspectRatio > 1.0) {
    canvas.style.width = "100%";  // Force full width
    canvas.style.height = "auto";
    canvas.style.maxHeight = "80vh";
    canvas.style.maxWidth = "100%";  // Override the 1024px limit
                        }

                        pdfjsLib.getDocument({
                            url: fullSrc,
                            ...pdfViewerOptions
                        }).promise.then(pdf => {
                            pdfDoc = pdf;
                            totalPages = pdf.numPages;
                            currentPage = 1;
                            renderPage(currentPage);
                        }).catch(err => {
                            console.error("PDF rendering error:", err);
                        });
                    } else {
                        canvas.classList.add("hidden");
                        imageViewer.classList.remove("hidden");
                        imageViewer.src = fullSrc;
                    }
                });
            });

            window.addEventListener("click", (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });

            window.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    closeModal();
                }

                if (modal.style.display === "flex" && pdfDoc) {
                    if (e.key === "ArrowRight") {
                        if (currentPage < totalPages) {
                            currentPage++;
                            renderPage(currentPage);
                        }
                    }
                    if (e.key === "ArrowLeft") {
                        if (currentPage > 1) {
                            currentPage--;
                            renderPage(currentPage);
                        }
                    }
                }
            });

            document.getElementById("prevPage").addEventListener("click", () => {
                if (currentPage <= 1) return;
                currentPage--;
                renderPage(currentPage);
            });

            document.getElementById("nextPage").addEventListener("click", () => {
                if (currentPage >= totalPages) return;
                currentPage++;
                renderPage(currentPage);
            });
        });
});