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

function renderReviews(containerId, reviewsArray) {
    const track = document.getElementById(containerId);
    if (!track) return;

    // Очищаем трек
    track.innerHTML = '';
    // Создаём карточки отзывов
    reviewsArray.forEach((rev, index) => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <div class="review-avatar">${rev.avatarLetter}</div>
                <div class="review-info">
                    <h4>${rev.name}</h4>
                    <div class="review-date">${rev.date}</div>
                </div>
            </div>
            <div class="review-text">${rev.text}</div>
        `;
        track.appendChild(card);
    });

    // Инициализация карусели после рендера
    initCarousel();
}

let currentIndex = 0;
let totalSlides = 0;
let slideWidth = 0;

function initCarousel() {
    const track = document.getElementById('reviews-track');
    if (!track) return;
    const cards = track.querySelectorAll('.review-card');
    totalSlides = cards.length;
    if (totalSlides === 0) return;

    // Определяем количество видимых карточек в зависимости от ширины экрана
    function getVisibleCards() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function updateCarousel() {
        const visible = getVisibleCards();
        const cardWidth = track.firstChild ? track.firstChild.offsetWidth : 0;
        const gap = 30; // из CSS gap
        slideWidth = cardWidth + gap;
        const maxIndex = Math.max(0, totalSlides - visible);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Обновить точки
        const dotsContainer = document.getElementById('reviewDots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            const dotsCount = Math.ceil(totalSlides / visible);
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === Math.floor(currentIndex / visible)) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i * visible;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        }
    }

    // При ресайзе пересчитываем
    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateCarousel();
    });

    // Кнопки
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    if (prevBtn) {
        prevBtn.onclick = () => {
            const visible = getVisibleCards();
            if (currentIndex > 0) {
                currentIndex -= visible;
                if (currentIndex < 0) currentIndex = 0;
                updateCarousel();
            }
        };
    }
    if (nextBtn) {
        nextBtn.onclick = () => {
            const visible = getVisibleCards();
            const maxIndex = Math.max(0, totalSlides - visible);
            if (currentIndex < maxIndex) {
                currentIndex += visible;
                if (currentIndex > maxIndex) currentIndex = maxIndex;
                updateCarousel();
            }
        };
    }

    updateCarousel();
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
        renderReviews('reviews-grid', tutoring.reviews);
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