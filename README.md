# 🔐 Auth Project — Full-Stack Authentication System

A production-oriented authentication backend built with **Node.js, Express, Prisma, PostgreSQL, JWT, Google OAuth 2.0, bcrypt, Zod, Nodemailer, and modern security practices**.

This project was built to understand and implement a complete authentication system from the ground up, including traditional email/password authentication, Google authentication, protected routes, secure cookies, password reset, validation, rate limiting, and database persistence.

---

## 🚀 Project Overview

The goal of this project was to build a complete and reusable authentication system that can serve as the backend foundation for modern frontend applications.

The backend supports:

- User registration
- Secure password hashing
- User login
- JWT-based authentication
- HTTP-only cookies
- Protected routes
- Logout
- Google OAuth 2.0 authentication
- Forgot password flow
- Password reset using temporary tokens
- Email delivery using Nodemailer
- Request validation with Zod
- Rate limiting
- CORS configuration
- Security headers with Helmet
- PostgreSQL database
- Prisma ORM
- Database migrations
- Environment-based configuration

---

# ✨ Features

## 🔑 Authentication

### Register

Users can create an account using:

- Name
- Email
- Password

Passwords are never stored as plain text.

They are hashed using:

```text
bcrypt
```

---

### Login

Users can authenticate using their email and password.

The login process:

```text
Email + Password
        ↓
Find User
        ↓
Compare Password with bcrypt
        ↓
Generate JWT
        ↓
Store Token in HTTP-only Cookie
        ↓
Authenticated User
```

---

### Google OAuth

Users can also authenticate using:

```text
Continue with Google
```

The application uses:

```text
Google OAuth 2.0
Passport.js
passport-google-oauth20
```

The OAuth flow:

```text
Frontend
   ↓
/auth/google
   ↓
Google
   ↓
User Authentication
   ↓
Google Callback
   ↓
Find/Create User
   ↓
Generate JWT
   ↓
Authentication Cookie
```

---

# 🍪 Authentication with HTTP-only Cookies

Authentication tokens are stored using:

```text
HTTP-only Cookies
```

instead of storing sensitive authentication tokens in:

```text
localStorage
```

This helps reduce the risk of client-side JavaScript directly accessing the authentication token.

Cookie-based authentication is used to provide a safer authentication mechanism for the frontend application.

---

# 🛡️ Protected Routes

Protected routes use authentication middleware.

Example:

```text
GET /user/profile
```

The authentication middleware:

```text
Request
   ↓
Read Authentication Cookie / Token
   ↓
Verify JWT
   ↓
Decode User Information
   ↓
Attach User to Request
   ↓
next()
```

The authenticated user becomes available through:

```js
req.user
```

---

# 🚪 Logout

Logout removes the authentication cookie from the browser.

The user account itself is **not deleted from the database**.

This follows the normal distinction between:

```text
Logout
≠
Delete Account
```

The user's database record remains available for future login.

---

# 🔄 Forgot Password

The project includes a complete password recovery flow.

```text
Forgot Password
       ↓
Enter Email
       ↓
Generate Secure Reset Token
       ↓
Store Token in Database
       ↓
Set Expiration Time
       ↓
Send Reset Email
       ↓
User Opens Reset Link
       ↓
Submit New Password
       ↓
Hash New Password
       ↓
Update User
       ↓
Delete Reset Token
```

Reset tokens are:

- Randomly generated
- Stored in PostgreSQL
- Associated with the user
- Time-limited
- Deleted after successful password reset

---

# 📧 Email Service

The project uses:

```text
Nodemailer
```

to send password reset emails through Gmail SMTP.

Email credentials are stored in environment variables and never committed to the repository.

Example:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

# ✅ Request Validation

The API uses:

```text
Zod
```

for validating incoming request data.

Validation is used to make sure the backend receives the expected data before processing requests.

Example concepts covered:

- Required fields
- Email validation
- Password validation
- Request body validation
- Validation error handling

---

# 🔐 Password Security

