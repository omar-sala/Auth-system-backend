# 🔐 Auth System — Full-Stack Authentication

A production-oriented full-stack authentication system built with **React, TypeScript, Node.js, Express, Prisma, PostgreSQL, JWT, Google OAuth 2.0, bcrypt, Zod, Nodemailer, and modern security practices**.

🔗 **Live Frontend:** https://auth-system-backend-89re.vercel.app

The project was built from scratch to understand how a complete authentication system works in both development and production environments.

---

## 🚀 Features

- 🔑 Register & Login with Email/Password
- 🔒 Password hashing with **bcrypt**
- 🎫 JWT authentication
- 🍪 HTTP-only cookies
- 🛡️ Protected routes & authentication middleware
- 🔵 Google OAuth 2.0 with Passport.js
- 🚪 Logout
- 🔄 Forgot & Reset Password
- 📧 Password reset emails with Nodemailer
- ✅ Request validation with Zod
- ⏱️ Login rate limiting
- 🛡️ Security headers with Helmet
- 🌐 CORS configuration
- 🗄️ PostgreSQL database
- 🧬 Prisma ORM & migrations
- 🌍 Environment-based configuration
- ⚛️ React + TypeScript frontend
- 📡 Axios API integration

---

## 🔑 Authentication Flow

### Email / Password

```text
Register
   ↓
Validate with Zod
   ↓
Hash password with bcrypt
   ↓
Save user with Prisma
   ↓
Login
   ↓
Verify password
   ↓
Generate JWT
   ↓
HTTP-only Cookie
   ↓
Protected Routes
```

### Google OAuth

```text
Frontend
   ↓
/auth/google
   ↓
Google OAuth
   ↓
Google Callback
   ↓
Find/Create User
   ↓
Generate JWT
   ↓
HTTP-only Cookie
   ↓
Redirect to Frontend
```

Google authentication uses:

- Passport.js
- `passport-google-oauth20`
- Google OAuth 2.0

---

## 🍪 Cookie-Based Authentication

Authentication tokens are stored in **HTTP-only cookies** instead of `localStorage`.

The frontend uses Axios with:

```js
withCredentials: true
```

This allows cookies to be sent with API requests while preventing normal client-side JavaScript from directly reading the authentication cookie.

---

## 🛡️ Protected Routes

Authentication middleware:

```text
Request
  ↓
Read Cookie
  ↓
Verify JWT
  ↓
Decode User
  ↓
req.user
  ↓
next()
```

Example:

```http
GET /auth/me
```

The authenticated user's information is returned from PostgreSQL.

---

## 🔄 Password Reset

```text
Forgot Password
      ↓
Generate Secure Token
      ↓
Store Token + Expiration
      ↓
Send Email with Nodemailer
      ↓
User Opens Reset Link
      ↓
Validate Token
      ↓
Hash New Password
      ↓
Update User
      ↓
Delete Reset Token
```

Reset tokens are temporary, random, and removed after successful use.

---

## 🗄️ Database

### PostgreSQL

Used as the relational database.

### Prisma

Used for:

- Database queries
- CRUD operations
- Relations
- Schema management
- Migrations
- Type-safe database access
- Prisma Studio

Main models include:

### `User`

- `id`
- `name`
- `email`
- `password`
- `googleId`
- `createdAt`

### `PasswordResetToken`

- `token`
- `userId`
- `expiresAt`
- `createdAt`

---

## 📡 API Endpoints

### Authentication

```http
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me

GET  /auth/google
GET  /auth/google/callback

POST /auth/forgot-password
POST /auth/reset-password
```

### User

Protected user routes are handled through authentication middleware and JWT verification.

---

## 🛡️ Security

The project applies several common backend security practices:

- **bcrypt** → password hashing
- **JWT** → authentication
- **HTTP-only cookies** → token protection
- **Helmet** → security headers
- **CORS** → frontend/API access control
- **express-rate-limit** → brute-force protection
- **Zod** → input validation
- **Secure random tokens** → password reset
- **Token expiration**
- **Environment variables** → secrets management
- Generic authentication errors to reduce account/email enumeration

---

## 🧠 Technologies & Concepts Learned

### Node.js

- ES Modules
- `import` / `export`
- npm & packages
- Environment variables
- `process.env`
- Async/Await
- Promises
- `crypto`

### Express.js

- Application setup
- Middleware
- Routers
- Controllers
- Request / Response
- Status codes
- REST API
- Error handling
- Protected routes

### Authentication

- Authentication vs Authorization
- bcrypt
- JWT
- Cookies
- HTTP-only cookies
- Stateless authentication
- OAuth 2.0
- Google OAuth
- Passport.js
- Password recovery

### Database

- PostgreSQL
- Primary keys
- Unique constraints
- Foreign keys
- Relationships
- Prisma ORM
- Prisma Client
- Prisma migrations
- Prisma Studio

### Security

- CORS
- Helmet
- Rate limiting
- Password hashing
- Secure cookies
- JWT expiration
- Secure reset tokens
- Environment variables

### Frontend

- React
- TypeScript
- React Router
- Axios
- Context API
- Protected/Guest Routes
- Environment variables with Vite

---

## 🧪 Testing

The API was manually tested using **Thunder Client**.

Tested:

- Registration
- Duplicate registration
- Login
- Invalid credentials
- Logout
- Protected routes
- Google OAuth
- Forgot password
- Reset password
- Expired reset tokens
- Rate limiting

---

## 📁 Project Structure

```text
auth-project/
│
├── client/
│   ├── src/
│   ├── .env
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── src/
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Backend

```env
PORT=3000
DATABASE_URL="your-postgresql-url"
JWT_SECRET="your-secret"

GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"

FRONTEND_URL="http://localhost:5173"

EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

### Frontend

```env
VITE_API_URL=http://localhost:3000
```

Production values are configured separately through **Vercel Environment Variables**.

`.env` files containing secrets are never committed to GitHub.

---

## ▶️ Run Locally

### Backend

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

Backend:

```text
http://localhost:3000
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Prisma Studio

```bash
npx prisma studio
```

---

## 🚀 Deployment

The project was configured to work in both **Local** and **Production** environments.

### Production

- Frontend → Vercel
- Backend → Vercel
- Database → PostgreSQL
- Google OAuth → Google Cloud
- Environment variables → Vercel

The same codebase works locally and in production by changing environment variables instead of changing the application code.

---

## 🎯 What This Project Taught Me

This project gave me practical experience building a complete authentication system from scratch, including:

- Designing REST APIs
- Structuring an Express backend
- Connecting PostgreSQL with Prisma
- Implementing email/password authentication
- Implementing JWT authentication
- Working with HTTP-only cookies
- Integrating Google OAuth
- Building password reset functionality
- Sending emails
- Validating requests
- Applying backend security practices
- Managing database migrations
- Connecting a React frontend to a backend API
- Handling CORS and credentials
- Configuring Local and Production environments
- Deploying a full-stack application

---

## 👨‍💻 Author

**Omar Salama**

Software Developer focused on building modern web applications with **React, Next.js, TypeScript, Node.js, and Express**.

---

## ⭐ Project Status

**Completed — Full-Stack Authentication System**

Built with ❤️ as a practical backend and full-stack learning project.
