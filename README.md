# Smart Solar Panel Cleaner

A modern IoT + Computer Vision web application for monitoring and cleaning solar panels with ML/DL-powered dirt/damage detection, built with Next.js 14, TailwindCSS, and FastAPI.

## 🏗️ Architecture

```
project-root/
│
├── app/                        # Next.js 13+ App Router
│   ├── layout.jsx              # Global layout
│   ├── page.jsx                # Home page (dashboard redirect)
│   │
│   ├── dashboard/              # Dashboard pages
│   │   ├── page.jsx            # Main dashboard (map of panels)
│   │   ├── PanelCard.jsx       # Component showing status of panel
│   │   └── PanelGrid.jsx       # Grid for all panels
│   │
│   ├── panel/[id]/             # Dynamic route for panel details
│   │   ├── page.jsx            # Panel details page
│   │   ├── HistoryChart.jsx    # Historical data chart
│   │   └── StatusBadge.jsx     # Status indicator
│   │
│   ├── upload/                 # Manual upload for admins
│   │   └── page.jsx            # Upload interface
│   │
│   ├── api/                    # API routes
│   │   ├── upload/route.js     # Cloudinary upload endpoint
│   │   ├── predict/route.js    # ML prediction endpoint
│   │   ├── panels/route.js     # Panels CRUD
│   │   └── panels/[id]/route.js# Single panel operations
│   │
│   └── auth/                   # Authentication
│       ├── login/page.jsx      # Login page
│       ├── register/page.jsx   # Registration page
│       └── middleware.js       # Auth middleware
│
├── components/                 # Reusable components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Footer.jsx
│   └── ui/                     # shadcn/ui components
│
├── lib/                        # Utility libraries
│   ├── cloudinary.js           # Cloudinary config & helpers
│   ├── fastapi.js              # FastAPI client
│   ├── validators.js           # Input validation
│   └── utils.js                # Misc utilities
│
├── public/                     # Static assets
│   └── icons/
│
├── styles/                     # Additional styles
│   └── globals.css             # TailwindCSS + custom styles
│
└── Configuration files
    ├── .env.local.example      # Environment variables template
    ├── tailwind.config.js      # Tailwind configuration
    ├── next.config.js          # Next.js configuration
    ├── postcss.config.js       # PostCSS configuration
    ├── jsconfig.json           # Path aliases
    └── package.json            # Dependencies
```

## 🚀 Features

- **Dashboard**: Real-time monitoring of all solar panels
- **Panel Details**: Detailed view with ML predictions and historical data
- **Image Upload**: Manual upload interface for testing
- **ML Integration**: FastAPI backend for predictions
- **Cloudinary**: Cloud-based image storage
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Authentication**: Login/Register pages (ready for integration)

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd Desktop/WEB_APP_SOLAR_PANEL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   - Cloudinary credentials
   - FastAPI URL
   - Database URL (if using)
   - Firebase Authentication credentials

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Styling**: TailwindCSS 3
- **Charts**: Recharts
- **Image Storage**: Cloudinary
- **ML Backend**: FastAPI (separate service)
- **HTTP Client**: Axios

## 📝 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# FastAPI backend
FASTAPI_URL=https://your-fastapi-backend-url
FASTAPI_API_TOKEN=xxxx

# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/smart_solar_panel_cleaner

#Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-name.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-name
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-name.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxxxxxxxxx:web:xxxxxxxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxxxxxxxxxxx
```

## 🔌 API Endpoints

### Frontend API Routes

- `POST /api/upload` - Upload image to Cloudinary
- `POST /api/predict` - Get ML prediction
- `GET /api/panels` - Get all panels
- `POST /api/panels` - Create new panel
- `GET /api/panels/[id]` - Get panel by ID
- `PUT /api/panels/[id]` - Update panel
- `DELETE /api/panels/[id]` - Delete panel

## 🎨 Customization

### Adding UI Components

This project is ready for shadcn/ui components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

### Styling

- Global styles: `styles/globals.css`
- Tailwind config: `tailwind.config.js`
- Custom utilities in `lib/utils.js`

## 📱 Pages

- `/` - Redirects to dashboard
- `/dashboard` - Main dashboard with panel grid
- `/panel/[id]` - Individual panel details
- `/upload` - Manual upload interface
- `/auth/login` - Login page
- `/auth/register` - Registration page

## 🔐 Authentication

The authentication system is set up with placeholder logic. To implement:

1. Choose an auth provider (NextAuth.js, Supabase, etc.)
2. Update `app/auth/middleware.js`
3. Add protected routes in `middleware.js` (root level)


## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

