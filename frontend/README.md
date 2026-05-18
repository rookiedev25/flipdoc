# FlipDoc Frontend

A browser-based DOCX to Markdown conversion tool for Technical Writers.

## Features

- 📄 **Drag & Drop Upload** — Upload DOCX files with drag-and-drop or file picker
- 🔄 **Client-Side Conversion** — All processing happens in browser, no server needed
- 🖼️ **Image Extraction** — Automatically extracts embedded images
- ✨ **Clean Markdown** — Removes Word artifacts for readable output
- 📋 **YAML Metadata** — Generates structured TOC from headings
- 📑 **Section Splitting** — Splits document by headings into separate files
- 📦 **ZIP Download** — Download all outputs as a single archive

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Conversion**: mammoth.js, turndown.js
- **Bundling**: JSZip, file-saver
- **Metadata**: js-yaml

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Navigation with FlipDoc branding
│   └── Footer.jsx        # Simple footer
├── context/
│   └── ConversionContext.jsx  # Conversion state management
├── pages/
│   ├── HomePage.jsx      # Landing page
│   ├── UploadPage.jsx    # File upload with drag-drop
│   ├── ProcessingPage.jsx # Conversion progress
│   └── ResultsPage.jsx   # Preview & download
├── utils/
│   └── docConverter.js   # Core conversion logic
├── App.jsx
├── main.jsx
└── index.css
```

## Pages

### HomePage
Landing page with hero section and feature highlights.

### UploadPage
Drag-and-drop DOCX upload with file validation (50MB max, DOCX only).

### ProcessingPage
Shows smooth animated progress through conversion steps:
- Extracting content
- Converting to Markdown
- Cleaning formatting
- Generating metadata
- Splitting sections

### ResultsPage
Preview and download converted content:
- **Markdown tab** — Full converted document with copy button
- **Sections tab** — Individual section files
- **Images tab** — Extracted images gallery
- **Download** — ZIP archive with all outputs

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Conversion Pipeline

All conversion happens client-side using:

1. **mammoth.js** — Extracts HTML and images from DOCX
2. **turndown.js** — Converts HTML to Markdown
3. **Custom cleaning** — Removes Word artifacts
4. **js-yaml** — Generates TOC metadata
5. **JSZip** — Bundles output as ZIP

## Output Structure

```
download.zip
├── output.md          # Full converted Markdown
├── toc.yml            # Table of contents metadata
├── sections/          # Split by headings
│   ├── introduction.md
│   ├── getting-started.md
│   └── ...
└── media/             # Extracted images
    ├── image1.png
    ├── image2.png
    └── ...
```

## Design Specifications

- **Primary Color**: `#0066cc` (Blue)
- **Design Approach**: Minimal, clean, professional
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG compliant

## Key Components

### Navbar
- Logo and navigation
- Links to Upload, Dashboard, Login

### Footer
- Company info
- Links to documentation and legal pages

### File Upload
- Drag-and-drop support
- File validation (type and size)
- Bot selection checkboxes

### Progress Indicator
- Real-time progress animation
- Status updates
- Job ID reference

### Results Display
- Tabbed interface for different bot results
- Severity-based color coding
- Recommendations for each violation
- Export options (PDF, CSV)

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Batch processing
- [ ] Result sharing with team members
- [ ] Custom report templates
- [ ] Integration with document management systems

## License

Internal - Company Use Only

## Support

For issues or questions, contact the development team.
