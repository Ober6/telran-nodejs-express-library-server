# Library API

Library management system.

## Technologies:

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

---

## Table of Contents

1. [Installation](#installation)
2. [Environment Variables](#environment-variables)
3. [Running the Server](#running-the-server)
4. [Postman API documentation](#postman-api-documentation)

---

## Installation

### 1. Clone repository

 ```bash
  git clone https://github.com/Ober6/telran-nodejs-express-library-server
 ```

### 2. Install libraries

```bash
  npm install
```

## Environment Variables

To configure the application, create an `.env` file in the root directory of the project:

### Required Variables

| Variable     | Example                             |
|--------------|-------------------------------------|
| `ACCOUNT_DB` | `mongodb://localhost:27017/library` |
| `PORT`       | `3050`                              |

### Authentication & Security

| Variable     | Example                          |
|--------------|----------------------------------|
| `OWNER`      | `100000000`                      |
| `OWNER_PASS` | `your_secure_password`           |
| `JWT_SECRET` | `super-extra-secret-key-for-jwt` |
| `JWT_EXP`    | `1h` (1 hour)                    |

### Optional Variables (SQL Database)

If you're using SQL database integration, add the following:

| Variable       | Example         |
|----------------|-----------------|
| `SQL_HOST`     | `localhost`     |
| `SQL_PORT`     | `5432`          |
| `SQL_USER`     | `admin`         |
| `SQL_PASSWORD` | `your_password` |
| `SQL_DB_NAME`  | `library_db`    |

### Example `.env` file

```env
# Required
ACCOUNT_DB=mongodb://localhost:27017/library
PORT=3050

# Authentication & Security
OWNER=100000000
OWNER_PASS=your_secure_password
JWT_SECRET=super-extra-secret-key-for-jwt
JWT_EXP=1h

# Optional - Only needed if using SQL
# SQL_HOST=localhost
# SQL_PORT=5432
# SQL_USER=admin
# SQL_PASSWORD=your_password
# SQL_DB_NAME=library_db
```

## Running the Server

Build and run

```bash
  npm start
```

## Postman API documentation

See the postman documentation for API and request/response examples:

[GetPostman](https://documenter.getpostman.com/view/42357202/2sB3dTrmyA)