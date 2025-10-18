// Publications rendering from ORCID API
(function() {
    'use strict';

    const ORCID_ID = '0000-0002-2537-5082';
    const ORCID_API_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;
    const MAX_PUBLICATIONS = 15;

    // Fetch publications from ORCID
    async function fetchPublications() {
        try {
            const response = await fetch(ORCID_API_URL, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching publications:', error);
            return null;
        }
    }

    // Fetch metadata from OA.Works API
    async function fetchMetadata(doi) {
        if (!doi) return null;

        try {
            const response = await fetch(`https://bg.api.oa.works/metadata?id=${doi}`);
            if (!response.ok) return null;
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching metadata for DOI:', doi, error);
            return null;
        }
    }

    // Parse ORCID work to extract publication details
    function parseWork(work) {
        const workSummary = work['work-summary'][0];
        const title = workSummary.title?.title?.value || 'Untitled';
        const year = workSummary['publication-date']?.year?.value || 'Unknown';
        const journal = workSummary['journal-title']?.value || '';
        const type = workSummary.type || 'article';

        // Get DOI if available
        const externalIds = workSummary['external-ids']?.['external-id'] || [];
        const doiObj = externalIds.find(id => id['external-id-type'] === 'doi');
        const doi = doiObj ? doiObj['external-id-value'] : null;

        // Get URL
        const url = workSummary.url?.value || (doi ? `https://doi.org/${doi}` : null);

        return {
            title,
            year: parseInt(year),
            journal,
            type,
            doi,
            url,
            putCode: workSummary['put-code'],
            authors: null,
            volume: null,
            issue: null,
            pages: null
        };
    }

    // Enrich publication with metadata from OA.Works
    async function enrichPublication(pub) {
        if (!pub.doi) return pub;

        const metadata = await fetchMetadata(pub.doi);
        if (!metadata) return pub;

        // Extract authors
        if (metadata.author && Array.isArray(metadata.author)) {
            pub.authors = metadata.author.map(author => {
                const family = author.family || '';
                const given = author.given || '';
                if (family && given) {
                    // Format as: Last, F.
                    const initials = given.split(' ').map(n => n.charAt(0) + '.').join(' ');
                    return `${family}, ${initials}`;
                } else if (family) {
                    return family;
                } else if (given) {
                    return given;
                }
                return author.name || '';
            });
        }

        // Extract volume, issue, pages
        pub.volume = metadata.volume || null;
        pub.issue = metadata.issue || null;
        pub.pages = metadata.page || null;

        // Update journal if better info available
        if (metadata['container-title'] && !pub.journal) {
            pub.journal = metadata['container-title'];
        }

        return pub;
    }

    // Group publications by year
    function groupByYear(publications) {
        // Use a Map to preserve insertion order
        const grouped = new Map();

        // First, collect all publications by year
        const yearMap = {};
        publications.forEach(pub => {
            if (!yearMap[pub.year]) {
                yearMap[pub.year] = [];
            }
            yearMap[pub.year].push(pub);
        });

        // Sort years in descending order (2025, 2024, 2023...)
        const sortedYears = Object.keys(yearMap)
            .map(y => parseInt(y))
            .sort((a, b) => b - a); // Descending

        // Add to Map in sorted order
        sortedYears.forEach(year => {
            grouped.set(year, yearMap[year]);
        });

        return grouped;
    }

    // Generate BibTeX citation
    function generateBibTeX(pub) {
        const year = pub.year || '';
        const title = pub.title || '';
        const journal = pub.journal || '';
        const doi = pub.doi || '';
        const volume = pub.volume || '';
        const issue = pub.issue || '';
        const pages = pub.pages || '';

        // Create citation key from first author and year
        let citationKey = 'publication';
        if (pub.authors && pub.authors.length > 0) {
            const firstAuthor = pub.authors[0].split(',')[0].toLowerCase().replace(/\s+/g, '');
            citationKey = `${firstAuthor}${year}`;
        }

        // Format authors for BibTeX
        let bibtexAuthors = '';
        if (pub.authors && pub.authors.length > 0) {
            bibtexAuthors = pub.authors.join(' and ');
        }

        let bibtex = `@article{${citationKey},\n`;
        if (bibtexAuthors) bibtex += `  author = {${bibtexAuthors}},\n`;
        if (title) bibtex += `  title = {${title}},\n`;
        if (journal) bibtex += `  journal = {${journal}},\n`;
        if (volume) bibtex += `  volume = {${volume}},\n`;
        if (issue) bibtex += `  number = {${issue}},\n`;
        if (pages) bibtex += `  pages = {${pages}},\n`;
        if (year) bibtex += `  year = {${year}},\n`;
        if (doi) bibtex += `  doi = {${doi}}\n`;
        bibtex += `}`;

        return bibtex;
    }

    // Render a single publication
    function renderPublication(pub) {
        // Format authors
        let authorsHTML = '';
        if (pub.authors && pub.authors.length > 0) {
            const authorList = pub.authors.join('; ');
            authorsHTML = authorList;
        }

        // Format journal info with volume/issue/pages
        let venueHTML = '';
        if (pub.journal) {
            let venueParts = [pub.journal];

            if (pub.volume) {
                venueParts.push(pub.volume);
            }
            if (pub.issue) {
                venueParts[venueParts.length - 1] += `(${pub.issue})`;
            }
            if (pub.pages) {
                venueParts.push(pub.pages);
            }
            if (pub.year) {
                venueParts.push(pub.year);
            }

            venueHTML = venueParts.join(', ') + '.';
        } else if (pub.year) {
            venueHTML = pub.year + '.';
        }

        // Build links
        const links = [];

        if (pub.url) {
            links.push(`<a href="${pub.url}" target="_blank" rel="noopener noreferrer">link</a>`);
        } else if (pub.doi) {
            links.push(`<a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener noreferrer">link</a>`);
        }

        // Generate BibTeX
        const bibtex = generateBibTeX(pub);
        const bibtexId = `bibtex-${Math.random().toString(36).substr(2, 9)}`;

        return `
            <div class="publication-item">
                <div class="pub-title-line">${pub.title}</div>
                ${authorsHTML ? `<div class="pub-authors-line">${authorsHTML}</div>` : ''}
                ${venueHTML ? `<div class="pub-venue-line">${venueHTML}</div>` : ''}
                <div class="pub-links-line">
                    ${links.join(' ')}
                    <span class="bibtex-toggle" data-target="${bibtexId}">
                        bibtex <i class="fas fa-chevron-down"></i>
                    </span>
                </div>
                <div class="bibtex-content" id="${bibtexId}">
                    <pre>${bibtex}</pre>
                </div>
            </div>
        `;
    }

    // Render publications grouped by year
    function renderPublications(groupedPubs) {
        const container = document.getElementById('publications-container');
        if (!container) return;

        let html = '';

        // Iterate over the Map in insertion order (which is sorted descending)
        groupedPubs.forEach((pubs, year) => {
            const pubsHTML = pubs.map(pub => renderPublication(pub)).join('');

            html += `
                <div class="year-section">
                    <div class="year-header">
                        <h2>${year}</h2>
                    </div>
                    <div class="year-content">
                        ${pubsHTML}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Add BibTeX toggle functionality
        attachBibtexHandlers();
    }

    // Attach event handlers for BibTeX toggle
    function attachBibtexHandlers() {
        const bibtexToggles = document.querySelectorAll('.bibtex-toggle');

        bibtexToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const content = document.getElementById(targetId);
                const icon = this.querySelector('i');

                if (content.classList.contains('active')) {
                    // Collapse
                    content.classList.remove('active');
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    // Expand
                    content.classList.add('active');
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }

    // Show error message
    function showError() {
        const container = document.getElementById('publications-container');
        if (!container) return;

        container.innerHTML = `
            <div class="publications-error">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Unable to Load Publications</h3>
                <p>We're having trouble loading the publications list. Please try again later or visit the Google Scholar profile.</p>
            </div>
        `;
    }

    // Hide loader and show content
    function hideLoader() {
        const loader = document.getElementById('publications-loader');
        const container = document.getElementById('publications-container');

        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }

        if (container) {
            setTimeout(() => {
                container.style.opacity = '1';
            }, 300);
        }
    }

    // Initialize publications page
    async function initializePublications() {
        const data = await fetchPublications();

        if (!data || !data.group) {
            showError();
            hideLoader();
            return;
        }

        // Parse all works
        let publications = data.group
            .map(work => parseWork(work))
            .filter(pub => pub.year && !isNaN(pub.year)) // Filter out works without valid year
            .sort((a, b) => {
                // Sort by year (descending), then by title
                if (b.year !== a.year) {
                    return b.year - a.year;
                }
                return a.title.localeCompare(b.title);
            })
            .slice(0, MAX_PUBLICATIONS); // Limit to latest 15

        if (publications.length === 0) {
            showError();
            hideLoader();
            return;
        }

        // Enrich publications with metadata from OA.Works API
        // Process in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < publications.length; i += batchSize) {
            const batch = publications.slice(i, i + batchSize);
            await Promise.all(batch.map(async (pub, index) => {
                publications[i + index] = await enrichPublication(pub);
            }));
        }

        // Group by year
        const groupedPubs = groupByYear(publications);

        // Render publications
        renderPublications(groupedPubs);

        // Hide loader
        hideLoader();
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', initializePublications);
})();
