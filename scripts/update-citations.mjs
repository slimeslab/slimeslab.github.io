// Fetch citation count from OpenAlex author profile
// Updates the data-target attribute in index.html
// Usage: node scripts/update-citations.mjs

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = join(__dirname, '..', 'index.html');

const ORCID_ID = '0000-0002-2537-5082';
const OPENALEX_URL = `https://api.openalex.org/authors/https://orcid.org/${ORCID_ID}`;

async function fetchCitationCount() {
    console.log(`Fetching citation count from OpenAlex for ORCID ${ORCID_ID}...`);

    const response = await fetch(OPENALEX_URL, {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'mailto:slimes-group@lsbu.ac.uk'
        }
    });

    if (!response.ok) {
        throw new Error(`OpenAlex API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const citations = data.cited_by_count;

    if (citations == null) {
        throw new Error(`No cited_by_count in OpenAlex response`);
    }

    console.log(`Total citations: ${citations}`);
    return citations;
}

function roundDownToHundred(n) {
    return Math.floor(n / 100) * 100;
}

async function main() {
    const citations = await fetchCitationCount();
    const rounded = roundDownToHundred(citations);
    console.log(`Rounded: ${rounded}+`);

    let html = readFileSync(INDEX_PATH, 'utf-8');

    const pattern = /(<span class="counter" data-target=")\d+(">\d*<\/span>\+\s*<\/h3>\s*<p>Citations<\/p>)/;
    const match = html.match(pattern);

    if (!match) {
        throw new Error('Could not find Citations counter in index.html');
    }

    const oldMatch = html.match(/data-target="(\d+)"[\s\S]*?Citations/);
    const oldValue = oldMatch ? oldMatch[1] : '?';

    html = html.replace(pattern, `$1${rounded}$2`);

    writeFileSync(INDEX_PATH, html, 'utf-8');
    console.log(`Updated index.html: Citations data-target ${oldValue} → ${rounded}`);
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
