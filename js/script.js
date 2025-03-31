// Hamburger Menu

// Create indicators
slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.dataset.index = index;
    if (index === 0) indicator.classList.add('active');
    indicators.appendChild(indicator);
});

// Update indicators
function updateIndicators() {
    indicators.querySelectorAll('div').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Next slide
function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    updateIndicators();
}

// Previous slide
function prevSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    updateIndicators();
}

// Event listeners
document.querySelector('.next').addEventListener('click', nextSlide);
document.querySelector('.prev').addEventListener('click', prevSlide);
indicators.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    if (index !== currentSlide) {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        updateIndicators();
    }
});

// Auto-advance slides every 5 seconds
setInterval(nextSlide, 5000);



const menuItems = document.querySelectorAll('.nav-menu ul li');
        menuItems.forEach(item => {
            item.addEventListener('mouseover', () => {
                item.style.transform = 'translateY(-5px)';
                item.style.transition = 'transform 0.3s ease';
            });
            item.addEventListener('mouseout', () => {
                item.style.transform = 'translateY(0)';
            });
        });


// Scroll ile animasyon tetikleme
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});



// Footer animasyonları için
const footerObserverOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, footerObserverOptions);

document.querySelectorAll('.footer-section').forEach(section => {
    footerObserver.observe(section);
});

// Sosyal medya ikonlarına hover animasyonu ekleyelim
document.querySelectorAll('.social-media a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'scale(1.1)';
    });
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'scale(1)';
    });
});


$(document).ready(function(){


$('.carousel-showmanymoveone .item').each(function(){
var itemToClone = $(this);

for (var i=1;i<6;i++) {
itemToClone = itemToClone.next();

if (!itemToClone.length) {
itemToClone = $(this).siblings(':first');
}

itemToClone.children(':first-child').clone()
.addClass("cloneditem-"+(i))
.appendTo($(this));
}
});
});



$('.buy').click(function(){
    $('.bottom').addClass("clicked");
  });
  
  $('.remove').click(function(){
    $('.bottom').removeClass("clicked");
  });





