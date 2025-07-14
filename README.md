# 🍿 Cinetro - Cinema Tickets API

**Cinetro** is a cinema tickets shop project designed to practice API development, database management, and frontend implementation. This is the backend side of the project.

---

# Getting started

## ⬇️ Installation

Clone the repository

    git clone https://github.com/Ezetorc/cinetro-backend.git

Switch to the repo folder

    cd cinetro-backend

Install dependencies

    npm install

Create .env file on the project root and add:

    - DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
    - REDIS_URL="redis://redis:6379"
    - JWT_SECRET=<Your JWT secret key>

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

Check the documentation of the API by entering `http://localhost:3000/docs`

## 📞 Contact

You can contact me by my email: ezetorc@gmail.com