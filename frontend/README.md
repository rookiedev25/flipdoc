# DocParseConvo Frontend

A modern React application for document parsing and verification.

## Features

- 📄 **Document Upload** - Upload PDF and Word documents
- 🤖 **Multiple Bot Selection** - Choose which verification bots to run
- ⏳ **Real-time Processing** - Watch progress as your document is analyzed
- 📊 **Detailed Results** - View violations with severity levels and recommendations
- 📁 **Dashboard** - Track all your document analyses
- 🔐 **Email-OTP Authentication** - Secure login with one-time passwords

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── UploadPage.jsx
│   ├── ProcessingPage.jsx
│   ├── ResultsPage.jsx
│   ├── DashboardPage.jsx
│   └── LoginPage.jsx
├── hooks/
│   └── (custom React hooks)
├── utils/
│   └── (utility functions)
├── App.jsx
├── main.jsx
└── index.css
```

## Pages

### HomePage
Landing page with features overview and CTA buttons

### UploadPage
Document upload form with bot selection

### ProcessingPage
Shows real-time progress while document is being analyzed

### ResultsPage
Displays detailed analysis results with violations and recommendations

### DashboardPage
Shows history of all uploaded documents and their status

### LoginPage
Email-OTP based authentication

## Getting Started

### Prerequisites
- Node.js 16+
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

Server runs at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=http://localhost:3001/api
```

## API Integration Points

The following pages connect to backend APIs:

1. **UploadPage** - `POST /api/upload` - Upload document
2. **ProcessingPage** - `GET /api/jobs/:jobId/status` - Check processing status
3. **ResultsPage** - `GET /api/results/:jobId` - Fetch analysis results
4. **DashboardPage** - `GET /api/jobs` - Fetch user's job history
5. **LoginPage** - `POST /api/auth/send-otp` & `POST /api/auth/verify-otp` - Authentication

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
