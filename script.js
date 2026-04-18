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

    // Chống nhân đôi nhiều lần nếu script bị gọi lại
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
  const musicToggle = document.getElementById("musicToggle");
  const musicPanel = document.getElementById("musicPanel");
  const bgMusic = document.getElementById("bgMusic");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const musicSeek = document.getElementById("musicSeek");
  const closeMusicPanel = document.getElementById("closeMusicPanel");

  if (
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

    // Không tự ép phát vì nhiều trình duyệt chặn autoplay.
    // Chỉ khôi phục icon và vị trí nhạc.
    if (savedPlaying === "true") {
      playPauseBtn.textContent = "▶";
    }
  }

  musicToggle.addEventListener("click", () => {
    musicPanel.classList.toggle("show");
  });

  closeMusicPanel.addEventListener("click", () => {
    musicPanel.classList.remove("show");
  });

  playPauseBtn.addEventListener("click", async () => {
    try {
      if (bgMusic.paused) {
        await bgMusic.play();
      } else {
        bgMusic.pause();
      }
      updatePlayButton();
      saveMusicState();
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

  musicSeek.addEventListener("input", () => {
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

document.addEventListener("DOMContentLoaded", function () {
  const musicPlayer = document.getElementById("musicPlayer");
  const musicToggle = document.getElementById("musicToggle");
  const musicPanel = document.getElementById("musicPanel");
  const bgMusic = document.getElementById("bgMusic");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const musicSeek = document.getElementById("musicSeek");
  const closePanelBtn = document.getElementById("closePanelBtn");

  if (!musicPlayer || !musicToggle || !musicPanel || !bgMusic || !playPauseBtn || !musicSeek || !closePanelBtn) {
    return;
  }

  // Khôi phục thời gian nhạc
  const savedTime = localStorage.getItem("musicTime");
  if (savedTime) {
    bgMusic.currentTime = parseFloat(savedTime);
  }

  // Khôi phục trạng thái phát
  const wasPlaying = localStorage.getItem("musicPlaying") === "true";

  function updatePlayButton() {
    playPauseBtn.textContent = bgMusic.paused ? "▶" : "⏸";
  }

  // Tự phát nếu trước đó đang phát
  if (wasPlaying) {
    bgMusic.play().then(() => {
      updatePlayButton();
    }).catch(() => {
      updatePlayButton();
    });
  } else {
    updatePlayButton();
  }

  // Bấm icon: chỉ mở / đóng panel
  musicToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    musicPlayer.classList.toggle("open");
  });

  // Nút đóng panel
  closePanelBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    musicPlayer.classList.remove("open");
  });

  // Play / pause
  playPauseBtn.addEventListener("click", function (e) {
    e.stopPropagation();

    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        localStorage.setItem("musicPlaying", "true");
        updatePlayButton();
      }).catch((error) => {
        console.log("Không thể tự phát nhạc:", error);
      });
    } else {
      bgMusic.pause();
      localStorage.setItem("musicPlaying", "false");
      updatePlayButton();
    }
  });

  // Cập nhật thanh thời gian
  bgMusic.addEventListener("timeupdate", function () {
    if (!isNaN(bgMusic.duration) && bgMusic.duration > 0) {
      const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
      musicSeek.value = progress;
    }
    localStorage.setItem("musicTime", bgMusic.currentTime);
  });

  // Kéo tua nhạc
  musicSeek.addEventListener("input", function (e) {
    e.stopPropagation();
    if (!isNaN(bgMusic.duration) && bgMusic.duration > 0) {
      bgMusic.currentTime = (musicSeek.value / 100) * bgMusic.duration;
    }
  });

  // Lưu khi pause/play
  bgMusic.addEventListener("play", function () {
    localStorage.setItem("musicPlaying", "true");
    updatePlayButton();
  });

  bgMusic.addEventListener("pause", function () {
    localStorage.setItem("musicPlaying", "false");
    updatePlayButton();
  });

  // Click ra ngoài thì tự ẩn panel
  document.addEventListener("click", function (e) {
    if (!musicPlayer.contains(e.target)) {
      musicPlayer.classList.remove("open");
    }
  });

  // Tránh click vào panel bị đóng
  musicPanel.addEventListener("click", function (e) {
    e.stopPropagation();
  });
});
