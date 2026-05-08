document.addEventListener("DOMContentLoaded", () => {
  initSliders();
  initMusicPlayer();
});

/* =========================
   SLIDER ẢNH NGANG
========================= */
function initSliders() {
  const sliders = document.querySelectorAll(".slider-wrapper");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".photo-track");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    if (!track || !prevBtn || !nextBtn) return;

    if (!track.dataset.cloned) {
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = "true";
    }

    let autoRun = null;
    let isDragging = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let touchStartX = 0;
    let touchScrollLeftStart = 0;

    const STEP = 300;
    const AUTO_SPEED = 0.5;
    const AUTO_INTERVAL = 20;

    function resetLoopIfNeeded() {
      const halfWidth = track.scrollWidth / 2;
      if (track.scrollLeft >= halfWidth) {
        track.scrollLeft = 0;
      } else if (track.scrollLeft < 0) {
        track.scrollLeft = halfWidth;
      }
    }

    function startAutoRun() {
      stopAutoRun();
      autoRun = setInterval(() => {
        if (!isDragging) {
          track.scrollLeft += AUTO_SPEED;
          resetLoopIfNeeded();
        }
      }, AUTO_INTERVAL);
    }

    function stopAutoRun() {
      if (autoRun) {
        clearInterval(autoRun);
        autoRun = null;
      }
    }

    prevBtn.addEventListener("click", () => {
      stopAutoRun();
      track.scrollBy({
        left: -STEP,
        behavior: "smooth"
      });
      setTimeout(startAutoRun, 500);
    });

    nextBtn.addEventListener("click", () => {
      stopAutoRun();
      track.scrollBy({
        left: STEP,
        behavior: "smooth"
      });
      setTimeout(startAutoRun, 500);
    });

    slider.addEventListener("mouseenter", stopAutoRun);
    slider.addEventListener("mouseleave", () => {
      if (!isDragging) startAutoRun();
    });

    track.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX;
      scrollLeftStart = track.scrollLeft;
      stopAutoRun();
      track.classList.add("dragging");
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const walk = (e.pageX - startX) * 1.5;
      track.scrollLeft = scrollLeftStart - walk;
      resetLoopIfNeeded();
    });

    function stopDragging() {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove("dragging");
      startAutoRun();
    }

    window.addEventListener("mouseup", stopDragging);

    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeftStart = track.scrollLeft;
      stopAutoRun();
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
      const touchX = e.touches[0].pageX;
      const walk = (touchX - touchStartX) * 1.2;
      track.scrollLeft = touchScrollLeftStart - walk;
      resetLoopIfNeeded();
    }, { passive: true });

    track.addEventListener("touchend", () => {
      startAutoRun();
    });

    startAutoRun();
  });
}

/* =========================
   MUSIC PLAYER
========================= */
function initMusicPlayer() {
  const musicPlayer = document.getElementById("musicPlayer");
  const musicToggle = document.getElementById("musicToggle");
  const musicPanel = document.getElementById("musicPanel");
  const bgMusic = document.getElementById("bgMusic");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const musicSeek = document.getElementById("musicSeek");
  const closeMusicPanel = document.getElementById("closeMusicPanel");

  if (
    !musicPlayer ||
    !musicToggle ||
    !musicPanel ||
    !bgMusic ||
    !playPauseBtn ||
    !musicSeek ||
    !closeMusicPanel
  ) {
    return;
  }

  const STORAGE_TIME = "musicTime";
  const STORAGE_PLAYING = "musicPlaying";

  function updatePlayButton() {
    playPauseBtn.textContent = bgMusic.paused ? "▶" : "⏸";
  }

  function saveMusicState() {
    localStorage.setItem(STORAGE_TIME, String(bgMusic.currentTime || 0));
    localStorage.setItem(STORAGE_PLAYING, bgMusic.paused ? "false" : "true");
  }

  function restoreMusicState() {
    const savedTime = localStorage.getItem(STORAGE_TIME);
    const savedPlaying = localStorage.getItem(STORAGE_PLAYING);

    if (savedTime !== null && !Number.isNaN(parseFloat(savedTime))) {
      bgMusic.currentTime = parseFloat(savedTime);
    }

    updatePlayButton();
  }

  function openPanel() {
    musicPanel.classList.add("show");
  }

  function closePanel() {
    musicPanel.classList.remove("show");
  }

  function togglePanel() {
    musicPanel.classList.toggle("show");
  }

  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePanel();
  });

  closeMusicPanel.addEventListener("click", (e) => {
    e.stopPropagation();
    closePanel();
  });

  musicPanel.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    closePanel();
  });

  playPauseBtn.addEventListener("click", async (e) => {
    e.stopPropagation();

    try {
      if (bgMusic.paused) {
        await bgMusic.play();
      } else {
        bgMusic.pause();
      }

      updatePlayButton();
      saveMusicState();
      openPanel();
    } catch (error) {
      console.error("Không thể phát nhạc:", error);
    }
  });

  bgMusic.addEventListener("timeupdate", () => {
    if (bgMusic.duration && Number.isFinite(bgMusic.duration)) {
      const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
      musicSeek.value = progress;
    } else {
      musicSeek.value = 0;
    }

    saveMusicState();
  });

  musicSeek.addEventListener("input", (e) => {
    e.stopPropagation();

    if (bgMusic.duration && Number.isFinite(bgMusic.duration)) {
      bgMusic.currentTime = (parseFloat(musicSeek.value) / 100) * bgMusic.duration;
      saveMusicState();
    }
  });

  bgMusic.addEventListener("play", () => {
    updatePlayButton();
    saveMusicState();
  });

  bgMusic.addEventListener("pause", () => {
    updatePlayButton();
    saveMusicState();
  });

  bgMusic.addEventListener("loadedmetadata", () => {
    const savedTime = localStorage.getItem(STORAGE_TIME);
    if (savedTime !== null && !Number.isNaN(parseFloat(savedTime))) {
      bgMusic.currentTime = parseFloat(savedTime);
    }
  });

  restoreMusicState();
  updatePlayButton();
}




/* =========================
   BẢO MẬT
========================= */
document.addEventListener("contextmenu", e => e.preventDefault());

document.onkeydown = function(e){

  if(e.keyCode == 123){
    return false;
  }

  if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)){
    return false;
  }

}

<meta name="robots" content="noindex,nofollow">
