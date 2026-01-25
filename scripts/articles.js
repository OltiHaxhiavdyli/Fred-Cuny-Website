class ArticleCarousel {
    constructor(carouselId) {
        this.carouselId = carouselId;
        this.track = document.querySelector(`.carousel-track[data-carousel="${carouselId}"]`);
        this.slides = Array.from(this.track.children);
        this.prevButton = document.querySelector(`.carousel-nav.prev[data-carousel="${carouselId}"]`);
        this.nextButton = document.querySelector(`.carousel-nav.next[data-carousel="${carouselId}"]`);
        this.dotsContainer = document.querySelector(`.carousel-dots[data-carousel="${carouselId}"]`);
        
        this.currentIndex = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.totalSlides = this.slides.length;
        this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        
        this.wheelDebounceTimer = null;
        
        this.init();
    }
    
    getSlidesPerView() {
        if (window.innerWidth >= 1200) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    init() {
        this.createDots();
        
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());
        
        window.addEventListener('resize', () => this.handleResize());
        
        this.updateButtons();
        this.updateDots();
        
        this.addTouchSupport();
        this.addTrackpadSupport();  
    }
    
    createDots() {
        const dotsNeeded = Math.ceil(this.totalSlides / this.slidesPerView);
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < dotsNeeded; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
        
        this.dots = Array.from(this.dotsContainer.children);
    }
    
    updateCarousel() {
        const slideWidth = this.slides[0].offsetWidth;
        const gap = 30;
        const moveDistance = -(this.currentIndex * (slideWidth + gap));
        
        this.track.style.transform = `translateX(${moveDistance}px)`;
        this.updateButtons();
        this.updateDots();
    }
    
    updateButtons() {
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.disabled = this.currentIndex >= this.maxIndex;
    }
    
    updateDots() {
        const activeDotIndex = Math.floor(this.currentIndex / this.slidesPerView);
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    goToSlide(dotIndex) {
        this.currentIndex = dotIndex * this.slidesPerView;
        if (this.currentIndex > this.maxIndex) {
            this.currentIndex = this.maxIndex;
        }
        this.updateCarousel();
    }
    
    handleResize() {
        const newSlidesPerView = this.getSlidesPerView();
        
        if (newSlidesPerView !== this.slidesPerView) {
            this.slidesPerView = newSlidesPerView;
            this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
            
            if (this.currentIndex > this.maxIndex) {
                this.currentIndex = this.maxIndex;
            }
            
            this.createDots();
            this.updateCarousel();
        }
    }

    addTrackpadSupport() {
        this.track.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();

                if (!this.wheelDebounceTimer) {
                    if (e.deltaX > 20) {
                        this.nextSlide();
                        this.wheelDebounceTimer = setTimeout(() => {
                            this.wheelDebounceTimer = null;
                        }, 500);
                    } else if (e.deltaX < -20) {
                        this.prevSlide();
                        this.wheelDebounceTimer = setTimeout(() => {
                            this.wheelDebounceTimer = null;
                        }, 500);
                    }
                }
            }
        }, { passive: false });
    }
    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
        
        let mouseStartX = 0;
        let mouseCurrentX = 0;
        let isMouseDragging = false;
        
        this.track.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            this.track.style.cursor = 'grabbing';
        });
        
        this.track.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            mouseCurrentX = e.clientX;
        });
        
        this.track.addEventListener('mouseup', () => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
            this.track.style.cursor = 'grab';
            
            const diff = mouseStartX - mouseCurrentX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
        
        this.track.addEventListener('mouseleave', () => {
            if (isMouseDragging) {
                isMouseDragging = false;
                this.track.style.cursor = 'grab';
            }
        });
        
        this.track.style.cursor = 'grab';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const aboutCarousel = new ArticleCarousel('about');
    const byCarousel = new ArticleCarousel('by');
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            aboutCarousel.prevSlide();
            byCarousel.prevSlide();
        } else if (e.key === 'ArrowRight') {
            aboutCarousel.nextSlide();
            byCarousel.nextSlide();
        }
    });

    const modal = document.getElementById('imageModal');
    const triggerImg = document.getElementById('milosevic-trigger');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');

    if (triggerImg) {
        triggerImg.addEventListener('click', function() {
            modal.style.display = "block";
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            modalImg.src = this.src;
        });
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });
});