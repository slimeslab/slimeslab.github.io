// Gallery rendering JavaScript
(function() {
    'use strict';

    // Fetch gallery data
    async function loadGallery() {
        try {
            const response = await fetch('../assets/data/gallery.json');
            const galleryData = await response.json();
            return galleryData;
        } catch (error) {
            console.error('Error loading gallery:', error);
            return {};
        }
    }

    // Generate title from filename
    function generateTitle(filename) {
        // Remove extension
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

        // Replace hyphens and underscores with spaces, capitalize words
        return nameWithoutExt
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Render gallery item
    function renderGalleryItem(filename, year) {
        const imagePath = `../assets/images/gallery/${year}/${filename}`;
        const title = generateTitle(filename);

        return `
            <div class="gallery-item">
                <img src="${imagePath}" alt="${title}" loading="lazy">
                <div class="gallery-caption">
                    <h4>${title}</h4>
                </div>
            </div>
        `;
    }

    // Render year section
    function renderYearSection(year, filenames) {
        const imagesHTML = filenames.map(filename => renderGalleryItem(filename, year)).join('');

        return `
            <div class="gallery-category">
                <h3>${year}</h3>
                <div class="gallery-grid">
                    ${imagesHTML}
                </div>
            </div>
        `;
    }

    // Render entire gallery
    async function renderGallery() {
        const galleryContainer = document.getElementById('gallery-container');
        if (!galleryContainer) return;

        const galleryData = await loadGallery();

        // Get years and sort in descending order (newest first)
        const years = Object.keys(galleryData).sort((a, b) => b - a);

        if (years.length === 0) {
            galleryContainer.innerHTML = `
                <div class="no-gallery">
                    <i class="fas fa-images"></i>
                    <p>No gallery images available at the moment.</p>
                </div>
            `;
            return;
        }

        // Render all year sections
        const galleryHTML = years.map(year => {
            const filenames = galleryData[year];
            if (filenames && filenames.length > 0) {
                return renderYearSection(year, filenames);
            }
            return '';
        }).join('');

        galleryContainer.innerHTML = galleryHTML;

        // Add lightbox functionality
        addLightboxHandlers();
    }

    // Lightbox functionality
    function addLightboxHandlers() {
        const galleryItems = document.querySelectorAll('.gallery-item img');

        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                openLightbox(this);
            });
        });
    }

    function openLightbox(img) {
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
                <div class="lightbox-caption">${img.alt}</div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Close on click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                closeLightbox(lightbox);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox(lightbox);
                document.removeEventListener('keydown', escapeHandler);
            }
        });

        // Animate in
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
    }

    function closeLightbox(lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', renderGallery);
})();
