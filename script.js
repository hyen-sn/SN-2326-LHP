const sliders = document.querySelectorAll('.slider-wrapper');

sliders.forEach((slider) => {
  const track = slider.querySelector('.photo-track');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');

  if (!track || !prevBtn || !nextBtn) return;

  let autoRun;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  let touchStartX = 0;
  let touchScrollLeft = 0;

  // Nhân đôi toàn bộ ảnh để tạo vòng lặp liên tục
  track.innerHTML += track.innerHTML;

  // Nút bấm trái
  prevBtn.addEventListener('click', () => {
    track.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  });

  // Nút bấm phải
  nextBtn.addEventListener('click', () => {
    track.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  });

  // Tự chạy liên tục
  function startAutoRun() {
    stopAutoRun();

    autoRun = setInterval(() => {
      if (!isDragging) {
        track.scrollLeft += 0.5;

        // Khi chạy hết nửa đầu (bộ ảnh gốc), quay lại đầu
        // Vì đã nhân đôi nên mắt thường sẽ thấy chạy liên tục, không bị đứt
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
    }, 20);
  }

  function stopAutoRun() {
    clearInterval(autoRun);
  }

  // Hover vào thì dừng
  slider.addEventListener('mouseenter', stopAutoRun);

  // Rời chuột ra thì chạy tiếp
  slider.addEventListener('mouseleave', () => {
    if (!isDragging) {
      startAutoRun();
    }
  });

  // Kéo bằng chuột
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    stopAutoRun();
    track.classList.add('dragging');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  track.addEventListener('mouseup', () => {
    isDragging = false;
    track.classList.remove('dragging');
    startAutoRun();
  });

  track.addEventListener('mouseleave', () => {
    isDragging = false;
    track.classList.remove('dragging');
  });

  // Vuốt trên điện thoại
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = track.scrollLeft;
    stopAutoRun();
  });

  track.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].pageX;
    const walk = (touchX - touchStartX) * 1.2;
    track.scrollLeft = touchScrollLeft - walk;
  });

  track.addEventListener('touchend', () => {
    startAutoRun();
  });

  // Chạy ngay khi mở trang
  startAutoRun();
});




/*   phát nhạc    */
const musicToggle = document.getElementById("musicToggle");
const musicPanel = document.getElementById("musicPanel");
const bgMusic = document.getElementById("bgMusic");
const playPauseBtn = document.getElementById("playPauseBtn");
const musicSeek = document.getElementById("musicSeek");
const closeMusicPanel = document.getElementById("closeMusicPanel");

if (musicToggle && musicPanel && bgMusic && playPauseBtn && musicSeek && closeMusicPanel) {
  let isPlaying = false;

  // Mở / đóng khung nhạc
  musicToggle.addEventListener("click", () => {
    musicPanel.classList.toggle("show");
  });

  // Nút đóng khung nhạc
  closeMusicPanel.addEventListener("click", () => {
    musicPanel.classList.remove("show");
  });

  // Phát / tạm dừng nhạc
  playPauseBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
      playPauseBtn.textContent = "⏸";
      isPlaying = true;
      localStorage.setItem("musicPlaying", "true");
    } else {
      bgMusic.pause();
      playPauseBtn.textContent = "▶";
      isPlaying = false;
      localStorage.setItem("musicPlaying", "false");
    }
  });

  // Cập nhật thanh tua theo thời gian phát
  bgMusic.addEventListener("timeupdate", () => {
    if (bgMusic.duration) {
      const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
      musicSeek.value = progress;
    }
  });

  // Kéo thanh tua để tua nhạc
  musicSeek.addEventListener("input", () => {
    if (bgMusic.duration) {
      bgMusic.currentTime = (musicSeek.value / 100) * bgMusic.duration;
    }
  });

  // Ghi nhớ vị trí nhạc
  bgMusic.addEventListener("timeupdate", () => {
    localStorage.setItem("musicTime", bgMusic.currentTime);
  });

  // Khôi phục trạng thái khi tải lại trang
  window.addEventListener("load", () => {
    const savedTime = localStorage.getItem("musicTime");
    const savedPlaying = localStorage.getItem("musicPlaying");

    if (savedTime) {
      bgMusic.currentTime = parseFloat(savedTime);
    }

    if (savedPlaying === "true") {
      playPauseBtn.textContent = "⏸";
    } else {
      playPauseBtn.textContent = "▶";
    }
  });

  // Khi người dùng bấm nút phát thì mới được phát nhạc
  bgMusic.addEventListener("play", () => {
    playPauseBtn.textContent = "⏸";
    localStorage.setItem("musicPlaying", "true");
  });

  bgMusic.addEventListener("pause", () => {
    playPauseBtn.textContent = "▶";
    localStorage.setItem("musicPlaying", "false");
  });
}

const musicToggle = document.getElementById("musicToggle");
const musicPanel = document.getElementById("musicPanel");
const bgMusic = document.getElementById("bgMusic");
const playPauseBtn = document.getElementById("playPauseBtn");
const musicSeek = document.getElementById("musicSeek");
const closeMusicPanel = document.getElementById("closeMusicPanel");

if (musicToggle && musicPanel && bgMusic && playPauseBtn && musicSeek && closeMusicPanel) {
  // Mở / đóng khung nhạc
  musicToggle.addEventListener("click", () => {
    musicPanel.classList.toggle("show");
  });

  // Nút đóng khung nhạc
  closeMusicPanel.addEventListener("click", () => {
    musicPanel.classList.remove("show");
  });

  // Phát / tạm dừng
  playPauseBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
      playPauseBtn.textContent = "⏸";
      localStorage.setItem("musicPlaying", "true");
    } else {
      bgMusic.pause();
      playPauseBtn.textContent = "▶";
      localStorage.setItem("musicPlaying", "false");
    }
  });

  // Cập nhật thanh tua
  bgMusic.addEventListener("timeupdate", () => {
    if (bgMusic.duration) {
      const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
      musicSeek.value = progress;
      localStorage.setItem("musicTime", bgMusic.currentTime);
    }
  });

  // Tua nhạc
  musicSeek.addEventListener("input", () => {
    if (bgMusic.duration) {
      bgMusic.currentTime = (musicSeek.value / 100) * bgMusic.duration;
    }
  });

  // Khôi phục thời gian
  window.addEventListener("load", () => {
    const savedTime = localStorage.getItem("musicTime");
    const savedPlaying = localStorage.getItem("musicPlaying");

    if (savedTime) {
      bgMusic.currentTime = parseFloat(savedTime);
    }

    if (savedPlaying === "true") {
      playPauseBtn.textContent = "⏸";
    } else {
      playPauseBtn.textContent = "▶";
    }
  });

  bgMusic.addEventListener("play", () => {
    playPauseBtn.textContent = "⏸";
    localStorage.setItem("musicPlaying", "true");
  });

  bgMusic.addEventListener("pause", () => {
    playPauseBtn.textContent = "▶";
    localStorage.setItem("musicPlaying", "false");
  });
}



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

    if (savedPlaying === "true") {
      playPauseBtn.textContent = "▶";
    }
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
