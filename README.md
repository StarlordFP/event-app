# Event App

A full-stack event management application built with Node.js, TypeScript, React, and MySQL.

---

## Features

- Authentication with JWT access tokens and refresh token rotation
- Email verification on signup
- Role-based access control (Admin, Organizer, Attendee)
- Create, edit, and delete events
- Public and private event visibility
- RSVP system (Going / Maybe / Not Going)
- Tag-based filtering
- Search events by title, description, or location
- Sort events by date, popularity, or creation time
- Pagination
- Admin dashboard for user and event management
- Dockerized for easy setup and deployment

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL 8 |
| Query Builder | Knex.js |
| Auth | JWT, bcrypt, nodemailer |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```
event-app/
├── client/            # React frontend
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── server/            # Express backend
│   ├── src/
│   ├── migrations/
│   ├── seeds/
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Roles

| Role | Permissions |
|------|------------|
| **Attendee** | View public events, RSVP to events (default role on signup) |
| **Organizer** | All attendee permissions + create, edit, delete own events |
| **Admin** | All permissions + manage users, change roles, delete any event |

> Admin account is seeded automatically. See [Default Admin](#default-admin) below.

---

## Getting Started

### Option 1: Docker (Recommended)

**Prerequisites:** Docker and Docker Compose installed.

#### 1. Clone the repo
```bash
git clone https://github.com/StarlordFP/event-app.git
cd event-app
```

#### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your values (JWT_SECRET, EMAIL_USER, EMAIL_PASS)
```

#### 3. Run with Docker
```bash
docker-compose up --build -d
```

- Frontend: http://localhost:3000
- Backend:  http://localhost:4000

> Migrations and seeds run automatically on startup.

---

### Option 2: Manual Setup

**Prerequisites:** Node.js 20+, MySQL 8 running locally.

#### 1. Clone the repo
```bash
git clone https://github.com/StarlordFP/event-app.git
cd event-app
```

#### 2. Start the database
```bash
# Start MySQL via Docker
docker-compose up mysql -d
```

#### 3. Set up the server
```bash
cd server
cp ../.env.example .env   # then edit .env with your values
npm install
npx knex migrate:latest
npx knex seed:run
npm run dev
```

Server runs at: `http://localhost:4000`

#### 4. Set up the client
```bash
cd client
npm install
npm run dev
```

Client runs at: `http://localhost:5173`

---

## Default Admin

A default admin account is created automatically when you run seeds:

```
Email:    admin@eventapp.com
Password: admin123
```

> Login with this account to access the Admin Dashboard and manage users and roles.

---

## Environment Variables

### For Docker (root `.env`):
```env
PORT=4000
DB_HOST=mysql
DB_PORT=3306
DB_USER=app
DB_PASSWORD=app
DB_NAME=event_app
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
JWT_SECRET=change-this-to-a-long-random-string
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_DAYS=7
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=Event App <your@gmail.com>
TWO_FA_APP_NAME=EventApp
```

### For Manual Dev (`server/.env`):
Same as above but change:
```env
DB_HOST=127.0.0.1   # local MySQL
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

### Getting a Gmail App Password:
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → App Passwords
3. Generate a password and paste it in `EMAIL_PASS`

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Logout |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/verify-email` | No | Verify email with token |
| POST | `/api/auth/resend-verification` | No | Resend verification email |

### Events
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/events` | Optional | List events (search, filter, sort) |
| GET | `/api/events/:id` | Optional | Get single event |
| POST | `/api/events` | Organizer / Admin | Create event |
| PATCH | `/api/events/:id` | Organizer / Admin | Update event |
| DELETE | `/api/events/:id` | Organizer / Admin | Delete event |

### RSVP
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/events/:id/rsvp-counts` | No | Get RSVP counts for event |
| GET | `/api/events/:id/rsvp` | Yes | Get my RSVP status |
| POST | `/api/events/:id/rsvp` | Yes | Create or update RSVP |
| DELETE | `/api/events/:id/rsvp` | Yes | Remove RSVP |
| GET | `/api/events/:id/rsvps` | Organizer / Admin | Get all RSVPs for event |

### Tags
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tags` | No | List all tags |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/users/:id/role` | Admin | Change user role |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/events` | Admin | List all events including private |
| DELETE | `/api/admin/events/:id` | Admin | Delete any event |

#### Event Query Parameters
```
GET /api/events?page=1&limit=10&filter=upcoming&tag=music&event_type=public&search=concert&sort_by=date&sort_order=asc
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |
| `filter` | `upcoming`, `past` | Filter by date |
| `tag` | string | Filter by tag name |
| `event_type` | `public`, `private` | Filter by visibility |
| `search` | string | Search title, description, location |
| `sort_by` | `date`, `created_at`, `popularity` | Sort field |
| `sort_order` | `asc`, `desc` | Sort direction |

---

## Useful Docker Commands

```bash
docker-compose up --build -d     # build and start all containers
docker-compose up -d             # start without rebuilding
docker-compose down              # stop all containers
docker-compose down -v           # stop and delete database volume
docker-compose logs server       # view server logs
docker-compose logs client       # view client logs
docker ps                        # list running containers
```

---

## Known Limitations

- Private events are currently only visible to the creator
- An invite system (email invitations for private events) is planned as a future enhancement

---

## License

MIT