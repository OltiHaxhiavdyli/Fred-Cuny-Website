// Scroll to top button with progress ring
const scrollTopBtn = document.getElementById("scrollTopBtn");
const circle = document.querySelector('.progress-ring__circle');

const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
}

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    
    if (scrollTop > 300) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }

    const docHeight = document.body.scrollHeight - window.innerHeight;
    
    if (docHeight > 0) {
        const scrollPercent = (scrollTop / docHeight) * 100;
        setProgress(scrollPercent);
    }
    
    // Animate center cards on scroll
    animateCenterCards();
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Animate center cards on scroll
function animateCenterCards() {
    const centerCards = document.querySelectorAll('.center-card');
    const windowHeight = window.innerHeight;
    
    centerCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        
        if (cardTop < windowHeight * 0.85) {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 150); // Stagger animation
        }
    });
}

// Initial check on page load
document.addEventListener('DOMContentLoaded', () => {
    animateCenterCards();
    
    // Add a slight delay then animate again to ensure everything is loaded
    setTimeout(() => {
        animateCenterCards();
    }, 100);
});

// Also animate on resize
window.addEventListener('resize', animateCenterCards);
