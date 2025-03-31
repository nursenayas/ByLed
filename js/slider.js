// Slider item'ları
const sliderItems = document.querySelectorAll('.slider__images-item');

// Her слайд değiştiğinde videoyu sıfırla
sliderItems.forEach(item => {
  item.addEventListener('slideractive', function() {
    const video = this.querySelector('video');
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  });
});

/*
  More about this function - 
  https://codepen.io/rachsmith/post/animation-tip-lerp
*/
function lerp({ x, y }, { x: targetX, y: targetY }) {
  const fraction = 0.1;

  x += (targetX - x) * fraction;
  y += (targetY - y) * fraction;

  return { x, y };
}

class Slider {
  constructor(el) {
    const imgClass = this.IMG_CLASS = 'slider__images-item';
    const textClass = this.TEXT_CLASS = 'slider__text-item';
    const activeImgClass = this.ACTIVE_IMG_CLASS = `${imgClass}--active`;
    const activeTextClass = this.ACTIVE_TEXT_CLASS = `${textClass}--active`;

    this.el = el;
    this.contentEl = document.getElementById('slider-content');
    this.onMouseMove = this.onMouseMove.bind(this);

    // taking advantage of the live nature of 'getElement...' methods
    this.activeImg = el.getElementsByClassName(activeImgClass);
    this.activeText = el.getElementsByClassName(activeTextClass);
    this.images = el.getElementsByTagName('img');

    document.getElementById('slider-dots')
      .addEventListener('click', this.onDotClick.bind(this));

    document.getElementById('left')
      .addEventListener('click', this.prev.bind(this));

    document.getElementById('right')
      .addEventListener('click', this.next.bind(this));

    // Dokunmatik ekran desteği ekle
    this.setupTouchEvents();

    window.addEventListener('resize', this.onResize.bind(this));

    this.onResize();

    this.length = this.images.length;
    this.lastX = this.lastY = this.targetX = this.targetY = 0;
    
    // İlk yüklemede aktif dot'u ayarla
    this.updateActiveDot();
  }

  // Aktif dot'u güncelle
  updateActiveDot() {
    const activeId = this.activeImg[0]?.dataset.id || '1';
    const dots = document.querySelectorAll('.slider__nav-dot');
    
    dots.forEach(dot => {
      dot.classList.remove('slider__nav-dot--active');
      if (dot.dataset.id === activeId) {
        dot.classList.add('slider__nav-dot--active');
      }
    });
  }

