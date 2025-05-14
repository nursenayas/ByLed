document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    let currentSlide = 0;
    let slideInterval;
    const totalSlides = slides.length;
    
    // Slide'ı göster
    function showSlide(index) {
        // Aktif slide'ı kaldır
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Yeni slide'ı aktif yap
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Sonraki slide'a geç
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= totalSlides) next = 0;
        showSlide(next);
    }
    
    // Önceki slide'a geç
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) prev = totalSlides - 1;
        showSlide(prev);
    }
    
    // Otomatik geçiş
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 6000);
    }
    
    // Otomatik geçişi durdur
    function stopSlideInterval() {
        clearInterval(slideInterval);
    }
    
    // Buton olayları
    prevBtn.addEventListener('click', function() {
        prevSlide();
        stopSlideInterval();
        startSlideInterval();
    });
    
    nextBtn.addEventListener('click', function() {
        nextSlide();
        stopSlideInterval();
        startSlideInterval();
    });
    
    // Dot tıklama olayları
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopSlideInterval();
            startSlideInterval();
        });
    });
    
    // Dokunmatik ekran desteği
    let touchStartX = 0;
    let touchEndX = 0;
    const slider = document.getElementById('slider');
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopSlideInterval();
    }, false);
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        
        if (touchEndX < touchStartX - 50) {
            // Sola kaydırma - sonraki slide
            nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            // Sağa kaydırma - önceki slide
            prevSlide();
        }
        
        startSlideInterval();
    }, false);
    
    // Klavye navigasyonu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopSlideInterval();
            startSlideInterval();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopSlideInterval();
            startSlideInterval();
        }
    });
    
    // Otomatik geçişi başlat
    startSlideInterval();
});
