# 💰 WealthAI — Full Stack AI Finance Platform

> A production-ready AI-powered personal finance platform built with Next.js 14, Supabase, Prisma, Inngest, ArcJet, and Google Gemini.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Prisma |
| **Auth** | Clerk |
| **UI** | Shadcn UI + Tailwind CSS |
| **Background Jobs** | Inngest |
| **Rate Limiting / Security** | ArcJet |
| **AI** | Google Gemini API |
| **Email** | Resend |


## ⚙️ Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# ──────────────────────────────────────────
# DATABASE (Supabase + Prisma)
# ──────────────────────────────────────────
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# ──────────────────────────────────────────
# AUTH (Clerk)
# ──────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# ──────────────────────────────────────────
# AI (Google Gemini)
# ──────────────────────────────────────────
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ──────────────────────────────────────────
# EMAIL (Resend)
# ──────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ──────────────────────────────────────────
# SECURITY (ArcJet)
# ──────────────────────────────────────────
ARCJET_KEY=ajkey_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Note:** `DATABASE_URL` uses the **pooled** connection string (port `6543`) for Prisma at runtime.  
> `DIRECT_URL` uses the **direct** connection string (port `5432`) for Prisma Migrate.

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
https://github.com/ankurchangani/Finance-web.git
cd Finance-web
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
# Fill in all values in .env
```

### 4. Set Up the Database

```bash
# Push Prisma schema to Supabase
npx prisma db push

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Run Inngest Dev Server (Background Jobs)

In a **separate terminal**:

```bash
npx inngest-cli@latest dev
```

This starts the Inngest local dev server at [http://localhost:8288](http://localhost:8288) and connects to your `/api/inngest` endpoint.

---

## 🗄️ Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  clerkUserId   String    @unique
  email         String    @unique
  name          String?
  imageUrl      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  transactions  Transaction[]
  budgets       Budget[]
}

model Account {
  id           String        @id @default(cuid())
  name         String
  type         AccountType
  balance      Decimal       @default(0)
  isDefault    Boolean       @default(false)
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Transaction {
  id                String            @id @default(cuid())
  type              TransactionType
  amount            Decimal
  description       String?
  date              DateTime
  category          String
  receiptUrl        String?
  isRecurring       Boolean           @default(false)
  recurringInterval RecurringInterval?
  nextRecurringDate DateTime?
  lastProcessed     DateTime?
  status            TransactionStatus @default(COMPLETED)
  userId            String
  user              User              @relation(fields: [userId], references: [id])
  accountId         String
  account           Account           @relation(fields: [accountId], references: [id])
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
}

model Budget {
  id              String   @id @default(cuid())
  amount          Decimal
  lastAlertSent   DateTime?
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum AccountType   { CURRENT SAVINGS }
enum TransactionType { INCOME EXPENSE }
enum TransactionStatus { PENDING COMPLETED FAILED }
enum RecurringInterval { DAILY WEEKLY MONTHLY YEARLY }
```

---

## ✨ Core Features

### 👤 User Onboarding
- New users are redirected to `/onboarding` after sign-up via Clerk
- A default **Current Account** is created automatically

### 🏦 Accounts
- Create multiple accounts (Current / Savings)
- Set one account as **default**
- View per-account transaction history and balance

### 💸 Transactions
- Add **income** or **expense** transactions
- Attach a **receipt image** — AI (Gemini) auto-scans and fills in fields
- Mark transactions as **recurring** with configurable intervals (Daily / Weekly / Monthly / Yearly)
- Filter and search transactions by date, category, and type

### 📊 Dashboard
- Overview of total balance, income, and expenses
- Monthly spending breakdown by category
- Budget progress bar with alert thresholds

### 🤖 AI Receipt Scanner
- Upload a receipt image on the transaction form
- Gemini Vision API extracts: amount, date, merchant, and category
- Fields are pre-filled automatically

### 📅 Recurring Transactions (Inngest)
- Background job runs daily to process due recurring transactions
- Auto-creates the next transaction and updates `nextRecurringDate`

### 📧 Budget Alerts (Inngest + Resend)
- Monthly budget can be set from the dashboard
- When spending reaches **80%** of budget, an alert email is sent via Resend
- Duplicate alerts are prevented using `lastAlertSent`

### 🛡️ Rate Limiting (ArcJet)
- API routes are protected against abuse and bot traffic
- Configurable rate-limit rules per route

---

## 🔌 Key Services Setup

### Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection String**
3. Copy the **Pooler** URL for `DATABASE_URL` and **Direct** URL for `DIRECT_URL`

### Clerk
1. Create an application at [clerk.com](https://clerk.com)
2. Copy **Publishable Key** and **Secret Key** from the dashboard
3. Under **Redirects**, confirm sign-in/sign-up redirect URLs match your `.env`

### Google Gemini
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key and paste it into `GEMINI_API_KEY`

### Resend
1. Create an account at [resend.com](https://resend.com)
2. Create an API key and paste into `RESEND_API_KEY`
3. Verify your sending domain (or use `onboarding@resend.dev` for testing)

### ArcJet
1. Create an account at [arcjet.com](https://arcjet.com)
2. Create a new site and copy the **API Key** into `ARCJET_KEY`

### Inngest
1. No account needed locally — just run `npx inngest-cli@latest dev`
2. For production, create an account at [inngest.com](https://inngest.com) and add your **Event Key** and **Signing Key** to environment variables

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma db push` | Sync schema to database |
| `npx prisma studio` | Open Prisma Studio GUI |
| `npx inngest-cli@latest dev` | Start Inngest local dev server |

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all `.env` variables under **Project → Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js

For Inngest in production:
- Register your app at `https://your-domain.com/api/inngest` inside the Inngest dashboard

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| `P1001: Can't reach database` | Check `DATABASE_URL` and Supabase project status |
| Clerk redirect loop | Confirm `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` is set to `/onboarding` |
| Gemini returns empty fields | Ensure receipt image is clear and `GEMINI_API_KEY` is valid |
| Inngest functions not triggering | Make sure `npx inngest-cli dev` is running and pointing to `localhost:3000` |
| ArcJet blocking requests | Check `ARCJET_KEY` is correct and your IP isn't in a blocked rule |
| Emails not sending | Verify domain in Resend dashboard or use test address |

---

## 📄 License

MIT — free to use and modify.

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

> Built with ❤️ using Next.js 14, Supabase, Prisma, Clerk, Inngest, ArcJet, Shadcn UI, and Google Gemini.
