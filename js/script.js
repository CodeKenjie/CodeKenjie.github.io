document.addEventListener(`DOMContentLoaded`, () => {
    const theme = localStorage.getItem(`theme`);
    const themeBtn = document.getElementById(`themeBtn`);

    if(theme){
        document.documentElement.setAttribute(`data-theme`, theme);
        theme === `dark` ? themeBtn.textContent = `Wake up!` : themeBtn.textContent = `Go to sleep`;
    }

    themeBtn.addEventListener(`click`, () => {
        const current = document.documentElement.getAttribute(`data-theme`);
        const newTheme = current === `dark` ? `light` : `dark`;

        document.documentElement.setAttribute(`data-theme`, newTheme);
        localStorage.setItem(`theme`, newTheme);
        newTheme === `dark` ? themeBtn.textContent = `Wake up!` : themeBtn.textContent = `Go to sleep`;
    });

    const previews = document.querySelectorAll(`.previews`);
    previews.forEach(prev => {
        const images = prev.querySelectorAll(`img`);
        let index = 0;

        function nextImage(){
            index = (index + 1) % images.length;

            prev.scrollTo({
                left: images[index].offsetLeft,
                behavior: `smooth`
            });
        }

        let interval = setInterval(nextImage, 5000);

        prev.addEventListener(`mouseenter`, () => {
            clearInterval(interval);
        });
        prev.addEventListener(`mouseleave`, () => {
            interval = setInterval(nextImage, 5000);
        });

        prev.addEventListener(`touchstart`, () => {
            clearInterval(interval);
        });
        prev.addEventListener(`touchend`, () => {
            interval = setInterval(nextImage, 5000);
        });
    });
});
