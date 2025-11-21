# Project Structure

## 📁 Complete Directory Tree

```
WEB_APP_SOLAR_PANEL/
│
├── 📂 app/                          # Next.js 13+ App Router
│   ├── 📄 layout.jsx                # Root layout with global styles
│   ├── 📄 page.jsx                  # Home page (redirects to dashboard)
│   │
│   ├── 📂 dashboard/                # Dashboard section
│   │   ├── 📄 page.jsx              # Main dashboard page
│   │   ├── 📄 PanelCard.jsx         # Individual panel card component
│   │   └── 📄 PanelGrid.jsx         # Grid layout for all panels
│   │
│   ├── 📂 panel/                    # Panel details section
│   │   └── 📂 [id]/                 # Dynamic route for panel ID
│   │       ├── 📄 page.jsx          # Panel detail page
│   │       ├── 📄 HistoryChart.jsx  # Chart component for historical data
│   │       └── 📄 StatusBadge.jsx   # Status indicator component
│   │
│   ├── 📂 upload/                   # Upload section
│   │   └── 📄 page.jsx              # Image upload interface
│   │
│   ├── 📂 api/                      # API routes
│   │   ├── 📂 upload/
│   │   │   └── 📄 route.js          # POST: Upload to Cloudinary
│   │   ├── 📂 predict/
│   │   │   └── 📄 route.js          # POST: Get ML prediction
│   │   └── 📂 panels/
│   │       ├── 📄 route.js          # GET/POST: List/Create panels
│   │       └── 📂 [id]/
│   │           └── 📄 route.js      # GET/PUT/DELETE: Panel operations
│   │
│   └── 📂 auth/                     # Authentication section
│       ├── 📂 login/
│       │   └── 📄 page.jsx          # Login page
│       ├── 📂 register/
│       │   └── 📄 page.jsx          # Registration page
│       └── 📄 middleware.js         # Auth middleware helpers
│
├── 📂 components/                   # Reusable React components
│   ├── 📄 Navbar.jsx                # Top navigation bar
│   ├── 📄 Sidebar.jsx               # Side navigation (optional)
│   ├── 📄 Footer.jsx                # Footer component
│   └── 📂 ui/                       # UI components (shadcn/ui)
│       └── 📄 .gitkeep
│
├── 📂 lib/                          # Utility libraries
│   ├── 📄 cloudinary.js             # Cloudinary SDK config & helpers
│   ├── 📄 fastapi.js                # FastAPI client & helpers
│   ├── 📄 validators.js             # Input validation functions
│   └── 📄 utils.js                  # General utility functions
│
├── 📂 public/                       # Static assets
│   └── 📂 icons/                    # Icon files
│       └── 📄 .gitkeep
│
├── 📂 styles/                       # Stylesheets
│   └── 📄 globals.css               # Global CSS + TailwindCSS
│
├── 📄 .env.local.example            # Environment variables template
├── 📄 .eslintrc.json                # ESLint configuration
├── 📄 .gitignore                    # Git ignore rules
├── 📄 jsconfig.json                 # JavaScript config (path aliases)
├── 📄 next.config.js                # Next.js configuration
├── 📄 package.json                  # Dependencies & scripts
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 tailwind.config.js            # TailwindCSS configuration
├── 📄 README.md                     # Main documentation
├── 📄 QUICKSTART.md                 # Quick start guide
└── 📄 PROJECT_STRUCTURE.md          # This file
```

## 🗂️ File Descriptions

### App Directory (`app/`)

| File/Folder | Purpose |
|------------|---------|
| `layout.jsx` | Root layout component, wraps all pages |
| `page.jsx` | Home page that redirects to dashboard |
| `dashboard/` | Dashboard pages and components |
| `panel/[id]/` | Dynamic routes for individual panel details |
| `upload/` | Image upload interface for admins |
| `api/` | Backend API routes (Next.js API routes) |
| `auth/` | Authentication pages and middleware |

### Components (`components/`)

| File | Purpose |
|------|---------|
| `Navbar.jsx` | Main navigation bar with links and user menu |
| `Sidebar.jsx` | Optional sidebar navigation |
| `Footer.jsx` | Footer with links and info |
| `ui/` | Directory for shadcn/ui components |

### Libraries (`lib/`)

| File | Purpose |
|------|---------|
| `cloudinary.js` | Cloudinary upload/delete/optimize functions |
| `fastapi.js` | FastAPI client for ML predictions |
| `validators.js` | Input validation and sanitization |
| `utils.js` | Date formatting, file conversion, etc. |

### Configuration Files

| File | Purpose |
|------|---------|
| `.env.local.example` | Template for environment variables |
| `next.config.js` | Next.js configuration (images, etc.) |
| `tailwind.config.js` | TailwindCSS theme and plugins |
| `jsconfig.json` | Path aliases (@/components, etc.) |
| `package.json` | Dependencies and npm scripts |

## 🔄 Data Flow

```
User Browser
    ↓
Next.js Frontend (Port 3000)
    ↓
API Routes (/api/*)
    ↓
    ├─→ Cloudinary (Image Storage)
    └─→ FastAPI (Port 8000) → ML Model
```

## 🎯 Key Features by Directory

### Dashboard (`app/dashboard/`)
- Grid view of all panels
- Real-time status indicators
- Click to view details

### Panel Details (`app/panel/[id]/`)
- Large image display
- ML prediction results
- Historical performance chart
- Status badge

### Upload (`app/upload/`)
- File selection
- Image preview
- Upload to Cloudinary
- Get ML prediction

### API Routes (`app/api/`)
- RESTful endpoints
- Cloudinary integration
- FastAPI proxy
- CRUD operations

## 📦 Dependencies

### Production
- `next` - React framework
- `react` & `react-dom` - UI library
- `cloudinary` - Image management
- `axios` - HTTP client
- `recharts` - Charts library

### Development
- `tailwindcss` - Utility-first CSS
- `autoprefixer` - CSS vendor prefixes
- `postcss` - CSS processing
- `eslint` - Code linting

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Configure environment**: Copy `.env.local.example` to `.env.local`
3. **Run dev server**: `npm run dev`
4. **Open browser**: http://localhost:3000

## 📝 Notes

- All pages use Next.js 14 App Router
- Server components by default, client components marked with `'use client'`
- Path aliases configured in `jsconfig.json`
- TailwindCSS for styling
- Mock data in API routes (replace with real database)
- Authentication is placeholder (implement with NextAuth, Supabase, etc.)

## 🔗 Related Files

- [README.md](./README.md) - Main documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [.env.local.example](./.env.local.example) - Environment variables template

