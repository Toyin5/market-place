# market-place Backend

Production-ready backend scaffold for a Nigerian fashion and textile marketplace that connects fashion designers with local textile producers and fabric suppliers.

## Tech Stack

- Node.js
- TypeScript
- Hono.js
- PostgreSQL
- Prisma ORM
- JWT authentication
- Zod validation
- bcrypt password hashing

## Project Structure

```text
src/
  config/
  db/
  middlewares/
  modules/
    auth/
    marketplace/
    producers/
    users/
  types/
  utils/
  app.ts
  server.ts
prisma/
  schema.prisma
  seed.ts
```

## Features

- Dual-role authentication for `DESIGNER` and `PRODUCER`
- Producer auto-profile creation during producer registration
- JWT access token authentication
- Role-protected producer profile management
- Public marketplace search with Nigerian state validation, pagination, and sorting
- Consistent API response envelopes
- Prisma schema with proper one-to-one relation between `User` and `ProducerProfile`
- Seed data for Lagos, Abuja, Kano, Ibadan, Port Harcourt, and Aba

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Required variables:

- `PORT`: API port
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: long secret used to sign access tokens
- `JWT_EXPIRES_IN`: token lifetime such as `7d`, `24h`, or `3600`
- `BCRYPT_SALT_ROUNDS`: bcrypt hashing cost, for example `12`
- `CORS_ORIGIN`: `*` or a comma-separated list of allowed frontend origins

## Setup

1. Install dependencies:

```bash
npm install
```

2. Generate the Prisma client:

```bash
npm run prisma:generate
```

3. Create and apply the database migration:

```bash
npm run prisma:migrate -- --name init
```

4. Seed the database:

```bash
npm run db:seed
```

5. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.
Swagger UI will be available at `http://localhost:3000/docs` and the raw OpenAPI spec at `http://localhost:3000/openapi.json`.

## Authentication

### Register

`POST /auth/register`

Designer registration body:

```json
{
  "fullName": "Adaeze Okeke",
  "email": "adaeze@example.com",
  "password": "Password123",
  "phoneNumber": "+2348012345678",
  "role": "DESIGNER"
}
```

Producer registration body:

```json
{
  "fullName": "Bola Akin",
  "email": "bola@example.com",
  "password": "Password123",
  "phoneNumber": "+2348012345678",
  "role": "PRODUCER",
  "businessName": "Bola Fabrics",
  "description": "Wholesale Ankara and lace supplier",
  "locationState": "Lagos",
  "locationCity": "Yaba",
  "address": "12 Commercial Avenue, Yaba, Lagos",
  "fabricTypes": ["Ankara", "Lace"],
  "minimumOrderQuantity": 10,
  "deliveryAvailable": true,
  "whatsappNumber": "+2348012345678"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "bola@example.com",
  "password": "Password123"
}
```

### Current User

`GET /auth/me`

Send the JWT token as:

```text
Authorization: Bearer <access_token>
```

## Producer Profile Endpoints

- `GET /producers/me`
- `PUT /producers/me`
- `GET /producers/:id`

Only authenticated users with the `PRODUCER` role can access or update `/producers/me`.

Example producer update body:

```json
{
  "description": "Premium bridal lace and ready-to-wear fabric supplier",
  "priceRangeMin": 5000,
  "priceRangeMax": 20000,
  "deliveryAvailable": true,
  "profileImageUrl": "https://example.com/storefront.jpg"
}
```

## Marketplace Search

`GET /marketplace/producers`

Supported query parameters:

- `locationState`
- `locationCity`
- `fabricType`
- `deliveryAvailable`
- `minPrice`
- `maxPrice`
- `search`
- `page`
- `limit`
- `sortBy` with values `newest`, `rating`, or `businessName`

Example:

```http
GET /marketplace/producers?locationState=Lagos&fabricType=Ankara&deliveryAvailable=true&page=1&limit=20
```

State validation is Nigeria-only. The API accepts valid Nigerian states and also normalizes `Abuja` and `FCT` to `Federal Capital Territory`.

## Response Format

Success:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Seed Credentials

The seed script creates sample producers plus one sample designer. All seeded accounts use:

- Email: use any seeded email from `prisma/seed.ts`
- Password: `Password123`

## Useful Scripts

- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:migrate:deploy`
- `npm run prisma:studio`
- `npm run db:seed`

## Deploy To Render

This repo now includes a root `render.yaml` so you can deploy the API to Render without hard-coding a managed database choice into the repo. You can point `DATABASE_URL` to either Render Postgres or an external PostgreSQL provider.

Recommended steps:

1. Push the repo to GitHub.
2. In Render, create a new Blueprint or Web Service from the repo.
3. Set `DATABASE_URL` and `JWT_SECRET` before the first deploy.
4. Optionally set `CORS_ORIGIN` to your frontend URL instead of `*`.

The included Render configuration uses:

- Build command: `npm install && npm run build && npm run prisma:migrate:deploy`
- Start command: `npm start`
- Health check path: `/health`

Notes:

- `npm run build` now generates the Prisma client before compiling TypeScript.
- `prisma migrate deploy` applies the committed SQL migrations during deployment.
- The seed script is not run automatically in production. If you want sample data on Render, run `npm run db:seed` manually as a one-off job or in a Render shell.
