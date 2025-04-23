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

            // ✅ Rest of your viewer logic...
            // renderPDF(), page buttons, canvas/image handling, etc.




            const modal = document.getElementById("previewModal");
            const modalContent = document.getElementById("modalContent");
            const modalBox = document.querySelector(".modal-content");
            const modalTitle = document.getElementById("modalTitle");
            const canvas = document.getElementById("pdf-canvas");
            const ctx = canvas.getContext("2d");

            let pdfDoc = null;
            let currentPage = 1;
            let totalPages = 0;

            function renderPage(num) {
                // Fade out
                canvas.style.opacity = 0;

                setTimeout(() => {
                    pdfDoc.getPage(num).then(page => {
                        const viewport = page.getViewport({ scale: 1.5 });
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        const renderContext = {
                            canvasContext: ctx,
                            viewport: viewport
                        };
                        return page.render(renderContext).promise;
                    }).then(() => {
                        // Fade back in after render
                        canvas.style.opacity = 1;
                    });
                }, 100); // delay before rendering to allow fade-out

                document.getElementById("pageInfo").textContent = `Page ${num} of ${totalPages}`;
            }




            const imageViewer = document.getElementById("image-viewer");

            document.querySelectorAll(".pdf-launcher").forEach(thumb => {
                thumb.addEventListener("click", () => {
                    console.log("📄 PDF launcher clicked!");
                    const fullSrc = thumb.getAttribute("data-full");
                    const isPDF = fullSrc.toLowerCase().endsWith(".pdf");
                    const aspectRatio = parseFloat(thumb.getAttribute("data-aspect") || "0.77");
                    const isMobile = window.innerWidth <= 640;

                    modalTitle.textContent = thumb.getAttribute("alt") || "Untitled";

        // INSERT THIS BLOCK ↓↓↓
        const downloadBtn = document.getElementById("downloadPDF");
        if (downloadBtn) {
            if (isPDF) {
                downloadBtn.classList.remove("hidden"); // if you're hiding it when not needed
                downloadBtn.onclick = () => {
                    const a = document.createElement("a");
                    a.href = fullSrc;
                    a.download = fullSrc.split("/").pop(); // optional custom name
                    a.click();
                };
            } else {
                downloadBtn.classList.add("hidden"); // hide if viewing an image
                downloadBtn.onclick = null;
            }
        }
        // END INSERT BLOCK ↑↑↑

                    if (aspectRatio >= 1.0 && isMobile) {

                        modalBox.style.width = "100vw";
                        modalBox.style.height = ""; // clear height so aspect-ratio can control it
                        modalBox.style.maxHeight = "100vh"; // optional, to prevent overspill
                    } else if (aspectRatio >= 1.0) {
                        modalBox.style.width = "80vw";
                        modalBox.style.maxHeight = "80vh";
                        modalBox.style.height = "auto";
                        modalBox.style.margin = "auto";
                    } else {
                        // Portrait PDF (< 1.0 aspect ratio)
                        if (isMobile) {
                            modalBox.style.width = "auto";
                            modalBox.style.height = "80vh";
                            // modalBox.style.marginTop = "1px";
                            modalBox.style.marginBottom = "";
                        } else {
                            modalBox.style.height = "80vh";
                            modalBox.style.width = "auto";
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

                        // start of new handling

                        if (aspectRatio < 1.0) {
                            canvas.style.width = "auto";
                            canvas.style.height = "100%";
                            canvas.style.maxHeight = "90vh";
                            canvas.style.maxWidth = "auto";


                            //end of new handling
                        } else {
                            canvas.style.width = "100%";
                            canvas.style.height = "auto";
                            canvas.style.maxWidth = "1024px";
                        }

                        if (isMobile && aspectRatio > 1.0) {
                            canvas.style.maxHeight = "50vh"; // tweak as needed
                        }

                        pdfjsLib.getDocument(fullSrc).promise.then(pdf => {
                            pdfDoc = pdf;
                            totalPages = pdf.numPages;
                            currentPage = 1;
                            renderPage(currentPage);
                        }).catch(err => {
                            console.error("PDF rendering error:", err);
                        });
                    }
                    else {
                        canvas.classList.add("hidden");
                        imageViewer.classList.remove("hidden");
                        imageViewer.src = fullSrc;
                    }

                    modal.style.display = "flex";
                });
            });
//end


            function closeModal() {
                modal.style.display = "none";
                canvas.classList.add("hidden");
                imageViewer.classList.add("hidden");
                imageViewer.src = "";
                modalBox.style.aspectRatio = "";
                modalBox.style.width = "";
                modalBox.style.height = "";
                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            }
            window.closeModal = closeModal; //find me



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
