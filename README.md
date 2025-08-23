# 💸 P2P Transaction App

A Peer-to-Peer money transfer application built with Node.js, Express.js, PostgreSQL, Prisma on the backend and Next.js (App Router), TypeScript, TailwindCSS on the frontend.

## 🚀 Features
- Authentication with JWT (login/register) and password hashing (bcrypt)
- User profile management (update name and password with old-password verification)
- Balance tracking
- Wallet management: add credit cards, top-up balance from cards (card balance decreases, user balance increases)
- Transaction history (sent, received, top-ups) with filters: last 10, last 1 month, last 3 months, and by type (all, transfer, top-up)
- Friends system: send & accept/reject requests, remove friends, send money directly from friends list, request money from friends
- Transactions: transfer money between users, view incoming/outgoing money requests, pay/reject/cancel requests
- Automatic balance & transaction history updates with SWR and optimistic UI
- Toast notifications for user feedback (Sonner)

## 🛠️ Tech Stack
- Backend: Node.js, Express.js, Prisma ORM, PostgreSQL, JWT, bcrypt
- Frontend: Next.js (App Router), TypeScript, TailwindCSS, SWR, Sonner

## ⚡ Getting Started
1. Clone & install
git clone https://github.com/ensaktrn/p2p-transaction-app.git

  cd p2p-transaction-app

- Backend

  cd backend npm install

- Frontend
  
  cd frontend npm install

2. Database setup  
Make sure PostgreSQL is running. Configure `.env` in backend:
DATABASE_URL="postgresql://user:password@localhost:5432/p2p_app"
JWT_SECRET="your-secret-key"

Run migrations & seed:
npx prisma migrate dev
npx prisma db seed

3. Start servers
- Backend: npm run dev → http://localhost:5001  
- Frontend: npm run dev → http://localhost:3000

## 🧪 Example API Requests
### Login
POST /auth/login
{
  "email": "test@example.com",
  "password": "123456"
}

### Transfer
POST /transfer
Authorization: Bearer <token>
{
  "receiverEmail": "friend@example.com",
  "amount": 100
}

### Top-up
POST /topup
Authorization: Bearer <token>
{
  "cardId": 1,
  "amount": 250
}

## 📌 Roadmap
- Authentication ✅  
- Top-up, Transfer, Transaction History ✅  
- Friends & Money Requests ✅  
- Advanced filters & search 🚧  
- Deployment (Backend → Render/Railway, Frontend → Vercel, DB → Supabase/Neon) 🚧  
- CI/CD with GitHub Actions 🚧  

## 👨‍💻 Author
Built by Enes Akturan.  
This project was developed as a study project to simulate a real-world P2P transaction system and to strengthen full-stack development skills.
