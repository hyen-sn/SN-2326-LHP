/* =========================
   NÚT KÉO TRÁI PHẢI
========================= */
const sliders = document.querySelectorAll('.slider-wrapper');

sliders.forEach((slider) => {
  const track = slider.querySelector('.photo-track');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');

  prevBtn.addEventListener('click', () => {
    track.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  });
});

/* =========================
  ẢNH TỰ TRÔI
========================= */
const autoTracks = document.querySelectorAll('.photo-track');

autoTracks.forEach((track) => {
  let autoScroll = setInterval(() => {
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
      track.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    } else {
      track.scrollBy({
        left: 1,
        behavior: 'smooth'
      });
    }
  }, 20);

  track.addEventListener('mouseenter', () => clearInterval(autoScroll));

  track.addEventListener('mouseleave', () => {
    autoScroll = setInterval(() => {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
        track.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        track.scrollBy({
          left: 1,
          behavior: 'smooth'
        });
      }
    }, 20);
  });
});

/* =========================
   KÉO MƯỢT 
========================= */
document.querySelectorAll('.photo-track').forEach((track) => {
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('dragging');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('dragging');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
});



