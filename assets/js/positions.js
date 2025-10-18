// Open Positions rendering JavaScript
(function() {
    'use strict';

    // Fetch positions data
    async function loadPositions() {
        try {
            const response = await fetch('../assets/data/positions.json');
            const positionsData = await response.json();
            return positionsData;
        } catch (error) {
            console.error('Error loading positions:', error);
            return [];
        }
    }

    // Format date to readable string
    function formatDate(dateString) {
        if (dateString === 'Rolling Admission' || dateString.includes('Rolling')) {
            return dateString;
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Get funding badge HTML based on status
    function getFundingBadge(status, details) {
        let badgeClass = 'funding-badge';
        let badgeText = '';

        switch(status) {
            case 'fully-funded':
                badgeClass += ' funded-full';
                badgeText = 'Fully Funded';
                break;
            case 'partially-funded':
                badgeClass += ' funded-partial';
                badgeText = 'Partially Funded';
                break;
            case 'non-funded':
                badgeClass += ' funded-none';
                badgeText = 'Non-Funded';
                break;
            default:
                badgeClass += ' funded-none';
                badgeText = 'Not Specified';
        }

        return `<span class="${badgeClass}">${badgeText}</span>`;
    }

    // Render position card
    function renderPositionCard(position) {
        const fundingBadge = getFundingBadge(position.fundingStatus, position.fundingDetails);
        const fundingDetailsHTML = position.fundingDetails
            ? `<p class="funding-details">${position.fundingDetails}</p>`
            : '';

        // Requirements list
        const requirementsHTML = position.requirements.map(req => `<li>${req}</li>`).join('');

        // What we offer list
        const offerHTML = position.whatWeOffer.map(offer => `<li>${offer}</li>`).join('');

        // Action buttons
        let actionsHTML = '';
        if (position.link) {
            actionsHTML = `
                <a href="${position.link}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> Apply Now
                </a>
                <a href="../contact.html" class="btn btn-secondary">
                    <i class="fas fa-envelope"></i> Contact Us
                </a>
            `;
        } else {
            actionsHTML = `
                <a href="../contact.html" class="btn btn-secondary">
                    <i class="fas fa-envelope"></i> Contact Us
                </a>
            `;
        }

        return `
            <div class="position-card">
                <div class="position-header">
                    <h3><i class="fas fa-briefcase"></i> ${position.title}</h3>
                    ${fundingBadge}
                </div>
                <div class="position-details">
                    <div class="position-meta">
                        <span><i class="fas fa-calendar"></i> <strong>Deadline:</strong> ${formatDate(position.deadline)}</span>
                        <span><i class="fas fa-clock"></i> <strong>Duration:</strong> ${position.duration}</span>
                    </div>
                    ${fundingDetailsHTML}
                    <p class="position-topic">${position.topicBrief}</p>
                    <div class="position-requirements">
                        <h4><i class="fas fa-check-circle"></i> Requirements</h4>
                        <ul>
                            ${requirementsHTML}
                        </ul>
                    </div>
                    <div class="position-offer">
                        <h4><i class="fas fa-gift"></i> What We Offer</h4>
                        <ul>
                            ${offerHTML}
                        </ul>
                    </div>
                    <div class="position-actions">
                        ${actionsHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // Render positions section
    async function renderPositions() {
        const positionsContainer = document.getElementById('positions-container');
        const sectionIntro = document.getElementById('positions-intro');

        if (!positionsContainer) return;

        const positions = await loadPositions();

        if (!positions || positions.length === 0) {
            // No positions available
            if (sectionIntro) {
                sectionIntro.innerHTML = `
                    <h2>Join Our Research Group</h2>
                    <p>Thank you for your interest in joining our research group. Currently, we do not have any open positions available. However, we are always interested in hearing from talented and motivated individuals. Please feel free to <a href="../contact.html">contact us</a> with your CV and research interests for future opportunities.</p>
                `;
            }
            positionsContainer.innerHTML = '';
        } else {
            // Positions available
            if (sectionIntro) {
                sectionIntro.innerHTML = `
                    <h2>Join Our Research Group</h2>
                    <p>We are always looking for talented and motivated individuals to join our team. Explore current opportunities below.</p>
                `;
            }
            const positionsHTML = positions.map(renderPositionCard).join('');
            positionsContainer.innerHTML = positionsHTML;
        }
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', renderPositions);
})();
