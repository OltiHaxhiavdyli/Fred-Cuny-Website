let currentStory = 1;
const totalStories = 3;

function showStory(storyIndex, scroll = true) {
    if (storyIndex < 1) storyIndex = 1;
    if (storyIndex > totalStories) storyIndex = totalStories;

    currentStory = storyIndex;

    const stories = document.querySelectorAll('.story-content');
    stories.forEach(story => {
        story.classList.remove('active');
    });

    const targetStory = document.getElementById(`story-${currentStory}`);
    if (targetStory) {
        targetStory.classList.add('active');
    }

    const allPaginationWidgets = document.querySelectorAll('.pagination-widget');

    allPaginationWidgets.forEach(widget => {
        const buttons = widget.querySelectorAll('.page-num');
        const prevBtn = widget.querySelector('.prev-btn');
        const nextBtn = widget.querySelector('.next-btn');

        buttons.forEach((btn, index) => {
            const btnNum = index + 1;
            btn.classList.toggle('active', btnNum === currentStory);
        });

        prevBtn.disabled = (currentStory === 1);
        nextBtn.disabled = (currentStory === totalStories);

        prevBtn.style.opacity = (currentStory === 1) ? "0.5" : "1";
        nextBtn.style.opacity = (currentStory === totalStories) ? "0.5" : "1";
    });

    if (scroll) {
        const storiesSection = document.querySelector('.stories-section');
        if (storiesSection) {
            storiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function changeStory(direction) {
    showStory(currentStory + direction, true);
}

function jumpToStory(index) {
    showStory(index, true);
}

document.addEventListener('DOMContentLoaded', () => {
    showStory(1, false);
});