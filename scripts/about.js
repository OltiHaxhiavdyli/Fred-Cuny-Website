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
    
    animateTimeline();
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.getElementById('timelineLine');
    const timeline = document.querySelector('.timeline');
    
    if (!timeline) return;
    
    timelineItems.forEach((item) => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (itemTop < windowHeight * 0.85) {
            item.classList.add('animate');
        }
    });
    
    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top;
    const timelineHeight = timelineRect.height;
    const windowHeight = window.innerHeight;
    
    let scrollProgress = 0;
    
    if (timelineTop < windowHeight && timelineTop + timelineHeight > 0) {
        const visibleTop = Math.max(0, windowHeight - timelineTop);
        const visibleHeight = Math.min(timelineHeight, visibleTop);
        scrollProgress = (visibleHeight / timelineHeight) * 100;
        scrollProgress = Math.min(100, Math.max(0, scrollProgress));
    }
    
    if (timelineLine) {
        timelineLine.style.setProperty('--timeline-progress', scrollProgress + '%');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    animateTimeline();
    
    setTimeout(() => {
        animateTimeline();
    }, 100);
});

window.addEventListener('resize', animateTimeline);