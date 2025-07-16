# 🍿 Cinetro - Cinema Tickets API

**Cinetro** is a cinema tickets shop project designed to practice API development, database management, and frontend implementation. This is the backend side of the project.

---

# Getting started

## ⬇️ Installation

Clone the repository:

```bash
git clone https://github.com/Ezetorc/cinetro-backend.git
```

Switch to the project folder:

```bash
cd cinetro-backend
```

Install dependencies:

```bash
npm install
```

## ⚙️ Environment variables

You can check all the .env variables with examples in the `.env.example` file.
Create a `.env` file in the root of the project and define the following variables:

### 🔐 Required variables

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET=<your_jwt_secret_key>
```

| Variable       | Description                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `MYSQL_URL` | Connection string for your MySQL database. Must include user, password, host, port, and database name. |
| `JWT_SECRET`   | Secret key used to sign JWT tokens. Keep it private and secure.                                        |
| `MYSQL_PASSWORD` | MySQL password (must match the container config)                                                     |
| `MYSQL_DATABASE` | MySQL database name                                                                                  |
---

### ⚙️ Optional variables (with defaults)

You can also define the following optional variables. If not defined, the default values will be used:

| Variable         | Description                                                                 | Default     |
| ---------------- | --------------------------------------------------------------------------- | ----------- |
| `PORT`           | Port where the NestJS application will run **inside the container**         | `3000`      |
| `HOST_PORT`      | Port exposed **on your host machine** (used in Docker)                      | `3000`      |
| `SALT_ROUNDS`    | Number of rounds used by bcrypt to hash passwords                           | `10`        |
| `JWT_EXPIRES_IN` | Token expiration time (e.g., `3600s`, `1d`, `7d`)                           | `3600s`     |
| `REDIS_HOST`     | Redis host. Use `redis` if running Redis via Docker Compose in same network | `localhost` |
| `REDIS_PORT`     | Redis port                                                                  | `6379`      |
| `MYSQL_HOST`     | Hostname of the MySQL server. Use `mysql` when using Docker Compose         | `mysql`     |
| `MYSQL_PORT`     | MySQL port                                                                  | `3306`      |
| `MYSQL_USER`     | MySQL username                                                              | `root`      |

> 💡 If you're using Docker, make sure to set `REDIS_HOST=redis` to match the service name in `docker-compose.yml`.
> 💡 If you're using Docker, make sure to set `MYSQL_HOST=mysql` to match the service name in `docker-compose.yml`.

---

## 💾 Database

---

Generate the Prisma client

    npx prisma generate

Generate mock data

    npm run generate:mock-data

---

## 📠 NPM scripts

- `npm start` - Start application
- `npm run start:dev` - Start application in watch mode
- `npm run test` - run Jest test runner
- `npm run start:prod` - Build application

---

## 👮 Authentication

This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme.

---

## 📕 Swagger API docs

Check the documentation of the API by entering `http://localhost:<YOUR PORT (3000) is the default>/docs`

## 📞 Contact

You can contact me by my email: ezetorc@gmail.com