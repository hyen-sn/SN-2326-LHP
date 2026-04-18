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

  // Nhân đôi toàn bộ ảnh để tạo hiệu ứng chạy vòng lặp
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

  // Hàm chạy tự động
  function startAutoRun() {
    stopAutoRun();

    autoRun = setInterval(() => {
      if (!isDragging) {
        track.scrollLeft += 1;

        // Khi chạy hết bộ ảnh gốc thì quay lại đầu
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
    }, 20);
  }

  // Hàm dừng tự động
  function stopAutoRun() {
    clearInterval(autoRun);
  }

  // Rê chuột vào vùng slider thì dừng
  slider.addEventListener('mouseenter', stopAutoRun);

  // Rê chuột ra thì chạy tiếp
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

  // Chạy ngay khi tải trang
  startAutoRun();
});