Passwords are hashed using:

```text
bcrypt
```

Example:

```js
const hashedPassword = await bcrypt.hash(password, 10)
```

During login:

```js
const isMatch = await bcrypt.compare(password, user.password)
```

The original password is never stored in the database.

---

# 🎫 JWT Authentication

The project uses:

```text
JSON Web Tokens (JWT)
```

to represent authenticated users.

A token contains basic user information such as:

```json
{
  "id": 123,
  "email": "user@example.com"
}
```

The token is signed using a secret stored in:

```env
JWT_SECRET=your-secret
```

Tokens also have an expiration time.

---

# ⏱️ Rate Limiting

The login endpoint is protected with:

```text
express-rate-limit
```

This limits repeated login attempts within a specific time window.

Example configuration:

```text
10 login attempts
within 15 minutes
```

This helps reduce brute-force login attempts.

---

# 🛡️ Security Headers

The project uses:

```text
Helmet
```

to configure common HTTP security headers.

This adds an additional security layer to the Express application.

---

# 🌐 CORS

The backend uses:

```text
CORS
```

to control which frontend applications are allowed to communicate with the API.

This becomes especially important when the frontend and backend are deployed separately.

---

# 🗄️ Database

The project uses:

```text
PostgreSQL
```

as the relational database.

Database operations are handled through:

```text
Prisma ORM
```

---

# 🧬 Prisma ORM

Prisma is used for:

- Database queries
- Creating users
- Finding users
- Updating users
- Deleting records
- Relationships
- Database migrations
- Type-safe database access

Example:

```js
const user = await prisma.user.findUnique({
  where: {
    email,
  },
})
```

---

# 🔄 Database Migrations

Prisma migrations are used to keep the database schema synchronized with the application.

Example:

```bash
npx prisma migrate dev --name add_password_reset_tokens
```

The project includes a dedicated:

```text
PasswordResetToken
```

model for password recovery.

---

# 🧱 Database Models

## User

Stores user information such as:

- ID
- Name
- Email
- Password
- Google ID
- Creation date

## PasswordResetToken

Stores:

- Token
- User ID
- Expiration date
- Creation date

The reset token is related to the user through a Prisma relation.

---

# 📡 API Endpoints

## Authentication

### Register

```http
POST /auth/register
```

Example:

```json
{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "password": "Password123"
}
```

---

### Login

```http
POST /auth/login
```

Example:

```json
{
  "email": "ahmed@example.com",
  "password": "Password123"
}
```

---

### Google Login

```http
GET /auth/google
```

Google handles authentication and redirects the user back to the backend callback.

---

### Forgot Password

```http
POST /auth/forgot-password
```

Example:

```json
{
  "email": "ahmed@example.com"
}
```

---

### Reset Password

```http
POST /auth/reset-password
```

Example:

```json
{
  "token": "reset-token",
  "password": "NewPassword123"
}
```

---

### Logout

```http
POST /auth/logout
```

Removes the authentication cookie.

---

## User

### Get Profile

```http
GET /user/profile
```

Requires authentication.

Example response:

```json
{
  "message": "Profile data",
  "user": {
    "id": 1,
    "email": "ahmed@example.com"
  }
}
```

---

# 📁 Project Structure

