async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.json();
}

function fillList(container, list) {
    list.forEach(t => {
        const li = document.createElement(`li`);
        li.textContent = t;
        container.appendChild(li);
    });
}

function initCarousel(prev) {
    const images = prev.querySelectorAll('img');
    if (images.length < 2) return;
    let index = 0;

    function nextImage(){
        index = (index + 1) % images.length;

        prev.scrollTo({
            left: images[index].offsetLeft,
            behavior: `smooth`
        });
    }

    let interval = setInterval(nextImage, 5000);
    const stop = () => clearInterval(interval);
    const start = () => { interval = setInterval(nextImage, 5000) };

    prev.addEventListener(`mouseenter`, stop);
    prev.addEventListener(`mouseleave`, start);
    prev.addEventListener(`touchstart`, stop);
    prev.addEventListener(`touchend`, start);
}

function renderAcademicProjects(academicProjects) {
    const container = document.getElementById(`academic`);
    const tpl = document.getElementById(`academic-project-template`);
    let lastYear = null;

    academicProjects.forEach(project => {
        if (project.year !== lastYear) {
            const h = document.createElement("h1");
            h.className = 'normal-fs sub-header';
            h.textContent = project.year;
            container.appendChild(h);
            lastYear = project.year;
        }

        const node = tpl.content.cloneNode(true);

        const repo = node.querySelector('.repo-link');
        repo.href = project.repo;
        node.querySelector('.title').textContent = project.title;

        const source = node.querySelector('.source');
        source.textContent = project.button.label;
        if(project.button.link) {
            const a = document.createElement("a");
            a.className = 'live';
            a.href = project.button.link;
            a.target = '_blank';
            source.replaceWith(a);
            a.appendChild(source);
        }

        const previews = node.querySelector('.previews');
        project.images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${project.title} screenshot`;
            img.loading = 'lazy';
            previews.appendChild(img);
        });

        node.querySelector('.description').textContent = project.description;
        fillList(node.querySelector('.lang-used'), project.tech);

        container.appendChild(node);
        initCarousel(previews);
    });
}

function renderWorkExperience(workExperiece){
    const container = document.getElementById('experience');
    const tpl = document.getElementById('work-experience-template');

    workExperiece.forEach(experience => {
        const node = tpl.content.cloneNode(true);

        node.querySelector('.company').textContent = experience.company;
        node.querySelector('.from').textContent = experience.duration.from;
        node.querySelector('.to').textContent = experience.duration.to;
        node.querySelector('.company-address').textContent = experience.company_address;
        node.querySelector('.position').textContent = experience.position;
        fillList(node.querySelector('.tasks'), experience.tasks);

        container.appendChild(node);
    });
}

document.addEventListener(`DOMContentLoaded`, async () => {
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

    const tabs = document.querySelectorAll('.nav li');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    try {
        const [projects, experience ] = await Promise.all([
            loadJSON('data/academic_projects.json'),
            loadJSON('data/work_experience.json')
        ]);

        renderAcademicProjects(projects);
        renderWorkExperience(experience);
    } catch (err) {
        console.error(err);
    }
});
