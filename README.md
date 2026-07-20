# SecureAuth-T3-Starter (Nexus)

A production-ready Next.js application built with the T3 Stack, showcasing a robust, custom, and highly secure authentication system using **NextAuth.js (v5)**.

This project was built to demonstrate how to implement advanced authentication flows and security measures from scratch, without relying entirely on managed third-party services like Clerk or Auth0.

## 🚀 Key Features

### 🔐 Advanced Authentication
- **Custom Credentials Provider:** Fully custom email and password login system.
- **Secure Password Hashing:** Utilizes `bcryptjs` for secure password storage.
- **Email Verification Flow:** Users must verify their email addresses via secure, time-limited tokens before gaining access to the platform.
- **Password Reset Flow:** Built-in "Forgot Password" functionality that generates secure reset tokens and allows users to regain account access.
- **OAuth Integration:** Supports seamless third-party logins (e.g., Discord) alongside traditional credentials.

### 🛡️ Security & Performance
- **API Rate Limiting:** Custom in-memory rate limiting applied to sensitive endpoints (`/signup`, `/forgot-password`) to prevent brute-force and spam attacks.
- **Session Management:** Secure JWT-based session management managed seamlessly by NextAuth.js.
- **Database Architecture:** Uses **Prisma ORM** with a **Neon Serverless PostgreSQL** database. The schema is highly optimized with indexes on unique tokens and identifiers to ensure fast lookups.

### 💻 UI / UX 
- **Modern UI Design:** Built entirely with **Tailwind CSS**, featuring a clean, responsive layout with glassmorphism elements, dynamic gradients, and smooth hover animations.
- **Interactive Forms:** Features like "Show/Hide Password" toggles and immediate client-side error handling provide a premium user experience.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Authentication:** [NextAuth.js (Auth.js)](https://next-auth.js.org)
- **Database:** [Neon (Serverless Postgres)](https://neon.tech/)
- **ORM:** [Prisma](https://prisma.io)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Language:** TypeScript

## ⚙️ Getting Started

### Prerequisites
Make sure you have Node.js and npm installed. You will also need a PostgreSQL database (like Neon or Supabase) and a Discord Application (for OAuth).

### 1. Clone the repository
```bash
git clone https://github.com/MD-Kayesur/first-project-by-t3.git
cd first-project-by-t3
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following:
```env
# Database
DATABASE_URL="postgresql://username:password@your-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-secret"

# OAuth Providers (Optional)
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### 4. Setup Database
Push the Prisma schema to your database to create the necessary tables:
```bash
npm run db:push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 License
This project is open-source and available under the MIT License.
