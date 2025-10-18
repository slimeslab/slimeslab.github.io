# News Posts - Markdown Format

This folder contains news articles written in Markdown format, which are automatically converted to HTML when displayed on the website.

## How to Add a New News Post

### 1. Create the Markdown File

Create a new `.md` file in this directory (`assets/content/news/`) with a descriptive filename:

```bash
# Example filenames:
ai-materials-discovery.md
workshop-announcement.md
conference-presentation-2024.md
```

**Naming Guidelines:**
- Use lowercase letters
- Use hyphens instead of spaces
- Be descriptive but concise
- Don't include the year in the filename (it's in the JSON)

### 2. Write Your Content in Markdown

Use standard Markdown syntax to write your article:

```markdown
# Article Title

Opening paragraph that introduces the topic...

## Section Heading

Content for this section with **bold text** and *italic text*.

### Subsection

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered item 1
2. Numbered item 2

> This is a blockquote for highlighting important information

[Link to another page](/contact.html)
```

**Supported Markdown Features:**
- Headings (H1-H6)
- Paragraphs
- **Bold** and *italic* text
- Links
- Images
- Lists (ordered and unordered)
- Blockquotes
- Code blocks
- Tables
- Horizontal rules

### 3. Update the JSON File

Add an entry to `assets/data/news.json`:

```json
{
  "id": "your-article-id",
  "title": "Your Article Title",
  "author": "Author Name",
  "date": "2024-10-18",
  "excerpt": "A brief summary of the article (2-3 sentences)",
  "image": "assets/images/news/article-image.jpg",
  "link": "news/2024/your-article.html",
  "markdown": "assets/content/news/your-article-id.md",
  "tags": ["Tag1", "Tag2", "Tag3"]
}
```

**Important Notes:**
- The `id` should match your markdown filename (without .md extension)
- The `markdown` field should point to your markdown file
- The `link` field is no longer used but kept for backwards compatibility
- Tags should be relevant and concise

### 4. Add an Image (Optional)

Place your article image in `assets/images/news/` and reference it in the JSON:

```
assets/images/news/
├── 2024/
│   └── your-article-image.jpg
└── 2023/
    └── older-article-image.jpg
```

## Markdown Formatting Examples

### Headings

```markdown
# Main Title (H1)
## Section (H2)
### Subsection (H3)
#### Sub-subsection (H4)
```

### Links

```markdown
[Internal link](/about.html)
[External link](https://example.com)
```

External links automatically open in new tabs.

### Images

```markdown
![Image description](assets/images/news/image.jpg)
```

### Lists

```markdown
**Unordered:**
- Item 1
- Item 2
  - Nested item
  - Another nested item

**Ordered:**
1. First item
2. Second item
3. Third item
```

### Code

**Inline code:**
```markdown
Use `code` for inline code snippets
```

**Code blocks:**
````markdown
```python
def hello_world():
    print("Hello, World!")
```
````

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines
```

## Complete Example

**Filename:** `sustainable-materials-2024.md`

```markdown
# Sustainable Materials for a Greener Future

The pursuit of sustainable materials has never been more critical. As we face mounting environmental challenges, our research group is at the forefront of discovering and designing materials that minimize environmental impact.

## The Challenge

Traditional materials often come with significant environmental costs:

- High energy consumption during production
- Limited recyclability
- Toxic byproducts
- Non-renewable resource depletion

## Our Approach

We're using a combination of:

1. **AI-driven discovery**: Machine learning to identify promising candidates
2. **High-throughput screening**: Testing thousands of materials virtually
3. **Experimental validation**: Confirming computational predictions in the lab

### Key Achievements

> In 2024, we successfully identified 15 new sustainable material candidates with promising properties for solar cell applications.

## Looking Ahead

The future of materials science lies in sustainability. By combining computational power with innovative thinking, we can create materials that benefit both technology and the environment.

For more information about our research, visit our [Research page](/research.html) or [contact us](/contact.html).
```

**Corresponding JSON entry:**

```json
{
  "id": "sustainable-materials-2024",
  "title": "Sustainable Materials for a Greener Future",
  "author": "Dr. John Buckeridge",
  "date": "2024-10-18",
  "excerpt": "Exploring how our research group is discovering sustainable materials that minimize environmental impact while maintaining high performance.",
  "image": "assets/images/news/2024/sustainable-materials.jpg",
  "link": "news/2024/sustainable-materials.html",
  "markdown": "assets/content/news/sustainable-materials-2024.md",
  "tags": ["Sustainability", "Materials Discovery", "Environment"]
}
```

## Testing Your Article

1. Open `news-article.html?id=your-article-id` in your browser
2. Verify the content renders correctly
3. Check that all links work
4. Ensure images display properly
5. Confirm responsive design on mobile

## Tips

- Keep paragraphs concise for better readability
- Use headings to structure your content
- Include relevant links to other pages or external resources
- Add images to make content more engaging
- Use lists for easy scanning
- Proofread before publishing

## Backward Compatibility

Articles can still use static HTML files if needed. Simply:
- Don't include the `markdown` field in the JSON
- Keep the `link` field pointing to your HTML file

The system will automatically use the static HTML link when no markdown file is specified.
