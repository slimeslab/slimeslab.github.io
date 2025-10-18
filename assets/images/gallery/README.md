# Gallery Images

This folder contains gallery images organized by year.

## Folder Structure

```
gallery/
├── 2024/
│   ├── team-meeting.jpg
│   ├── conference-2024.jpg
│   └── ...
├── 2023/
│   ├── lab-tour.jpg
│   └── ...
└── 2022/
    └── ...
```

## Adding New Images

1. **Create a year folder** (if it doesn't exist):
   - Create a new folder with the year as the name (e.g., `2024`, `2023`)

2. **Add images to the year folder**:
   - Place your images in the appropriate year folder
   - Supported formats: JPG, PNG, WebP
   - Recommended image size: 1200x800px or similar aspect ratio

3. **Update the JSON file**:
   - Open `assets/data/gallery.json`
   - Add the filename to the appropriate year array:

```json
{
  "2024": [
    "team-meeting.jpg",
    "conference-2024.jpg"
  ],
  "2023": [
    "lab-tour.jpg"
  ]
}
```

## Image Naming

**Important**: The filename will be automatically converted to a display title!

Examples:
- `team-meeting.jpg` → "Team Meeting"
- `conference-presentation-2024.jpg` → "Conference Presentation 2024"
- `lab_tour_march.jpg` → "Lab Tour March"

**Guidelines**:
- Use descriptive filenames with hyphens or underscores
- Use lowercase
- Be specific (e.g., `mrs-conference-2024.jpg` instead of `conf.jpg`)

## Image Guidelines

- **Format**: Use JPG for photos, PNG for images with transparency
- **Size**: Optimize images to reduce file size (recommended max 500KB per image)
- **Naming**: Use descriptive, lowercase filenames with hyphens (e.g., `team-meeting-march.jpg`)
- **Aspect Ratio**: Maintain consistent aspect ratios for better visual presentation

## Example

```json
{
  "2024": [
    "group-photo-2024.jpg",
    "lab-meeting.jpg",
    "conference-presentation.jpg"
  ],
  "2023": [
    "team-retreat.jpg",
    "symposium.jpg"
  ]
}
```

The gallery will:
- Automatically organize images by year (newest first)
- Generate display titles from filenames
- Show images in a responsive grid layout
- Support click-to-zoom lightbox viewing