  // Dokunmatik ekran için kaydırma olaylarını ekle
  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.el.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    this.el.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      
      // Kaydırma yönünü belirle
      if (touchEndX < touchStartX - 50) {
        // Sola kaydırma - sonraki slide
        this.next();
      } else if (touchEndX > touchStartX + 50) {
        // Sağa kaydırma - önceki slide
        this.prev();
      }
    }, false);
  }

  onResize() {
    const htmlStyles = getComputedStyle(document.documentElement);
    const mobileBreakpoint = htmlStyles.getPropertyValue('--mobile-bkp');

    const isMobile = this.isMobile = matchMedia(
      `only screen and (max-width: ${mobileBreakpoint})`
    ).matches;

    this.halfWidth = innerWidth / 2;
    this.halfHeight = innerHeight / 2;
    this.zDistance = htmlStyles.getPropertyValue('--z-distance');

    if (!isMobile && !this.mouseWatched) {
      this.mouseWatched = true;
      this.el.addEventListener('mousemove', this.onMouseMove);
      
      // İlk slide için arkaplan resmini ayarla
      if (this.activeImg[0]) {
        this.el.style.setProperty(
          '--img-prev',
          `url(${this.images[+this.activeImg[0].dataset.id - 1].src})`
        );
      }

      this.contentEl.style.setProperty('transform', `translateZ(${this.zDistance})`);
    } else if (isMobile && this.mouseWatched) {
      this.mouseWatched = false;
      this.el.removeEventListener('mousemove', this.onMouseMove);
      this.contentEl.style.setProperty('transform', 'none');
      
      // Mobil cihazlar için metin ve görüntü stillerini düzelt
      this.setupMobileStyles();
    }
    
    // Mobil cihazlar için her zaman stilleri düzelt
    if (isMobile) {
      this.setupMobileStyles();
    }
    
    // Dot'ları güncelle
    this.updateActiveDot();
  }
  
  // Mobil cihazlar için özel stiller
  setupMobileStyles() {
    // Metin öğelerini düzelt
    document.querySelectorAll(`.${this.TEXT_CLASS}`).forEach(item => {
      item.style.transform = 'none';
      item.style.opacity = item.classList.contains(this.ACTIVE_TEXT_CLASS) ? '1' : '0';
      item.style.visibility = item.classList.contains(this.ACTIVE_TEXT_CLASS) ? 'visible' : 'hidden';
    });
    
    // Görüntü öğelerini düzelt
    document.querySelectorAll(`.${this.IMG_CLASS}`).forEach(item => {
      const img = item.querySelector('img');
      if (img) {
        img.style.transform = 'none';
      }
    });
    
    // Navigasyon oklarını görünür yap
    document.querySelectorAll('.slider__nav-arrow').forEach(arrow => {
      arrow.style.opacity = '1';
      arrow.style.visibility = 'visible';
    });
  }

  getMouseCoefficients({ pageX, pageY } = {}) {
    const halfWidth = this.halfWidth;
    const halfHeight = this.halfHeight;
    const xCoeff = ((pageX || this.targetX) - halfWidth) / halfWidth;
    const yCoeff = (halfHeight - (pageY || this.targetY)) / halfHeight;

    return { xCoeff, yCoeff };
  }

  onMouseMove({ pageX, pageY }) {
    this.targetX = pageX;
    this.targetY = pageY;

    if (!this.animationRunning) {
      this.animationRunning = true;
      this.runAnimation();
    }
  }

  runAnimation() {
    if (this.animationStopped) {
      this.animationRunning = false;
      return;
    }

    const maxX = 10;
    const maxY = 10;

    const newPos = lerp(
      { x: this.lastX, y: this.lastY },
      { x: this.targetX, y: this.targetY }
    );

    const { xCoeff, yCoeff } = this.getMouseCoefficients({
      pageX: newPos.x,
      pageY: newPos.y
    });

    this.lastX = newPos.x;
    this.lastY = newPos.y;

    this.positionImage({ xCoeff, yCoeff });

    this.contentEl.style.setProperty('transform', `
      translateZ(${this.zDistance})
      rotateX(${maxY * yCoeff}deg)
      rotateY(${maxX * xCoeff}deg)
    `);

    if (this.reachedFinalPoint) {
      this.animationRunning = false;
    } else {
      requestAnimationFrame(this.runAnimation.bind(this));
    }
  }

  get reachedFinalPoint() {
    const lastX = ~~this.lastX;
    const lastY = ~~this.lastY;
    const targetX = this.targetX;
    const targetY = this.targetY;

    return (lastX == targetX || lastX - 1 == targetX || lastX + 1 == targetX) &&
           (lastY == targetY || lastY - 1 == targetY || lastY + 1 == targetY);
  }

  positionImage({ xCoeff, yCoeff }) {
    const maxImgOffset = 1;
    const currentImage = this.activeImg[0]?.children[0];

    if (currentImage && !this.isMobile) {
      currentImage.style.setProperty('transform', `
        translateX(${maxImgOffset * -xCoeff}em)
        translateY(${maxImgOffset * yCoeff}em)
      `);
    }
  }

  onDotClick({ target }) {
    if (this.inTransit) return;

    const dot = target.closest('.slider__nav-dot');

    if (!dot) return;

    const nextId = dot.dataset.id;
    const currentId = this.activeImg[0]?.dataset.id;

    if (currentId == nextId) return;

    this.startTransition(nextId);
  }

  transitionItem(nextId) {
    function onImageTransitionEnd(e) {
      e.stopPropagation();

      nextImg.classList.remove(transitClass);

      self.inTransit = false;

      this.className = imgClass;
      this.removeEventListener('transitionend', onImageTransitionEnd);
      
      // Mobil cihazlar için stilleri yeniden ayarla
      if (self.isMobile) {
        self.setupMobileStyles();
      }
      
      // Video varsa oynat
      const video = nextImg.querySelector('video');
      if (video) {
        video.currentTime = 0;
        video.play();
      }
      
      // Aktif dot'u güncelle
      self.updateActiveDot();
    }

    const self = this;
    const el = this.el;
    const currentImg = this.activeImg[0];
    const currentId = currentImg?.dataset.id;
    const imgClass = this.IMG_CLASS;
    const textClass = this.TEXT_CLASS;
    const activeImgClass = this.ACTIVE_IMG_CLASS;
    const activeTextClass = this.ACTIVE_TEXT_CLASS;
    const subActiveClass = `${imgClass}--subactive`;
    const transitClass = `${imgClass}--transit`;
    const nextImg = el.querySelector(`.${imgClass}[data-id='${nextId}']`);
    const nextText = el.querySelector(`.${textClass}[data-id='${nextId}']`);

    let outClass = '';
    let inClass = '';

    this.animationStopped = true;

    // Aktif metin sınıfını değiştir
    const currentText = this.activeText[0];
    if (currentText) {
      currentText.classList.remove(activeTextClass);
    }
    nextText.classList.add(activeTextClass);

    el.style.setProperty('--from-left', nextId);

    if (currentImg) {
      currentImg.classList.remove(activeImgClass);
      currentImg.classList.add(subActiveClass);

      if (currentId < nextId) {
        outClass = `${imgClass}--next`;
        inClass = `${imgClass}--prev`;
      } else {
        outClass = `${imgClass}--prev`;
        inClass = `${imgClass}--next`;
      }

      nextImg.classList.add(outClass);

      requestAnimationFrame(() => {
        nextImg.classList.add(transitClass, activeImgClass);
        nextImg.classList.remove(outClass);

        this.animationStopped = false;
        
        if (!this.isMobile) {
          this.positionImage(this.getMouseCoefficients());
        }

        currentImg.classList.add(transitClass, inClass);
        currentImg.addEventListener('transitionend', onImageTransitionEnd);
      });

      if (!this.isMobile) {
        this.switchBackgroundImage(nextId);
      }
    } else {
      // İlk yükleme veya hata durumu
      nextImg.classList.add(activeImgClass);
      this.animationStopped = false;
      this.inTransit = false;
      
      // Mobil cihazlar için stilleri yeniden ayarla
      if (this.isMobile) {
        this.setupMobileStyles();
      }
      
      // Aktif dot'u güncelle
      this.updateActiveDot();
    }
  }

  startTransition(nextId) {
    function onTextTransitionEnd(e) {
      if (!e.pseudoElement) {
        e.stopPropagation();

        requestAnimationFrame(() => {
          self.transitionItem(nextId);
        });

        this.removeEventListener('transitionend', onTextTransitionEnd);
      }
    }

    if (this.inTransit) return;

    const activeText = this.activeText[0];
    const backwardsClass = `${this.TEXT_CLASS}--backwards`;
    const self = this;

    this.inTransit = true;

    if (this.isMobile) {
      // Mobil cihazlarda metin geçişini basitleştir
      if (activeText) {
        activeText.classList.remove(this.ACTIVE_TEXT_CLASS);
      }
      this.transitionItem(nextId);
    } else {
      // Masaüstü geçiş animasyonu
      if (activeText) {
        activeText.classList.add(backwardsClass);
        activeText.classList.remove(this.ACTIVE_TEXT_CLASS);
        activeText.addEventListener('transitionend', onTextTransitionEnd);

        requestAnimationFrame(() => {
          activeText.classList.remove(backwardsClass);
        });
      } else {
        this.transitionItem(nextId);
      }
    }
  }

  next() {
    if (this.inTransit) return;

    let nextId = +this.activeImg[0]?.dataset.id + 1 || 1;

    if (nextId > this.length)
      nextId = 1;

    this.startTransition(nextId);
  }

  prev() {
    if (this.inTransit) return;

    let nextId = +this.activeImg[0]?.dataset.id - 1 || this.length;

    if (nextId < 1)
      nextId = this.length;

    this.startTransition(nextId);
  }

  switchBackgroundImage(nextId) {
    function onBackgroundTransitionEnd(e) {
      if (e.target === this) {
        this.style.setProperty('--img-prev', imageUrl);
        this.classList.remove(bgClass);
        this.removeEventListener('transitionend', onBackgroundTransitionEnd);
      }
    }

    const bgClass = 'slider--bg-next';
    const el = this.el;
    const imageUrl = `url(${this.images[+nextId - 1]?.src || ''})`;

    el.style.setProperty('--img-next', imageUrl);
    el.addEventListener('transitionend', onBackgroundTransitionEnd);
    el.classList.add(bgClass);
  }
}

const sliderEl = document.getElementById('slider');
const slider = new Slider(sliderEl);

// ------------------ Demo stuff ------------------------ //

let timer = 0;

function autoSlide() {
  requestAnimationFrame(() => {
    slider.next();
  });

  timer = setTimeout(autoSlide, 5000);
}

function stopAutoSlide() {
  clearTimeout(timer);

  this.removeEventListener('touchstart', stopAutoSlide);
  this.removeEventListener('mousemove', stopAutoSlide);
}

sliderEl.addEventListener('mousemove', stopAutoSlide);
sliderEl.addEventListener('touchstart', stopAutoSlide);

timer = setTimeout(autoSlide, 2000);