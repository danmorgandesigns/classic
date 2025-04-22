let invadersBouncing = false;

function toggleInvaders() {
  const invaders = document.getElementById('space-invaders');
  const windowEl = document.querySelector('.hypercard-window');

  if (!invadersBouncing) {
    invaders.classList.remove('hidden');

    let direction = 1;
    let position = 0;
    let speed = 0.25;

    function animate() {
      const windowWidth = windowEl.clientWidth;
      const invadersWidth = invaders.offsetWidth;
      const maxX = windowWidth - invadersWidth;

      position += speed * direction;

      if (position >= maxX || position <= 0) {
        direction *= -1;
      }

      invaders.style.left = `${position}px`;
      requestAnimationFrame(animate);
    }

    animate();
    invadersBouncing = true;

    setTimeout(() => {
      launchUFO();
    }, 1000);

  } else {
    invaders.classList.toggle('hidden');
    hideUFO();
  }
}

function launchUFO() {
  const ufo = document.getElementById('ufo');
  const container = document.querySelector('.hypercard-window');

  const containerWidth = container.offsetWidth;
  const ufoWidth = ufo.offsetWidth;
  const maxX = containerWidth - ufoWidth;

  let position = 0;
  let speed = 1.0;

  ufo.style.transition = 'none';
  ufo.style.transform = 'translateX(0)';
  ufo.style.opacity = '0';

  setTimeout(() => {
    ufo.style.transition = 'opacity 0.5s ease-in-out';
    ufo.style.opacity = '1';

    const fadeOutStart = maxX - 50;

    function animate() {
      position += speed;
      ufo.style.transform = `translateX(${position}px)`;

      if (position >= fadeOutStart) {
        ufo.style.transition = 'opacity 0.5s ease-in-out';
        ufo.style.opacity = '0';
      }

      if (position < maxX) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          ufo.style.transition = 'none';
          ufo.style.opacity = '0';
          ufo.style.transform = 'translateX(0)';
        }, 500);
      }
    }

    requestAnimationFrame(animate);
  }, 2000);
}

function startInvaderAnimation() {
  const frames = {
    crab: ["images/crab-1.svg", "images/crab-2.svg"],
    squid: ["images/squid-1.svg", "images/squid-2.svg"],
    eclipse: ["images/eclipse-1.svg", "images/eclipse-2.svg"],
  };

  const animatedImages = document.querySelectorAll('img[data-type]');
  animatedImages.forEach((img) => {
    const type = img.getAttribute("data-type").toLowerCase();
    if (!frames[type]) return;

    let frameIndex = 0;
    setInterval(() => {
      frameIndex = (frameIndex + 1) % frames[type].length;
      img.src = frames[type][frameIndex];
    }, 1000);
  });
}


function hideUFO() {
  const ufo = document.getElementById('ufo');
  if (!ufo) return;
  ufo.style.transition = 'none';
  ufo.style.opacity = '0';
  ufo.style.transform = 'translateX(0)';
}


fetch('components/invaders-component.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('invader-container').innerHTML = html;

    // Start the animation that cycles between frame 1 and 2
    startInvaderAnimation();

    // Load sound
    const eepSound = new Audio('sounds/whit.mp3');
    eepSound.load();
    // Make all invaders clickable: animate + hide + play sound
    const invaderImages = document.querySelectorAll('#space-invaders img[data-type]');

    invaderImages.forEach((img) => {
      img.addEventListener('click', () => {
        // Rewind and play sound
        eepSound.currentTime = 0;
        eepSound.play();

        // Animate and hide
        img.classList.add('animate-ping');
        setTimeout(() => {
          img.classList.add('hidden');
        }, 200);
      });
    });
  });