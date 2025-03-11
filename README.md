# Dev DocExportes API

`dev-docexportes-api` is a TypeScript-based RESTful API built with Express.js, designed to manage users, authentication, and pay order templates. It follows a clean architecture pattern, leveraging Prisma for PostgreSQL database interactions and Supabase for additional functionality. The API includes JWT-based authentication, comprehensive error handling, and a robust testing suite.

## Features

- **User Management**: Create, read, update, and delete (CRUD) user records.
- **Authentication**: Register, login, and logout functionality with JWT.
- **Pay Order Templates**: Manage payment order templates tied to users.
- **Security**: Environment variable validation with Zod, JWT authentication, and crypto utilities.
- **Database**: PostgreSQL integration via Prisma with migrations.
- **Testing**: Unit tests with Jest for core components.
- **Scalability**: Modular architecture with domain-driven design.

## Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT
- **External Services**: Supabase
- **Testing**: Jest
- **Validation**: Zod
- **Containerization**: Docker Compose (development)

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (v13+)
- Docker (optional, for containerized development)
- pnpm (package manager)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/dev-docexportes-api.git
cd dev-docexportes-api
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the `.env.template` to `.env.dev` (or `.env.prod` for production) and fill in the required values:

```bash
cp .env.template .env.dev
```

Example `.env.dev`:

```
NODE_ENV=dev
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
JWT_SECRET="your_jwt_secret_key_must_have_32_characters"
SUPABASE_URL="https://your-supabase-url.supabase.co"
SUPABASE_KEY="your-supabase-anon-key"
CRYPTO_SECRET="your_32_byte_secret_key_in_hex_format"  # 64 hex chars
CRYPTO_IV="your_16_byte_iv_in_hex_format"              # 32 hex chars
```

Generate secure keys:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # CRYPTO_SECRET
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"  # CRYPTO_IV
```

### 4. Set Up PostgreSQL

#### Option 1: Local PostgreSQL

- Install PostgreSQL locally and create a database matching `DATABASE_NAME`.
- Update `DATABASE_URL` in `.env.dev`.

#### Option 2: Docker Compose

Start PostgreSQL with Docker:

```bash
pnpm compose:dev
```

### 5. Run Database Migrations

Apply the Prisma migrations:

```bash
pnpm migrate:postgres:dev
```

### 6. Start the Application

#### Development Mode (with hot reload)

```bash
pnpm dev
```

#### Production Build

```bash
pnpm build
pnpm start
```

The API will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── config/          # Configuration files (adapters, envs)
├── data/           # Database clients (Postgres, Supabase)
├── domain/         # Business logic (entities, use cases, repositories)
├── errors/         # Custom error handling
├── infrastructure/ # Concrete implementations (datasources, repositories)
├── middleware/     # Express middleware (auth, error handling)
├── presentation/   # API layer (controllers, routes, server)
└── index.ts        # Entry point
```

## API Endpoints

- **Auth**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login and receive JWT
  - `POST /api/auth/logout` - Logout (requires JWT)
- **Users**
  - `POST /api/users` - Create a user
  - `GET /api/users` - Get all users
  - `GET /api/users/:id` - Get a user by ID
  - `PUT /api/users` - Update a user
  - `DELETE /api/users/:id` - Delete a user
- **Pay Order Templates**
  - `POST /api/payorder` - Create a template (JWT required)
  - `GET /api/payorder` - Get all templates (JWT required)
  - `GET /api/payorder/:id` - Get a template by ID (JWT required)
  - `PUT /api/payorder` - Update a template (JWT required)
  - `DELETE /api/payorder/:id` - Delete a template (JWT required)

## Testing

Run the test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

## Deployment to Production

1. **Prepare Environment**

   - Create `.env.prod` with production values.
   - Set `NODE_ENV=prod`.

2. **Build**

   ```bash
   pnpm build
   ```

3. **Deploy**

   - Option 1: Run directly with Node.js:
     ```bash
     node dist/index.js
     ```
   - Option 2: Use PM2 for process management:
     ```bash
     pm2 start dist/index.js --name "docexportes-api"
     ```
   - Option 3: Use Docker (create a `Dockerfile` for production).

4. **Database**
   - Apply migrations in production:
     ```bash
     npx prisma migrate deploy
     ```

## Contributing

- Fork the repository.
- Create a feature branch (`git checkout -b feature/your-feature`).
- Commit changes (`git commit -m "Add your feature"`).
- Push to the branch (`git push origin feature/your-feature`).
- Open a pull request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
