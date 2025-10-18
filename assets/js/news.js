// News rendering JavaScript
(function() {
    'use strict';

    // Fetch and render news
    async function loadNews() {
        try {
            const response = await fetch('assets/data/news.json');
            const newsData = await response.json();

            // Sort by date (newest first)
            newsData.sort((a, b) => new Date(b.date) - new Date(a.date));

            return newsData;
        } catch (error) {
            console.error('Error loading news:', error);
            return [];
        }
    }

    // Format date to readable string
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Get article link (use dynamic page if markdown exists, otherwise use static link)
    function getArticleLink(newsItem) {
        if (newsItem.markdown) {
            return `news-article.html?id=${newsItem.id}`;
        }
        return newsItem.link;
    }

    // Render news card for home page
    function renderNewsCardHome(newsItem) {
        const tagsHTML = newsItem.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        const articleLink = getArticleLink(newsItem);

        return `
            <article class="news-post">
                <div class="news-image">
                    <img src="${newsItem.image}" alt="${newsItem.title}">
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span>By <strong>${newsItem.author}</strong></span>
                        <span>${formatDate(newsItem.date)}</span>
                    </div>
                    <h3><a href="${articleLink}">${newsItem.title}</a></h3>
                    <p>${newsItem.excerpt}</p>
                    <div class="news-tags">
                        ${tagsHTML}
                    </div>
                    <a href="${articleLink}" class="read-more">Read more →</a>
                </div>
            </article>
        `;
    }

    // Render news card for news page
    function renderNewsCardArchive(newsItem) {
        const tagsHTML = newsItem.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        const articleLink = getArticleLink(newsItem);

        return `
            <article class="news-post-card">
                <div class="news-image">
                    <img src="${newsItem.image}" alt="${newsItem.title}">
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span class="news-date">${formatDate(newsItem.date)}</span>
                        <span class="news-author">By <strong>${newsItem.author}</strong></span>
                    </div>
                    <h3><a href="${articleLink}">${newsItem.title}</a></h3>
                    <p>${newsItem.excerpt}</p>
                    <div class="news-tags">
                        ${tagsHTML}
                    </div>
                    <a href="${articleLink}" class="read-more">Read more →</a>
                </div>
            </article>
        `;
    }

    // Render news on home page (latest 3)
    async function renderHomePageNews() {
        const newsGrid = document.getElementById('home-news-grid');
        if (!newsGrid) return;

        const newsData = await loadNews();
        const latestNews = newsData.slice(0, 3);

        newsGrid.innerHTML = latestNews.map(renderNewsCardHome).join('');
    }

    // Render news on news archive page (grouped by year)
    async function renderNewsArchive() {
        const newsArchive = document.getElementById('news-archive-content');
        if (!newsArchive) return;

        const newsData = await loadNews();

        // Group by year
        const newsByYear = {};
        newsData.forEach(item => {
            const year = new Date(item.date).getFullYear();
            if (!newsByYear[year]) {
                newsByYear[year] = [];
            }
            newsByYear[year].push(item);
        });

        // Get sorted years (newest first)
        const years = Object.keys(newsByYear).sort((a, b) => b - a);

        // Create year navigation with "All" button as default
        const yearNav = document.getElementById('year-navigation');
        if (yearNav) {
            const allButton = `<a href="#all" class="year-link active" data-year="all">All</a>`;
            const yearButtons = years.map(year =>
                `<a href="#${year}" class="year-link" data-year="${year}">${year}</a>`
            ).join('');
            yearNav.innerHTML = allButton + yearButtons;
        }

        // Render news sections by year (all visible by default)
        let html = '';
        years.forEach(year => {
            const newsHTML = newsByYear[year].map(renderNewsCardArchive).join('');
            html += `
                <div class="year-section" id="${year}" data-year="${year}">
                    <h3 class="year-title">${year}</h3>
                    <div class="news-grid">
                        ${newsHTML}
                    </div>
                </div>
            `;
        });

        newsArchive.innerHTML = html;

        // Add year navigation click handlers
        addYearNavigationHandlers();
    }

    // Add click handlers for year navigation
    function addYearNavigationHandlers() {
        const yearLinks = document.querySelectorAll('.year-link');
        const yearSections = document.querySelectorAll('.year-section');

        yearLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetYear = this.getAttribute('data-year');

                // Update active link
                yearLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Show/hide sections
                if (targetYear === 'all') {
                    // Show all year sections
                    yearSections.forEach(section => {
                        section.style.display = 'block';
                        section.style.animation = 'fadeInUp 0.5s ease-out';
                    });
                } else {
                    // Show only selected year
                    yearSections.forEach(section => {
                        if (section.getAttribute('data-year') === targetYear) {
                            section.style.display = 'block';
                            section.style.animation = 'fadeInUp 0.5s ease-out';
                        } else {
                            section.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Check which page we're on and render accordingly
        if (document.getElementById('home-news-grid')) {
            renderHomePageNews();
        }
        if (document.getElementById('news-archive-content')) {
            renderNewsArchive();
        }
    });
})();
