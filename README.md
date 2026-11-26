# TechVerse — Full-stack e-commerce demo

TechVerse is a portfolio demonstration of a modern technology storefront. It includes a responsive React/Vite client, product discovery, persistent cart state, a simulated checkout flow, customer account screens, and an optional Express/Prisma API for database-backed authentication, products, and order management.

> **Demo notice:** The default checkout is intentionally simulated. It stores a sample order in the browser's local storage and does not collect payment information, charge a card, or create a shipment. The storefront can be explored without running the backend because it falls back to a local sample catalog when the API is unavailable.

## Stack

- React 19 and Vite 8
- React Router
- Context API and local storage for cart state
- Node.js and Express 5 API
- Prisma 7 with PostgreSQL and the PostgreSQL driver adapter
- bcryptjs and JSON Web Tokens for customer/admin authentication
- Optional Stripe integration on the backend (disabled without a secret key)

## Run the storefront

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Product browsing, search, category filters, sorting, product details, cart quantity controls, and simulated checkout work without a database.

## Run the backend (optional)

1. Create a PostgreSQL database.
2. Copy `backend/.env.example` to `backend/.env` and fill in the database URL, a long random JWT secret, and admin credentials. Generate a bcrypt password hash for `ADMIN_PASSWORD_HASH`; never put a plain-text admin password in the environment file.
3. Install backend dependencies and generate the Prisma client:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run start
```

The API listens on port `5001` by default. Set `VITE_API_URL` in a root `.env` file if the API is hosted somewhere other than `http://localhost:5001`.

To populate sample products in the database:

```bash
cd backend
npx prisma db seed
```

The seed script replaces existing products, so use it only with a development database.

## Main routes

| Route | Purpose |
|---|---|
| `/` | Storefront, search, category filters, sorting |
| `/products/:id` | Product details |
| `/cart` | Persistent shopping cart |
| `/checkout` | Simulated demo checkout |
| `/confirmation` | Local demo order receipt |
| `/login`, `/register`, `/account` | Optional customer account flows (backend required) |
| `/admin-login`, `/admin` | Optional admin product/order management (backend required) |

## Configuration and safety

- Never commit `.env`, database credentials, JWT secrets, Stripe keys, or real customer data.
- `.env.example` contains placeholders only.
- The demo checkout is not a payment processor. Stripe must be configured separately before any real payment workflow is considered, and the current sample success/cancel URLs must be changed for a deployed environment.
- Use test data and a local or isolated database when evaluating authentication, authorization, validation, and other security properties.
- Do not run security tests against systems you do not own or have explicit permission to assess.

## Current project scope

This is a functional portfolio prototype, not a production commerce platform. Before production use, add automated tests, server-side order creation and inventory transactions, payment webhooks, rate limiting, stricter CORS policy, request validation, audit logging, deployment-specific URLs, monitoring, and a documented privacy/data-retention policy.
