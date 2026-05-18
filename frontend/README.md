# FlipDoc

**Word to Markdown. Simplified.**

FlipDoc is a browser-based document conversion utility that transforms DOCX files into clean, well-formatted Markdown — all client-side, no server required.

![FlipDoc](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-4-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Drag & Drop Upload** — Simply drag your DOCX file or click to browse
- **Client-Side Conversion** — All processing happens in your browser, no data leaves your machine
- **Image Extraction** — Automatically extracts and preserves embedded images
- **Clean Markdown** — Removes Word artifacts and produces clean, readable Markdown
- **YAML Metadata** — Generates structured metadata from document headings
- **Section Splitting** — Splits documents by headings into separate files
- **ZIP Download** — Download everything as a single ZIP archive

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **mammoth.js** — DOCX to HTML conversion
- **turndown.js** — HTML to Markdown conversion
- **JSZip** — ZIP file creation
- **js-yaml** — YAML generation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rookiedev25/docParserSolution.git
cd docParserSolution/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Upload** — Drag and drop a DOCX file or click to browse
2. **Convert** — Watch the smooth progress as your document is processed
3. **Preview** — Review the generated Markdown, sections, and extracted images
4. **Download** — Get everything as a ZIP file containing:
   - `output.md` — Full converted Markdown
   - `toc.yml` — Table of contents metadata
   - `sections/` — Individual section files
   - `media/` — Extracted images

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── context/        # React context providers
│   │   └── ConversionContext.jsx
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── ProcessingPage.jsx
│   │   └── ResultsPage.jsx
│   ├── utils/          # Utility functions
│   │   └── docConverter.js
│   └── App.jsx
├── index.html
├── tailwind.config.js
└── vite.config.js
```

## License

MIT

---

Built with ❤️ for Technical Writers
