// Research rendering JavaScript
(function() {
    'use strict';

    let allResearchData = [];
    let currentFilter = 'all';

    // Fetch and render research
    async function loadResearch() {
        try {
            const response = await fetch('assets/data/research.json');
            const researchData = await response.json();
            allResearchData = researchData;
            return researchData;
        } catch (error) {
            console.error('Error loading research:', error);
            return [];
        }
    }

    // Render research card
    function renderResearchCard(item) {
        // Build links HTML if any links exist
        let linksHTML = '';
        if (item.github || item.documentation || item.paper) {
            const links = [];

            if (item.github) {
                links.push(`<a href="${item.github}" class="research-link" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="fab fa-github"></i></a>`);
            }
            if (item.documentation) {
                links.push(`<a href="${item.documentation}" class="research-link" target="_blank" rel="noopener noreferrer" title="Documentation"><i class="fas fa-book"></i></a>`);
            }
            if (item.paper) {
                links.push(`<a href="${item.paper}" class="research-link" target="_blank" rel="noopener noreferrer" title="Paper"><i class="fas fa-file-alt"></i></a>`);
            }

            linksHTML = `<div class="research-links">${links.join('')}</div>`;
        }

        // Format tag for display
        const tagDisplay = item.tag === 'software-codes' ? 'software/codes' : item.tag;

        return `
            <div class="research-item" data-category="${item.tag}">
                <div class="research-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="research-content">
                    <h3>${item.title}</h3>
                    <div class="research-tags">
                        <span class="tag">${tagDisplay}</span>
                        ${linksHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // Filter research items
    function filterResearch(category) {
        currentFilter = category;
        const researchItems = document.querySelectorAll('.research-item');

        researchItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                // Add fade in animation
                item.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                item.style.display = 'none';
            }
        });

        // Update active button
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Render research grid
    async function renderResearchGrid() {
        const researchGrid = document.getElementById('research-grid');
        if (!researchGrid) return;

        const researchData = await loadResearch();

        // Render all research items
        researchGrid.innerHTML = researchData.map(renderResearchCard).join('');

        // Add filter button click handlers
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                filterResearch(filter);
            });
        });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        renderResearchGrid();
    });
})();
