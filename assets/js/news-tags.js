// News tag filtering JavaScript
(function() {
    'use strict';

    // Get tag from URL parameter
    function getTagParam() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tag');
    }

    // Fetch news data
    async function loadNews() {
        try {
            const response = await fetch('assets/data/news.json');
            const newsData = await response.json();
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

    // Get article link
    function getArticleLink(newsItem) {
        if (newsItem.markdown) {
            return `news-article.html?id=${newsItem.id}`;
        }
        return newsItem.link;
    }

    // Render a news card (same layout as archive)
    function renderNewsCard(newsItem) {
        const tagsHTML = newsItem.tags.map(tag =>
            `<a href="news-tags.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`
        ).join('');
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
                    <a href="${articleLink}" class="read-more">Read more &rarr;</a>
                </div>
            </article>
        `;
    }

    // Get all unique tags from news data
    function getAllTags(newsData) {
        const tagSet = new Set();
        newsData.forEach(item => {
            item.tags.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
    }

    // Render tag navigation
    function renderTagNavigation(allTags, activeTag) {
        const tagNav = document.getElementById('tag-navigation');
        if (!tagNav) return;

        const allButton = `<a href="news-tags.html" class="year-link${!activeTag ? ' active' : ''}">All</a>`;
        const tagButtons = allTags.map(tag => {
            const isActive = activeTag && tag.toLowerCase() === activeTag.toLowerCase();
            return `<a href="news-tags.html?tag=${encodeURIComponent(tag)}" class="year-link${isActive ? ' active' : ''}">${tag}</a>`;
        }).join('');

        tagNav.innerHTML = allButton + tagButtons;
    }

    // Render filtered news
    function renderFilteredNews(newsData, tag) {
        const content = document.getElementById('tag-news-content');
        if (!content) return;

        let filtered;
        if (tag) {
            filtered = newsData.filter(item =>
                item.tags.some(t => t.toLowerCase() === tag.toLowerCase())
            );
        } else {
            filtered = newsData;
        }

        if (filtered.length === 0) {
            content.innerHTML = `
                <div class="no-results">
                    <h3>No articles found</h3>
                    <p>${tag ? `No news articles tagged with "${tag}".` : 'No news articles available.'}</p>
                    <a href="news.html" class="read-more">Back to News &rarr;</a>
                </div>
            `;
            return;
        }

        const newsHTML = filtered.map(renderNewsCard).join('');
        content.innerHTML = `
            <div class="news-grid">
                ${newsHTML}
            </div>
        `;
    }

    // Update page title and breadcrumb
    function updatePageHeader(tag) {
        const pageTitle = document.getElementById('tag-page-title');
        const breadcrumbTag = document.getElementById('breadcrumb-tag');
        const resultsTitle = document.getElementById('tag-results-title');
        const resultsDesc = document.getElementById('tag-results-description');

        if (tag) {
            document.title = `Tag: ${tag} - News - SLIMES Research Group`;
            if (pageTitle) pageTitle.textContent = `Tag: ${tag}`;
            if (breadcrumbTag) breadcrumbTag.textContent = `Tag: ${tag}`;
            if (resultsTitle) resultsTitle.textContent = `Articles tagged "${tag}"`;
            if (resultsDesc) resultsDesc.textContent = `Showing all news articles with the tag "${tag}"`;
        } else {
            document.title = 'News by Tag - SLIMES Research Group';
            if (pageTitle) pageTitle.textContent = 'News by Tag';
            if (breadcrumbTag) breadcrumbTag.textContent = 'Tags';
            if (resultsTitle) resultsTitle.textContent = 'All Tags';
            if (resultsDesc) resultsDesc.textContent = 'Browse news articles by topic';
        }
    }

    // Initialize
    async function init() {
        const tag = getTagParam();
        const newsData = await loadNews();
        const allTags = getAllTags(newsData);

        updatePageHeader(tag);
        renderTagNavigation(allTags, tag);
        renderFilteredNews(newsData, tag);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
