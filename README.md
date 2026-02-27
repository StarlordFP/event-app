# Event App

A full-stack event management application built with Node.js, TypeScript, React, and MySQL.

---

## Features

- Authentication with JWT access tokens and refresh token rotation
- Email verification on signup
- Create, edit, and delete events
- Public and private event visibility
- Tag-based filtering
- Search events by title, description, or location
- Pagination

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

## Getting Started


### Manual Setup

**Prerequisites:**
- Node.js 18+
- MySQL 8 running locally

#### 1. Clone the repo
```bash
git clone https://github.com/StarlordFP/event-app.git
cd event-app
```

#### 2. Set up the database
```bash
# Start MySQL (Docker just for DB)
docker-compose up mysql -d

# Or use your local MySQL and create the database manually:
# CREATE DATABASE event_app;
```

#### 3. Set up the server
```bash
cd server
cp ../.env.example .env
# Edit .env with your values
npm install
npx knex migrate:latest
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

## Environment Variables

Copy `.env.example` to `.env` in the root folder and fill in the values:

```env
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
| POST | `/api/events` | Yes | Create event |
| PATCH | `/api/events/:id` | Yes | Update event |
| DELETE | `/api/events/:id` | Yes | Delete event |

### Tags
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tags` | No | List all tags |

#### Event Query Parameters
```
GET /api/events?page=1&limit=10&filter=upcoming&tag=music&event_type=public&search=concert&sort_by=date&sort_order=asc
```

---

## Development

```bash
# Run only the database via Docker, everything else manually
docker-compose up mysql -d
cd server && npm run dev
cd client && npm run dev
```

---

## License

MIT