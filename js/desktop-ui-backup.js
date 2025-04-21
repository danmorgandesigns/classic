//toggle happy and sad mac begin
const macIcon = document.getElementById('mac-icon');
const macContainer = document.getElementById('mac-container');

macContainer.addEventListener('click', () => {
    // Swap to sad Mac
    macIcon.src = 'images/sad-mac-icon.svg';

    // Revert to happy Mac after 10 seconds
    setTimeout(() => {
        macIcon.src = 'images/happy-mac-icon.svg';
    }, 5000); // 10,000 ms = 10 seconds
});
//toggle happy and sad mac end

//rotate clarus begin
const clarusIcon = document.getElementById('clarus-icon');
const clarusContainer = document.getElementById('clarus-container');
clarusContainer.addEventListener('click', () => {
    // Remove any existing animation class so we can reapply it
    clarusIcon.classList.remove('rotate-once');
    // Force reflow to restart animation
    void clarusIcon.offsetWidth;
    // Add the class back to trigger animation
    clarusIcon.classList.add('rotate-once');
});
//rotate clarus end

//trash empty to full begin
const trashIcon = document.getElementById('trash-icon');
const trashContainer = document.getElementById('trash-container');

trashContainer.addEventListener('click', () => {
    // Change to full trash
    trashIcon.src = 'images/trash-full.svg';

    // Revert to empty trash after 10 seconds
    setTimeout(() => {
        trashIcon.src = 'images/trash.svg';
    }, 5000); // 10 seconds
});
//trash empty to full end

// begin clock
function setupClock() {
    const clockEl = document.getElementById('clock');

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
        const mm = now.getMonth() + 1; // 1–12
        const dd = now.getDate();      // 1–31
        const yy = now.getFullYear().toString().slice(-2); // "25"
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
        if (showingDate) return; // ignore multiple taps while date is showing

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
setupClock();
// end clock

function togglePalette() {
    const palette = document.getElementById('palette');
    palette.classList.toggle('hidden');
}

window.addEventListener('DOMContentLoaded', () => {
    fetch('components/desktop-component.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('desktop-container').innerHTML = html;

            // ✅ Now that the component is in the DOM, it's safe to attach listeners
            const appleIcon = document.querySelector('.apple-icon');
            if (appleIcon) {
                appleIcon.addEventListener('click', () => {
                    toggleInvaders();
                    hideUFO();
                });
            }

            const toolsLabel = document.querySelector('.system-menubar-font:nth-child(4)');
            if (toolsLabel) {
                toolsLabel.addEventListener('click', togglePalette);
            }

            const homeLabel = document.querySelector('.system-menubar-font:nth-child(5)');
            if (homeLabel) {
                homeLabel.addEventListener('click', () => {
                    window.location.href = 'index.html';
                });
            }
        });
});