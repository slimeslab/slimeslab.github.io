# SLIMES Research Group Website

Official website for the SLIMES (Simulations of Low-dimensional Materials and Electronic Structures) Research Group at London South Bank University, led by Dr. John Buckeridge.

🌐 **Live Site**: [https://slimeslab.github.io](https://slimeslab.github.io)

## About

This is the official research group website showcasing our work in computational materials science, focusing on defects in semiconductors, energy materials, and machine learning applications in materials discovery.

## Features

### Content Management
- **JSON-Driven Content**: Research topics, team members, collaborators, alumni, open positions, and gallery images managed via JSON files
- **Markdown Support**: News articles written in Markdown with front matter metadata
- **Dynamic Rendering**: Client-side rendering using JavaScript for flexible content updates
- **BibTeX Integration**: Publications automatically loaded from BibTeX file via BibBase

### Design & User Experience
- **Modern Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **Custom Branding**: SLIMES-specific color scheme and logo
- **Interactive Elements**:
  - Typing animation on hero section
  - Counter animations for statistics
  - Smooth transitions and hover effects
  - Image galleries with year-based organization
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support

### Pages & Sections
- **Home**: Hero section with typing animation, statistics, objectives, group leader profile, recent news
- **About**: Group overview and research philosophy
- **Research**: Topics, methods, and software/code with optional links (GitHub, documentation, papers)
- **Publications**: Auto-loaded from BibTeX with year-based filtering
- **News**: Year-based archive with Markdown article support and tag filtering
- **Contact**: Contact information, map, and association logos
- **Group**:
  - Members: Principal Investigator, postdocs, PhD students, Master's students, Bachelor's students
  - Alumni: Former members with current positions
  - Collaborators: External research partners
  - Open Positions: Current job/studentship openings
  - Gallery: Year-organized photo gallery

## Technical Stack

### Core Technologies
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, flexbox, grid layouts
- **Vanilla JavaScript**: No frameworks, pure JS for optimal performance

### Libraries & Services
- **Font Awesome 6.4.0**: Icon library
- **Academicons**: Academic/research icons (Google Scholar, ResearchGate, ORCID)
- **Marked.js 11.1.0**: Markdown to HTML conversion
- **BibBase**: BibTeX publication management
- **Google Fonts**: Dosis & Open Sans font families
- **Google Maps Embed API**: Location map on contact page

### Performance
- **Static Site**: Fast loading, no server-side processing
- **Lazy Loading**: Images loaded on demand
- **Optimized Assets**: Minimal dependencies, efficient code
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards

## Project Structure

```
├── index.html                  # Home page
├── about.html                  # About the research group
├── research.html               # Research topics and methods
├── publications.html           # Publications (BibTeX-powered)
├── news.html                   # News archive with year filtering
├── news-article.html           # Dynamic news article viewer
├── contact.html                # Contact information and map
├── group/
│   ├── members.html           # Team members page
│   ├── open-positions.html    # Job openings
│   └── gallery.html           # Photo gallery
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet (~4000 lines)
│   ├── js/
│   │   ├── script.js          # Core functionality
│   │   ├── research.js        # Research page renderer
│   │   ├── members.js         # Team members renderer
│   │   ├── positions.js       # Open positions renderer
│   │   ├── gallery.js         # Gallery renderer
│   │   ├── news.js            # News page with filtering
│   │   └── news-article.js    # Markdown article renderer
│   ├── images/
│   │   ├── branding/          # Logos and favicon
│   │   ├── team/              # Team member photos
│   │   ├── research/          # Research topic images
│   │   ├── news/              # News article images
│   │   ├── gallery/           # Gallery photos (organized by year)
│   │   └── associations/      # Partner organization logos
│   ├── data/
│   │   ├── research.json      # Research topics and software
│   │   ├── members.json       # Team members, alumni, collaborators
│   │   ├── positions.json     # Open positions
│   │   ├── news.json          # News metadata
│   │   ├── gallery.json       # Gallery image metadata
│   │   └── publications.bib   # BibTeX publications
│   └── news/                  # Markdown news articles
│       └── *.md               # Individual articles
└── README.md
```

## Color Scheme

- **Primary**: `#572b14` (Deep Brown)
- **Secondary**: `#d4a574` (Golden Brown)
- **Text**: `#333333` (Dark Gray)
- **Light Gray**: `#f8fafc`
- **White**: `#ffffff`

## Content Management

### Adding News Articles

Create a Markdown file in `assets/news/` with front matter:

```markdown
---
title: "Your Article Title"
author: "Author Name"
date: "2025-01-15"
image: "assets/images/news/article-image.jpg"
tags: ["Research", "Publication"]
excerpt: "Brief description of the article"
---

Your article content in Markdown format...
```

Then add an entry to `assets/data/news.json`:

```json
{
  "slug": "article-filename",
  "title": "Your Article Title",
  "date": "2025-01-15",
  "author": "Author Name",
  "excerpt": "Brief description",
  "image": "assets/images/news/article-image.jpg",
  "tags": ["Research", "Publication"],
  "type": "markdown"
}
```

### Updating Research Topics

Edit `assets/data/research.json` to add/modify research topics and software.

### Managing Team Members

Edit `assets/data/members.json` to update:
- Current members (postdocs, PhD students, Master's, Bachelor's)
- Alumni with current positions
- Collaborators

### Adding Open Positions

Edit `assets/data/positions.json` with position details.

### Updating Publications

Add entries to `assets/data/publications.bib` in BibTeX format.

### Managing Gallery

Add images to `assets/images/gallery/YYYY/` and update `assets/data/gallery.json`.

## Browser Support

- Chrome 90+
- Firefox 92+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Copyright & License

**© 2025 SLIMES Research Group, London South Bank University. All Rights Reserved.**

This website and its content are the intellectual property of the SLIMES Research Group and London South Bank University. The website code and design are proprietary and not available for reuse, redistribution, or modification without explicit written permission.

**Website Design & Development**: [Aritra Roy](https://aritraroy.live/)

### Third-Party Resources

This site uses the following open-source libraries and services:
- Font Awesome (Icons) - [Font Awesome License](https://fontawesome.com/license)
- Academicons (Academic Icons) - [SIL OFL 1.1 License](https://github.com/jpswalsh/academicons)
- Marked.js (Markdown Parser) - [MIT License](https://github.com/markedjs/marked)
- BibBase (Publication Management) - [BibBase Terms](https://bibbase.org/)
- Google Fonts - [Google Fonts License](https://fonts.google.com/license)

## Contact

**Dr. John Buckeridge**
Senior Lecturer in Thermofluids and Turbomachinery
School of Engineering
London South Bank University
London, SE1 0AA, UK

📧 j.buckeridge@lsbu.ac.uk
🌐 [jbuckeridge.github.io](https://jbuckeridge.github.io)
🔬 [ResearchGate](https://www.researchgate.net/lab/SLIMES-Lab-John-Buckeridge)
💻 [GitHub](https://github.com/slimeslab)

---

**Built with ❤️ for advancing materials science through computational modeling and AI-driven approaches.**
