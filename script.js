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
