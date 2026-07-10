# [🛒 Pantry — E-Commerce Platform](https://pantry-eight-henna.vercel.app/)

Live URL: https://pantry-eight-henna.vercel.app/ 

A full-featured online grocery store built with Next.js 16 (App Router), featuring product browsing, cart/wishlist management, user authentication, address management, Stripe payments, and an admin dashboard.

## ✨ Features

### Customer Features
- **Product Catalog** — Browse products by category, search by keyword, filter by price/rating, sort by name/price/newest
- **Product Details** — Image gallery (Swiper), ratings & reviews with verified purchase badges
- **Shopping Cart** — Real-time cart state via React Context, quantity controls, subtotal/shipping calculation
- **Wishlist** — Save products for later with real-time heart icon toggle
- **User Authentication** — Email/password registration + login, Google OAuth, JWT-based sessions with httpOnly cookies
- **Profile Management** — Update name, change password, upload avatar (Cloudinary)
- **Address Management** — Add/edit/delete delivery addresses with default selection
- **Checkout** — Address selection, payment method choice (COD or Credit/Debit Card via Stripe Elements)
- **Order Management** — My Orders page with pagination + status filter, Order Detail page with line items + shipping info
- **Password Reset** — Forgot/reset password flow with email (SMTP optional, falls back to console logging)
- **Reviews & Ratings** — Users can submit reviews (with duplicate check), mark reviews as helpful

### Admin Dashboard
- **Dashboard Overview** — Stats cards (users, products, orders, revenue, pending orders, low stock)
- **Product Management** — Full CRUD with image upload, category assignment, featured/popular/latest/active toggles
- **Category Management** — Full CRUD with image upload
- **Order Management** — View all orders, update order status, filter by status/payment status
- **User Management** — Paginated user list with role badges and join dates

### Technical Highlights
- MongoDB + Mongoose with transactions for order creation (stock deduction + cart clear)
- Stripe Payment Intents for card payments (COD fallback)
- Cloudinary for image uploads (separate admin route for products/categories, avatar route for users)
- Structured JSON logging, error handler utility, AppError classes
- Vercel Analytics + Speed Insights
- Custom 404/500 error pages, global error boundary
- SEO: sitemap.xml, robots.txt, JSON-LD structured data, Open Graph / Twitter meta tags
- Image optimization: Next.js `<Image>` with Cloudinary remote patterns, AVIF+WebP formats, device-aware breakpoints

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | MongoDB + Mongoose ODM |
| **Styling** | Tailwind CSS 4 + MUI 9 |
| **Auth** | JWT (jsonwebtoken), Google OAuth (@react-oauth/google) |
| **Payments** | Stripe (Payment Intents), Stripe Elements |
| **File Upload** | Cloudinary |
| **Email** | Nodemailer (SMTP) |
| **Forms** | react-hook-form + Zod validation |
| **Carousel** | Swiper 12 |
| **UI** | Sonner (toasts), react-range-slider-input |
| **Analytics** | @vercel/analytics, @vercel/speed-insights |
| **Package Manager** | pnpm |

## 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/pantry.git
cd pantry

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# 4. Seed the database (optional - creates categories, products, reviews)
pnpm run seed

# 5. Start the development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|---|---|
| `pnpm run dev` | Start development server with Turbopack |
| `pnpm run build` | Production build |
| `pnpm run start` | Start production server |
| `pnpm run lint` | Run ESLint |
| `pnpm run seed` | Seed database with sample data |

## 🌍 Environment Variables

Copy `.env.example` to `.env` and fill in the values. Required variables:

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | JWT signing secret (min 32 characters) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name (server) |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name (client) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Stripe publishable key |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `GOOGLE_CLIENT_ID` | For Google auth | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google auth | Google OAuth client secret |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | For Google auth | Google OAuth client ID (client) |
| `EMAIL_HOST` | Optional | SMTP host (e.g. smtp.gmail.com) |
| `EMAIL_PORT` | Optional | SMTP port (default 587) |
| `EMAIL_USER` | Optional | SMTP username |
| `EMAIL_PASSWORD` | Optional | SMTP password |
| `NEXT_PUBLIC_APP_URL` | Recommended | Public app URL for links/sitemap/SEO |

## 🚀 Deployment

### Vercel

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set all environment variables in the Vercel project dashboard
4. The `build` script runs automatically — no additional config needed
5. Vercel Analytics and Speed Insights will auto-enable once deployed

### Manual (Docker / Node)

```bash
# Build
pnpm run build

# Start
pnpm run start
```

The server runs on port 3000 by default. Set `PORT` environment variable to change it.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages + API routes
│   ├── api/                # REST API endpoints
│   │   ├── admin/          # Admin-only endpoints
│   │   ├── auth/           # Authentication endpoints
│   │   ├── cart/           # Cart CRUD
│   │   ├── checkout/       # Checkout
│   │   ├── orders/         # Orders
│   │   ├── payments/       # Stripe payments
│   │   ├── products/       # Public product endpoints
│   │   ├── reviews/        # Product reviews
│   │   └── upload/         # Avatar upload
│   ├── admin/              # Admin panel pages
│   ├── my-orders/          # Customer order history
│   └── order/              # Order detail page
├── components/             # Shared React components
│   ├── admin/              # Admin-specific components
│   ├── ui/                 # Generic UI components
│   └── Checkout/           # Checkout-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── api-response.ts     # API response helpers
│   ├── auth.ts             # JWT verification/signing
│   ├── cloudinary.ts       # Cloudinary upload/delete
│   ├── db.ts               # MongoDB connection
│   ├── email.ts            # Nodemailer email sending
│   ├── error.ts            # AppError classes + errorHandler
│   └── logger.ts           # Structured JSON logger
├── models/                 # Mongoose schemas
├── providers/               # React Context providers
├── repositories/           # Data access layer (query builders)
├── services/               # Business logic layer
├── types/                  # TypeScript type definitions
└── validations/            # Zod validation schemas
```

## 🔒 Security

- Passwords hashed with bcryptjs (12 rounds)
- JWT tokens stored in httpOnly cookies (not localStorage)
- Password reset tokens stored as SHA-256 hashes (plain token only in email URL)
- No user enumeration on forgot-password (generic response)
- Admin routes protected by `authorizeAdmin` middleware
- API routes protected by `verifyAccessToken` middleware
- Avatar/image upload routes separated (admin vs user) to prevent cross-contamination
- `poweredByHeader: false` removes `X-Powered-By` header

## 🤝 Contact
**Mahin Hasan** *Full-Stack Web Developer | Shopify Expert*

[📧 Email](mailto:hasan.mahin527@gmail.com) | 
[💬 Messenger](https://m.me/md.mahin.hassan.738742) | 
[🎮 Discord Server](https://discord.gg/QKB7XMezg) (Username: `mahin527`)

----

## 📄 License

MIT — see [LICENSE](LICENSE) for details.
