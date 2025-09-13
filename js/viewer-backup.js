window.addEventListener("DOMContentLoaded", () => {
    fetch("components/viewer-component.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("viewer-container").innerHTML = html;

            // ✅ Modal close button logic
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
            const ctx = canvas.getContext("2d");
            const imageViewer = document.getElementById("image-viewer");

            let pdfDoc = null;
            let currentPage = 1;
            let totalPages = 0;

            function renderPage(num) {
                // Force layout calculation before rendering
                const modalContent = document.getElementById("modalContent");
                const modalBox = document.querySelector(".modal-content");
                
                // Ensure modal is visible before calculations
                if (modalBox.style.display === 'none') {
                    modalBox.style.display = 'flex';
                }
                
                // Force layout recalculation
                modalBox.offsetHeight;
                
                // Fade out
                canvas.style.opacity = 0;

                setTimeout(() => {
                    pdfDoc.getPage(num).then(page => {
                        const originalViewport = page.getViewport({ scale: 1.0 });
                        
                        // Get accurate modal dimensions after layout
                        const availableWidth = modalContent.clientWidth - 20;
                        const availableHeight = modalContent.clientHeight - 40;
                        
                        let scale;
                        if (originalViewport.width > originalViewport.height) {
                            // Landscape
                            scale = Math.min(
                                availableWidth / originalViewport.width,
                                availableHeight / originalViewport.height
                            );
                        } else {
                            // Portrait - ensure consistent scaling
                            scale = Math.min(
                                availableWidth / originalViewport.width,
                                availableHeight / originalViewport.height
                            ) * 1; // Small reduction for padding
                        }
                        
                        const viewport = page.getViewport({ scale });
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        
                        const renderContext = {
                            canvasContext: ctx,
                            viewport: viewport
                        };
                        
                        return page.render(renderContext).promise;
                    }).then(() => {
                        canvas.style.opacity = 1;
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
                    modalBox.offsetHeight; // Force layout calculation

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

                    // Set modal dimensions based on aspect ratio
                    if (aspectRatio >= 1.0 && isMobile) {
                        modalBox.style.width = "100vw";
                        modalBox.style.height = "";
                        modalBox.style.maxHeight = "100vh";
                    } else if (aspectRatio >= 1.0) {
    modalBox.style.width = "65vw";        // Reduced from 80vw
    modalBox.style.maxHeight = "75vh";    // Reduced from 80vh
    modalBox.style.height = "auto";
    modalBox.style.margin = "auto";

    canvas.style.width = "100%";          // Fill modal width
    canvas.style.maxWidth = "none";       // Remove max-width constraint
    canvas.style.height = "auto";
    canvas.style.maxHeight = "100%";      // Fill available height
                    } else {
                        if (isMobile) {
                            modalBox.style.width = "calc(100vw - 10px)";
                            modalBox.style.height = "80vh";
                            modalBox.style.marginLeft = "auto";
                            modalBox.style.marginRight = "auto";
                        } else {
                            modalBox.style.width = "auto";
                            modalBox.style.height = "80vh";
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
                            canvas.style.height = "100%";
                            canvas.style.maxHeight = "90vh";
                            canvas.style.maxWidth = "auto";
                        } else {
                            canvas.style.width = "100%";
                            canvas.style.height = "auto";
                            canvas.style.maxWidth = "1024px";
                        }

                        if (isMobile && aspectRatio > 1.0) {
                            canvas.style.maxHeight = "50vh";
                        }

                        pdfjsLib.getDocument(fullSrc).promise.then(pdf => {
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

            // Event Listeners
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