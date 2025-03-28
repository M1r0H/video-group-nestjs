# Video and Group Management API (NestJS + PostgreSQL)

---

## **Deployment Guide**

### **Requirements**
- Node.js >= 23.x
- PostgreSQL >= 15 (Docker)
- Docker (mandatory for PostgreSQL)

---

### **Steps to Run the Application**

#### 1. **Clone the Repository**
```bash
git clone git@github.com:M1r0H/video-group-nestjs.git
cd video-group-nestjs
```

#### 2. **Install Dependencies**
```bash
npm install
```

#### 3. **Set Environment Variables**
Copy `.env.example` to `.env` and configure environment variables:
```bash
cp .env.example .env
```

#### 4. **Run PostgreSQL Using Docker**
```bash
docker-compose up -d
```

#### 5. **Start Application in Development Mode**
```bash
npm run start:dev
```

---

## **Testing**
### **Unit Tests**
```bash
npm run test
```

---

## **Swagger API Documentation**
- Swagger API documentation is available at:
```
http://localhost:3001/swagger
```

---

## **Project Overview**

### **Video Management**
- Create, update, and delete videos.
- Associate videos with groups.
- Filter and search videos by `title`, `description`, `groupId`, and date ranges.

### **Group Management**
- Create, update, and delete groups.
- Build and manage a hierarchical group structure.
- Filter and search groups by `name` and `parentId`.
- Prevent circular dependencies in group relationships.

### **Authentication and Authorization**
- Register and login with password hashing using `bcrypt`.
- Generate JWT tokens with automatic cleanup of old tokens.
- Role-based access control:
  - `viewer` — can only view data.
  - `editor` — can create, update, and manage data.

---

## **API Endpoints**
### **Authentication**
- `POST /auth` — Login and obtain a JWT token.
- `POST /auth/registration` — Register a new user.

### **Videos**
- `GET /videos` — Get a list of videos with optional filters.
- `POST /videos` — Create a new video (`editor` only).
- `GET /videos/:id` — Get a video by `ID`.
- `PATCH /videos/:id` — Update a video (`editor` only).
- `DELETE /videos/:id` — Delete a video (`editor` only).

### **Groups**
- `GET /groups` — Get a list of groups.
- `GET /groups/tree` — Get a paginated tree of groups.
- `POST /groups` — Create a new group (`editor` only).
- `GET /groups/:id` — Get a group by `ID`.
- `PATCH /groups/:id` — Update a group (`editor` only).
- `DELETE /groups/:id` — Delete a group (`editor` only).

---

## **Technologies**
- **NestJS** — Backend framework for building APIs.
- **TypeORM** — ORM for working with PostgreSQL.
- **Swagger** — API documentation.
- **Jest / Supertest** — Unit testing.

---

## **Authors**
- [Vladyslav Shiiaty](https://github.com/M1r0H)

