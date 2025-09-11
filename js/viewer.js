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
            // Get viewport at scale 1 to determine orientation
            const originalViewport = page.getViewport({ scale: 1.0 });
            
            // Get modal dimensions
            const modalContent = document.getElementById("modalContent");
            const availableWidth = modalContent.clientWidth - 20; // 10px padding on each side
            const availableHeight = modalContent.clientHeight - 20;
            
            // Calculate scale based on orientation
            let scale;
            if (originalViewport.width > originalViewport.height) {
                // Landscape
                scale = Math.min(
                    availableWidth / originalViewport.width,
                    availableHeight / originalViewport.height
                );
            } else {
                // Portrait - calculate fresh each time
                scale = Math.min(
                    availableWidth / originalViewport.width,
                    availableHeight / originalViewport.height
                );
            }

            // Create new viewport with calculated scale
            const viewport = page.getViewport({ scale });

            // Reset canvas dimensions each time
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Clear any previous transforms
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            
            return page.render(renderContext).promise;
        }).then(() => {
            // Fade back in
            canvas.style.opacity = 1;
        });
    }, 100);

    document.getElementById("pageInfo").textContent = `Page ${num} of ${totalPages}`;
}

// Add a cleanup function when closing modal
function closeModal() {
    const modal = document.getElementById("previewModal");
    const canvas = document.getElementById("pdf-canvas");
    
    // Reset canvas
    canvas.width = 0;
    canvas.height = 0;
    canvas.style.width = 'auto';
    canvas.style.height = 'auto';
    
    modal.style.display = "none";
    pdfDoc = null;
    currentPage = 1;
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
                            modalBox.style.width = "calc(100vw - 10px)";
                            modalBox.style.height = "80vh";
                            modalBox.style.marginLeft = "auto";
                            modalBox.style.marginRight = "auto";
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
                            canvas.style.maxHeight = "50vh"; // tweak as needed
                        }

                        //added

    if (!isMobile && aspectRatio < 1.0) {
        modalBox.style.width = "auto";
        modalBox.style.height = "";        
        modalBox.style.maxHeight = "90vh";
        modalBox.style.margin = "auto";
        // canvas.style.height = "auto";
        // canvas.style.maxHeight = "80vh";
        // canvas.style.marginTop = "20px";
        // canvas.style.marginBottom = "20px";
    }
            
    // const breathingSpace = 60; // or tweak this
    // const canvasOffset = 60;   // canvas leaves extra room inside
    
    // if (!isMobile && aspectRatio < 1.0) {
    //     // modalBox.style.width = "auto";
    //     // modalBox.style.height = "";
    //     // modalBox.style.maxHeight = `calc(100vh - ${breathingSpace}px)`;
    //     // modalBox.style.margin = "auto";
    //     // canvas.style.height = "auto";
    //     // canvas.style.maxHeight = `calc(100vh - ${breathingSpace + canvasOffset}px)`;
    //     // canvas.style.marginTop = "20px";
    //     // canvas.style.marginBottom = "20px";
    // } 
    

    
    
    //end added

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