```text
auth-project/
│
├── client/
│
├── server/
│   │
│   ├── config/
│   │   └── prisma.js
│   │
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   ├── emailService.js
│   │   └── googleStrategy.js
│   │
│   ├── src/
│   │   └── server.js
│   │
│   ├── utils/
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# 🧠 Concepts Learned & Applied

This project was not only about building authentication. It was also used to practice important backend concepts.

## Node.js

- ES Modules
- `import` / `export`
- Environment variables
- `process.env`
- Built-in `crypto` module
- Asynchronous programming
- `async/await`
- Promises
- npm packages

---

## Express.js

- Express application setup
- Middleware
- Routers
- Controllers
- Route handlers
- Request / Response
- HTTP status codes
- JSON requests
- Protected routes
- Error handling

---

## Authentication

- Authentication vs Authorization
- Password hashing
- bcrypt
- JWT
- JWT verification
- HTTP-only cookies
- Sessions vs stateless authentication
- OAuth 2.0
- Google OAuth
- Logout
- Password recovery

---

## Database

- PostgreSQL
- Relational databases
- Tables
- Primary keys
- Unique constraints
- Foreign keys
- Relationships
- Prisma ORM
- Prisma Client
- Prisma Studio
- Prisma migrations

---

## Security

- Password hashing
- HTTP-only cookies
- JWT expiration
- Environment variables
- CORS
- Helmet
- Rate limiting
- Brute-force protection
- Secure reset tokens
- Token expiration
- Generic authentication error messages
- Protection against email/account enumeration

---

## Backend Architecture

The project follows a basic separation of responsibilities:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Database
```

This makes the application easier to maintain and extend.

---

# 🧪 Testing

The API was tested manually using:

```text
Thunder Client
```

Tested flows include:

- Register
- Duplicate registration
- Login
- Invalid credentials
- Protected profile route
- Logout
- Google authentication
- Forgot password
- Email delivery
- Reset password
- Expired reset token
- Rate limiting

---

# ⚙️ Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=3000

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/auth_project"

JWT_SECRET="your-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"

EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

Never commit `.env` to GitHub.

---

# ▶️ Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd auth-project
```

## 2. Install backend dependencies

```bash
cd server
npm install
```

## 3. Configure environment variables

Create:

```text
.env
```

and add the required variables.

## 4. Run Prisma migrations

```bash
npx prisma migrate dev
```

## 5. Start the backend

```bash
npm run dev
```

The API will run on:

```text
http://localhost:3000
```

---

# 🗃️ Prisma Studio

To inspect the database:

```bash
npx prisma studio
```

Prisma Studio provides a visual interface for viewing and managing database records during development.

---

# 🔄 Authentication Flow

```text
                    ┌───────────────┐
                    │    Client     │
                    └───────┬───────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │     Express      │
                  └────────┬─────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
         Register        Login       Google OAuth
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                     ┌───────────┐
                     │  Prisma   │
                     └─────┬─────┘
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    └─────────────┘
                           │
                           ▼
                       JWT Token
                           │
                           ▼
                   HTTP-only Cookie
                           │
                           ▼
                    Protected Routes
```

---

# 🔑 Password Recovery Flow

```text
User
 │
 ▼
Forgot Password
 │
 ▼
Backend
 │
 ├── Find User
 │
 ├── Generate Secure Token
 │
 ├── Store Token
 │
 └── Send Email
          │
          ▼
      Reset Link
          │
          ▼
    Reset Password
          │
          ▼
    Hash New Password
          │
          ▼
      Update User
          │
          ▼
    Delete Reset Token
```

---

# 🎯 Project Goals

The main goals of this project were to gain practical experience with:

- Building REST APIs
- Designing authentication systems
- Working with relational databases
- Using Prisma ORM
- Implementing JWT authentication
- Implementing OAuth authentication
- Handling cookies securely
- Sending transactional emails
- Validating API input
- Protecting APIs against common attacks
- Structuring a backend application
- Working with database migrations
- Testing APIs manually
- Preparing a backend for frontend integration

---

# 🚀 Future Improvements

Possible future improvements include:

- Refresh token rotation
- Email verification
- Role-based authorization
- Account deletion
- Two-factor authentication
- Redis-based rate limiting
- Production email provider
- Automated tests
- API documentation with Swagger/OpenAPI
- Docker deployment
- CI/CD

These are intentionally outside the current project scope.

---

# 👨‍💻 Author

**Omar Salama**

Software Developer focused on building modern web applications with JavaScript, React, Next.js, Node.js, and TypeScript.

---

## ⭐ Project Status

**Completed — Backend Authentication System**

The backend is ready to be consumed by a frontend application.

Built with ❤️ to strengthen practical backend development skills.
