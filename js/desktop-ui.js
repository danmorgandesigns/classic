// Clock setup function
function setupClock() {
    const clockEl = document.getElementById('clock');
  
    if (!clockEl) return;
  
    const formatTime = () => {
      const now = new Date();
      const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      return now.toLocaleTimeString('en-US', options);
    };
  
    const formatDate = () => {
      const now = new Date();
      const mm = now.getMonth() + 1;
      const dd = now.getDate();
      const yy = now.getFullYear().toString().slice(-2);
      return `${mm}/${dd}/${yy}`;
    };
  
    let showingDate = false;
    let timeInterval;
    let resetTimeout;
  
    const showTime = () => {
      clockEl.textContent = formatTime();
    };
  
    const startClock = () => {
      timeInterval = setInterval(() => {
        if (!showingDate) {
          showTime();
        }
      }, 1000);
    };
  
    clockEl.addEventListener('click', () => {
      if (showingDate) return;
  
      showingDate = true;
      clockEl.textContent = formatDate();
  
      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        showingDate = false;
        showTime();
      }, 3000);
    });
  
    showTime();
    startClock();
  }
  

  
  // Load the system menubar and related UI
  window.addEventListener("DOMContentLoaded", () => {
    fetch("components/desktop-component.html")
      .then(res => res.text())
      .then(html => {
        document.getElementById("desktop-container").innerHTML = html;
  
        // Apple icon → launch invaders
        const appleIcon = document.querySelector(".apple-icon");
        if (appleIcon) {
          appleIcon.addEventListener("click", () => {
            toggleInvaders();
            hideUFO();
          });
        }
  
        // Tools label
        const toolsLabel = document.querySelector(".system-menubar-font:nth-child(4)");
        if (toolsLabel) {
          toolsLabel.addEventListener("click", togglePalette);
        }
  
        // Home label
        const homeLabel = document.querySelector(".system-menubar-font:nth-child(5)");
        if (homeLabel) {
          homeLabel.addEventListener("click", () => {
            window.location.href = "index.html";
          });
        }
  
        // Mac happy/sad toggle
        const macIcon = document.getElementById("mac-icon");
        const macContainer = document.getElementById("mac-container");
        if (macContainer && macIcon) {
          macContainer.addEventListener("click", () => {
            macIcon.src = "images/sad-mac-icon.svg";
            setTimeout(() => {
              macIcon.src = "images/happy-mac-icon.svg";
            }, 5000);
          });
        }
  
        // Clarus rotation
        const clarusIcon = document.getElementById("clarus-icon");
        const clarusContainer = document.getElementById("clarus-container");
        if (clarusContainer && clarusIcon) {
          clarusContainer.addEventListener("click", () => {
            clarusIcon.classList.remove("rotate-once");
            void clarusIcon.offsetWidth; // force reflow
            clarusIcon.classList.add("rotate-once");
          });
        }
  
        // Trash full/empty
        const trashIcon = document.getElementById("trash-icon");
        const trashContainer = document.getElementById("trash-container");
        if (trashContainer && trashIcon) {
          trashContainer.addEventListener("click", () => {
            trashIcon.src = "images/trash-full.svg";
            setTimeout(() => {
              trashIcon.src = "images/trash.svg";
            }, 5000);
          });
        }
  
        // Start the clock
        setupClock();
      });
  });