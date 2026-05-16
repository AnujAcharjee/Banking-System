# NovaBank — Full-Stack Banking System

> Software Engineering Lab Project | Next.js 15 + Neon DB + Prisma ORM

## Tech Stack

- **Framework**: Next.js 15 (App Router, `src/` dir)
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **Auth**: JWT via `jose` (stored in HTTP-only cookies)
- **Styling**: Tailwind CSS (orange + white theme)
- **UI**: Custom components with smooth transitions

## Features

- ✅ JWT-based authentication (signup / signin / signout)
- ✅ Auto-generated `NOVA########` account numbers on signup
- ✅ Multi-step KYC signup (Name, Phone, Address, PAN, Aadhaar)
- ✅ Forgot password via Account No + Phone → OTP → Reset
- ✅ Credit, Debit, Transfer transactions (atomic DB transactions)
- ✅ Transaction history with pagination and type filters
- ✅ User dashboard with balance card and recent activity
- ✅ Passbook page with search + filter
- ✅ Profile page with masked KYC info
- ✅ Middleware-based route protection
- ✅ Responsive, animated UI (orange/white)

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/signin` | No | Sign in |
| POST | `/api/auth/signout` | No | Sign out (clears cookie) |
| GET | `/api/auth/me` | Yes | Get session info |
| POST | `/api/auth/forgot-password` | No | Request OTP |
| POST | `/api/auth/reset-password` | No | Reset with OTP |
| GET | `/api/account/details` | Yes | Full user + account info |
| GET | `/api/account/balance` | Yes | Current balance |
| POST | `/api/transactions/credit` | Yes | Credit amount |
| POST | `/api/transactions/debit` | Yes | Debit amount |
| POST | `/api/transactions/transfer` | Yes | Transfer to account |
| GET | `/api/transactions/history` | Yes | Paginated history |

## Setup

### 1. Clone and install
```bash
git clone <your-repo>
cd banking-app
bun install
```

### 2. Set up Neon DB
1. Go to [console.neon.tech](https://console.neon.tech) and create a project
2. Copy the connection string

### 3. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-long-random-secret"
```

### 4. Push Prisma schema to DB
```bash
bunx prisma generate
bunx prisma db push
```

### 5. Run development server
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth/signup` | Multi-step registration |
| `/auth/signin` | Login with account no + password |
| `/auth/forgot-password` | OTP-based password reset |
| `/dashboard` | Main dashboard with balance + quick actions |
| `/dashboard/profile` | Account & KYC info |
| `/passbook` | Full transaction history with filters |

## Notes for Lab

- In development, OTP is returned in the API response (`devOtp` field) — **remove in production**
- Passwords are hashed with bcrypt (12 rounds)
- All banking operations use Prisma `$transaction` for atomicity
- JWT tokens expire in 7 days, stored in `httpOnly` cookies
