// Members rendering JavaScript
(function() {
    'use strict';

    // Fetch members data
    async function loadMembers() {
        try {
            const response = await fetch('../assets/data/members.json');
            const membersData = await response.json();
            return membersData;
        } catch (error) {
            console.error('Error loading members:', error);
            return null;
        }
    }

    // Render social links for members
    function renderSocialLinks(member, showEmail = true) {
        const links = [];

        if (showEmail && member.email) {
            links.push(`<a href="mailto:${member.email}" title="Email"><i class="fas fa-envelope"></i></a>`);
        }

        if (member.website) {
            links.push(`<a href="${member.website}" target="_blank" rel="noopener noreferrer" title="Website"><i class="fas fa-globe"></i></a>`);
        }

        if (member.linkedin) {
            links.push(`<a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`);
        }

        if (member.googleScholar) {
            links.push(`<a href="${member.googleScholar}" target="_blank" rel="noopener noreferrer" title="Google Scholar"><i class="ai ai-google-scholar"></i></a>`);
        }

        if (member.github) {
            links.push(`<a href="${member.github}" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="fab fa-github"></i></a>`);
        }

        return links.length > 0 ? `<div class="member-contact">${links.join('')}</div>` : '';
    }

    // Render current member card
    function renderCurrentMember(member) {
        const socialLinks = renderSocialLinks(member);

        return `
            <div class="team-member">
                <div class="member-image">
                    <img src="../${member.image}" alt="${member.name}">
                </div>
                <div class="member-info">
                    <h4>${member.name}</h4>
                    <p class="member-position">${member.position}</p>
                    <p class="member-research">${member.researchTopic}</p>
                    ${socialLinks}
                </div>
            </div>
        `;
    }

    // Render alumni card
    function renderAlumniMember(alumni) {
        const socialLinks = renderSocialLinks(alumni);

        return `
            <div class="alumni-member">
                <h4>${alumni.name}</h4>
                <p class="alumni-position">${alumni.groupPosition} (${alumni.duration})</p>
                <p class="current-position">${alumni.currentPosition}</p>
                <p class="thesis">Research: "${alumni.researchTitle}"</p>
                ${socialLinks}
            </div>
        `;
    }

    // Render collaborator card
    function renderCollaborator(collaborator) {
        const socialLinks = renderSocialLinks(collaborator);

        return `
            <div class="collaborator-item">
                <h4>${collaborator.name}</h4>
                <p class="collaborator-institute">${collaborator.institute}</p>
                <p class="collaborator-papers">${collaborator.papersCount} joint publication${collaborator.papersCount !== 1 ? 's' : ''}</p>
                ${socialLinks}
            </div>
        `;
    }

    // Render current members section
    function renderCurrentMembers(currentMembers) {
        const container = document.getElementById('current-members-container');
        if (!container) return;

        let html = '';

        // Category configurations
        const categories = [
            { key: 'postdocs', title: 'Postdoctoral Researchers', data: currentMembers.postdocs },
            { key: 'phdStudents', title: 'PhD Students', data: currentMembers.phdStudents },
            { key: 'mastersStudents', title: "Master's Students", data: currentMembers.mastersStudents },
            { key: 'bachelorsStudents', title: "Bachelor's Students", data: currentMembers.bachelorsStudents }
        ];

        // Render only categories with members
        categories.forEach(category => {
            if (category.data && category.data.length > 0) {
                const membersHTML = category.data.map(renderCurrentMember).join('');
                html += `
                    <div class="team-category">
                        <h3>${category.title}</h3>
                        <div class="team-grid">
                            ${membersHTML}
                        </div>
                    </div>
                `;
            }
        });

        container.innerHTML = html;
    }

    // Render alumni section
    function renderAlumni(alumni) {
        const container = document.getElementById('alumni-container');
        if (!container) return;

        // Only render if there are alumni
        if (!alumni || alumni.length === 0) {
            // Hide the entire alumni section
            const alumniSection = document.querySelector('.alumni');
            if (alumniSection) {
                alumniSection.style.display = 'none';
            }
            return;
        }

        const alumniHTML = alumni.map(renderAlumniMember).join('');
        container.innerHTML = alumniHTML;
    }

    // Render collaborators section
    function renderCollaborators(collaborators) {
        const container = document.getElementById('collaborators-container');
        if (!container) return;

        // Only render if there are collaborators
        if (!collaborators || collaborators.length === 0) {
            // Hide the entire collaborators section
            const collaboratorsSection = document.querySelector('.collaborators');
            if (collaboratorsSection) {
                collaboratorsSection.style.display = 'none';
            }
            return;
        }

        const collaboratorsHTML = collaborators.map(renderCollaborator).join('');
        container.innerHTML = collaboratorsHTML;
    }

    // Initialize members page
    async function initializeMembersPage() {
        const membersData = await loadMembers();

        if (!membersData) {
            console.error('Failed to load members data');
            return;
        }

        // Render all sections
        if (membersData.currentMembers) {
            renderCurrentMembers(membersData.currentMembers);
        }

        if (membersData.alumni) {
            renderAlumni(membersData.alumni);
        }

        if (membersData.collaborators) {
            renderCollaborators(membersData.collaborators);
        }
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', initializeMembersPage);
})();
