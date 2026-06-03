// Табы для навыков
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.skills-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        tabs.forEach(btn => btn.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active-content'));
        tab.classList.add('active');
        const activeContent = document.getElementById(targetId);
        if (activeContent) activeContent.classList.add('active-content');
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === "#" || href === "") return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Подсветка активного пункта меню
const currentLocation = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentLocation.endsWith(linkPath) || (currentLocation === '/' && linkPath === 'index.html')) {
        link.classList.add('active');
    } else if (currentLocation.endsWith('tutoring.html') && linkPath === 'tutoring.html') {
        link.classList.add('active');
    }
});