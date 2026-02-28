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
- Pagination
- Admin dashboard for user and event management

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL 8 |
| ORM / Query Builder | Knex.js |
| Auth | JWT, bcrypt, nodemailer |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```
event-app/
├── client/          # React frontend
├── server/          # Express backend
├── docker-compose.yml
└── .env.example
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

### Manual Setup

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

Copy `.env.example` to `server/.env` (for manual mode) or `.env` (for Docker) and fill in the values:

```env
# Server
PORT=4000
CORS_ORIGIN=http://localhost:5173

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=app
DB_PASSWORD=app
DB_NAME=event_app

# JWT — use a long random string in production!
JWT_SECRET=change-this-to-a-long-random-string
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_DAYS=7

# Email — requires a Gmail App Password
# Get one at: myaccount.google.com/apppasswords
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=Event App <your@gmail.com>
CLIENT_URL=http://localhost:5173

# 2FA
TWO_FA_APP_NAME=EventApp
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
| POST | `/api/auth/2fa/setup` | Yes | Generate 2FA QR code |
| POST | `/api/auth/2fa/enable` | Yes | Enable 2FA |
| POST | `/api/auth/2fa/verify` | No | Verify 2FA code on login |
| POST | `/api/auth/2fa/disable` | Yes | Disable 2FA |

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

## Known Limitations

- Private events are currently only visible to the creator
- An invite system (email invitations for private events) is planned as a future enhancement

---

## Development Workflow

```bash
# Database only via Docker, everything else manual (recommended for active development)
docker-compose up mysql -d
cd server && npm run dev     # hot reload
cd client && npm run dev     # hot reload with Vite HMR

# Full Docker (recommended for testing / submission)
docker-compose up --build -d
```

---

## License

MIT