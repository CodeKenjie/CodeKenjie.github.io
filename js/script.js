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

    const canvas = document.getElementById(`bg`);
    const ctx = canvas.getContext(`2d`);

    function resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener(`resize`, resize);

    const particle = [];
    const COUNT = Math.floor(window.innerWidth / 30);
    for(let i = 0; i < COUNT; i++){
        particle.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: 2
        });
    }

    function update(){
        for(const p of particle){
            p.x += p.vx * 0.5;
            p.y += p.vy * 0.5;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
    }

    function draw(){
        ctx.fillStyle = `var(--particle)`;
        for(const p of particle){
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function lines(){
        const maxDistance = 120;
        for(let i = 0; i < particle.length; i++){
            for(let j = i + 1; j < particle.length; j++){
                const a = particle[i];
                const b = particle[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if(distance < maxDistance){
                    ctx.strokeStyle = `rgba(0, 0, 0, ${ 1 - distance / maxDistance })`;

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        update();
        lines();
        draw();

        requestAnimationFrame(animate);
    }

    animate();
});
