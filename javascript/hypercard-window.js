// hypercard-window.js

function initHypercardWindow(windowId = 'window', titleBarId = 'titleBar') {
  const windowEl = document.getElementById(windowId);
  const titleBar = document.getElementById(titleBarId);

  if (!windowEl || !titleBar) {
    console.error('HyperCard window or title bar not found');
    return;
  }

  // Initial positioning
  centerWindow(windowEl);

  // Drag logic
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  titleBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = windowEl.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'move';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    windowEl.style.left = `${initialLeft + deltaX}px`;
    windowEl.style.top = `${initialTop + deltaY}px`;
  });
}

function centerWindow(windowEl) {
  const rect = windowEl.getBoundingClientRect();
  const left = (window.innerWidth - rect.width) / 2;
  const top = 20;
  windowEl.style.left = `${left}px`;
  windowEl.style.top = `${top}px`;
  windowEl.style.transform = 'none';
}

// Optional: expose more functions later like updateContent()