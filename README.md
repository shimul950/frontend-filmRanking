<div align="center">

  <img src="./public/logo.png" alt="FilmRank Logo" width="120" style="border-radius: 20px; box-shadow: 0 10px 25px rgba(229, 9, 20, 0.4);" />

  # 🎬 FILMRANK — Cinema Hub
  
  **The ultimate social cinema ranking, review tracking, and media catalogue management platform.**

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-E50914?style=for-the-badge&logo=vercel&logoColor=white)](https://frontend-film-ranking.vercel.app/)
  [![Next.js 16](https://img.shields.io/badge/Next.js-16.1.7-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React 19](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

  ---

  🌐 **Live Website:** [https://frontend-film-ranking.vercel.app/](https://frontend-film-ranking.vercel.app/)

</div>

<br />

## 📖 About The Project

**FilmRank** is a modern social cinema platform designed for film lovers, casual viewers, and content curators. It provides an immersive cinematic experience where users can discover trending movies and episodic web series, track their watchlists, rate films, and publish in-depth critic reviews.

Alongside the user-facing hub, FilmRank features a full-fledged **Admin Command Center** for studios and administrators to manage cinema libraries, episodic series, casts, directors, hero spotlight banners, user access controls, and platform metrics.

---

## 🌟 Key Features

### 🍿 Cinephile & Audience Features
- **Curated Cinema Catalog:** Browse top-rated movies and web series with synopsis, trailers, release metadata, genres, streaming platforms, and cast directories.
- **Smart Instant Search:** Fast real-time autocomplete search for films, series, and genres across the entire database.
- **Social Reviews & Community Ratings:** Read authentic user reviews, post detailed feedback, and leave star ratings.
- **Watchlist & Favorites:** Save films to custom watchlists and track watch history.
- **Personal Profile Management:** Editable user accounts with real-time profile picture uploads and credentials management.

### 🛡️ Admin & Studio Command Center
- **Executive Analytics:** High-level overview of revenue metrics, cinephile community counts, catalogue size, active hero slides, and review sentiment.
- **Movie & Series Lifecycle Management:** Full creation and editing workflows with poster uploads, cast/director tagging, and episodic season breakdown.
- **Hero Spotlight Banners:** Control dynamic top-of-homepage carousel banners and promotional launches.
- **Cast & Director Directories:** Dedicated management for cinema performers and visionary auteurs.
- **Access Control & User Directory:** Monitor registered users, inspect account verifications, adjust administrative roles (`USER`, `ADMIN`, `SUPER_ADMIN`), and suspend/activate accounts.
- **Taxonomy Administration:** Manage dynamic genres, streaming platform links, and movie tags.

---

## 📸 Platform Screenshots

### 1. Admin Command Center Overview
Comprehensive platform overview showing real-time revenue analytics, member counts, media catalogue stats, and quick actions.

![Admin Command Center](./public/screenshots/admin-dashboard.png)

---

### 2. User Directory & Access Control
Manage user accounts, monitor verification status, and assign administrative or standard roles.

![User Management](./public/screenshots/user-management.png)

---

### 3. Episodic Series & Media Management
Register television and streaming series with poster uploads, season breakdowns, and release parameters.

![Web Series Management](./public/screenshots/web-series-management.png)

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| **Core UI Library** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) |
| **Form Handling & Validation** | [TanStack React Form](https://tanstack.com/form), [Zod](https://zod.dev/) |
| **Data Fetching & State** | [TanStack React Query v5](https://tanstack.com/query), [Axios](https://axios-http.com/) |
| **Media & CDN Storage** | [ImageKit](https://imagekit.io/), [Cloudinary](https://cloudinary.com/) |
| **Authentication & RBAC** | JWT Auth, Better-Auth Cookie Relay, Next.js Proxy Middleware |
| **Database** | PostgreSQL via Prisma Accelerate |
| **Hosting & Deployment** | [Vercel](https://vercel.com/) (Frontend) & [Render](https://render.com/) (Backend API) |

---

## 📁 Project Structure

```text
frontend-model-filmranking/
├── components/
│   ├── modules/            # Domain-specific feature modules
│   │   ├── auth/           # Login, registration, profile forms
│   │   ├── dashboard/      # Admin & user dashboard views & tables
│   │   ├── movies/         # Movie browsing, search & card components
│   │   └── home/           # Homepage hero banners, trending sections
│   ├── shared/             # Reusable UI widgets, Logo, Navbar, Footer
│   └── ui/                 # Shadcn / Radix primitives (dialog, button, etc.)
├── lib/
│   ├── axios/              # Centralized HTTP client
│   ├── cookie-relay.ts     # Cookie handling between Next.js & backend
│   ├── db.ts               # Direct PostgreSQL pool fallback
│   ├── imagekit-upload.ts  # CDN direct upload helpers
│   └── utils.ts            # Class merging & formatting utilities
├── public/
│   ├── screenshots/        # Application preview images
│   ├── logo.png            # Rendered brand mark
│   └── logo.svg            # Scalable vector logo
├── src/
│   ├── app/                # Next.js App Router (Routes & Server Actions)
│   │   ├── (commonRoute)/  # Public catalog & auth routes
│   │   ├── (dashboardRoute)/# Protected user & admin dashboards
│   │   └── proxy.ts        # Route guard & RBAC middleware
│   ├── providers/          # React Query & Theme providers
│   ├── types/              # TypeScript interface definitions
│   └── zod/                # Runtime validation schemas
└── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: `20.x` or higher
- **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`

### 1. Clone the repository
```bash
git clone https://github.com/shimul950/frontend-filmRanking.git
cd frontend-filmRanking
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development

# Backend REST API
NEXT_PUBLIC_API_BASE_URL=https://backend-model-filmranking.onrender.com/api/v1

# Authentication Secrets
ACCESS_TOKEN_SECRET=your_jwt_access_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
JWT_ACCESS_SECRET=your_jwt_access_secret

# Database
DATABASE_URL="postgres://username:password@host:5432/dbname?sslmode=require"

# ImageKit Storage
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
```

### 4. Run the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
pnpm build
pnpm start
```

---

## 🌐 Deployment to Vercel

When deploying to [Vercel](https://vercel.com/):

1. **Framework Preset:** Select `Next.js`.
2. **Root Directory:** `./` (default).
3. **Node.js Version:** Set to `20.x` or `22.x` under **Settings > General**.
4. **Environment Variables:** Add the keys defined in the `.env` section above.
5. Deploy! 🚀

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
