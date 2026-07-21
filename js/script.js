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
});
