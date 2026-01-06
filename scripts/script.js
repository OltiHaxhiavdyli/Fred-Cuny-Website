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
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});