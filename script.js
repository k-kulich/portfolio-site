// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
async function loadJSON(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ошибка загрузки ${url}: ${response.status}`);
    return await response.json();
}

function renderEducation(containerId, educationArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = educationArray.map(item => `
        <div class="timeline-item">
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-sub">${item.subtitle}</div>
            <div>${item.description}</div>
        </div>
    `).join('');
}

function renderProjects(containerId, projectsArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = projectsArray.map(proj => `
        <div class="project-card">
            <div class="project-title">${proj.title} <span class="project-tech">${proj.tech}</span></div>
            <div class="project-desc">${proj.description}</div>
        </div>
    `).join('');
}

function renderSkills(skillsObject) {
    for (const [tabId, skillsArray] of Object.entries(skillsObject)) {
        const container = document.getElementById(tabId);
        if (container) {
            container.innerHTML = `<div class="skills-list">${skillsArray.map(s => `<span class="skill-badge">${s}</span>`).join('')}</div>`;
        }
    }
}

function renderSoftSkills(containerId, skillsArray) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = skillsArray.map(s => `<span class="skill-badge">${s}</span>`).join('');
    }
}

function renderContacts(containerId, contacts) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <div class="contact-card"><div class="contact-icon">📧</div><a href="mailto:${contacts.email}" class="contact-link">${contacts.email}</a></div>
        <div class="contact-card"><div class="contact-icon">📱</div><a href="tel:${contacts.phone}" class="contact-link">${contacts.phone}</a></div>
        <div class="contact-card"><div class="contact-icon">💬</div><a href="${contacts.telegram}" target="_blank" class="contact-link">Telegram</a></div>
        <div class="contact-card"><div class="contact-icon">🐙</div><a href="${contacts.github}" target="_blank" class="contact-link">GitHub</a></div>
    `;
}

function renderAdvantages(containerId, advantagesArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = advantagesArray.map(adv => `
        <div class="adv-card">
            <div class="adv-icon">${adv.icon}</div>
            <h3>${adv.title}</h3>
            <p>${adv.text}</p>
        </div>
    `).join('');
}

function renderReviews(swiperWrapperId, reviewsArray) {
    const wrapper = document.getElementById(swiperWrapperId);
    if (!wrapper) return;
    wrapper.innerHTML = reviewsArray.map(rev => `
        <div class="swiper-slide">
            <div class="review-card">
                <div class="review-header">
                    <div class="review-avatar">${rev.avatarLetter}</div>
                    <div class="review-info">
                        <h4>${rev.name}</h4>
                        <div class="review-date">${rev.date}</div>
                    </div>
                </div>
                <div class="review-text">${rev.text}</div>
            </div>
        </div>
    `).join('');
    
    // Инициализируем Swiper после того, как DOM обновился
    new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

// === ЗАГРУЗКА ДЛЯ СТРАНИЦЫ ПОРТФОЛИО (INDEX) ===
async function loadPortfolioPage() {
    try {
        const common = await loadJSON('data/common.json');
        const portfolio = await loadJSON('data/portfolio.json');
        
        // Образование
        renderEducation('education-timeline', portfolio.education);
        // Проекты
        renderProjects('projects-grid', portfolio.projects);
        // Навыки (табы)
        renderSkills(portfolio.skills);
        // Soft skills
        if (portfolio.softSkills) {
            renderSoftSkills('soft-skills-list', portfolio.softSkills);
        }
        // Контакты
        renderContacts('contacts-grid', common.contacts);
        
        // Опционально: обновить фото, если путь в common отличается
        const photo = document.getElementById('main-photo');
        if (photo && common.photo) photo.src = common.photo;
        
        // Можно также обновить tagline и описание из JSON
        if (portfolio.heroTagline) document.getElementById('hero-tagline').innerText = portfolio.heroTagline;
        if (portfolio.heroDesc) document.getElementById('hero-desc').innerText = portfolio.heroDesc;
    } catch (error) {
        console.error('Ошибка загрузки данных портфолио:', error);
    }
}

// === ЗАГРУЗКА ДЛЯ СТРАНИЦЫ РЕПЕТИТОРСТВА ===
async function loadTutoringPage() {
    try {
        const common = await loadJSON('data/common.json');
        const tutoring = await loadJSON('data/tutoring.json');
        
        // Преимущества
        renderAdvantages('advantages-grid', tutoring.advantages);
        // Отзывы
        renderReviews('reviews-swiper-wrapper', tutoring.reviews);
        // Контакты (можно использовать те же, что и в common)
        renderContacts('tutoring-contacts-grid', common.contacts);
        
        // Заголовок предметов
        if (tutoring.subjects) {
            const subjectsLine = tutoring.subjects.join(' · ');
            const heroSubjects = document.getElementById('hero-subjects');
            if (heroSubjects) heroSubjects.innerText = subjectsLine;
        }
        // Описание hero
        if (tutoring.heroDesc) {
            const heroDesc = document.getElementById('hero-tutoring-desc');
            if (heroDesc) heroDesc.innerText = tutoring.heroDesc;
        }
        // Фото
        const photo = document.getElementById('tutoring-photo');
        if (photo && common.photo) photo.src = common.photo;
    } catch (error) {
        console.error('Ошибка загрузки данных репетитора:', error);
    }
}

// === ОПРЕДЕЛЕНИЕ ТЕКУЩЕЙ СТРАНИЦЫ ===
const path = window.location.pathname;
if (path.includes('tutoring.html')) {
    loadTutoringPage();
} else {
    // index.html или корень
    loadPortfolioPage();
}

// === ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ И ТАБОВ ===
// Активный пункт меню
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (path.endsWith(href) || (path === '/' && href === 'index.html')) {
        link.classList.add('active');
    } else if (path.includes('tutoring.html') && href === 'tutoring.html') {
        link.classList.add('active');
    }
});

// Переключение табов навыков
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

// Плавная прокрутка для якорных ссылок
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