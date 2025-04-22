# 🎥 Movie Review Platform (IMDb Clone)

## 🚀 Overview

A full-stack movie review web application inspired by IMDb, featuring:

- 🎬 Browse and search movies from TMDB
- ⭐ Rate, review, and comment on movies
- 👥 User authentication and profiles
- 🛠️ Admin panel for content and user management
- 💻 Responsive and modern UI/UX

---

## 🛠 Tech Stack

### 🔹 Frontend
- **React** (v19)
- **React Router** (v7)
- **Tailwind CSS** + **Styled Components**
- **Formik** & **Yup** – Form handling & validation
- **Axios** – HTTP requests
- **TMDB API** – Movie data source

### 🔹 Backend
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** – User authentication
- **Redis** – Caching
- **Passport.js** – Auth strategies

### 🔹 Testing
- **Jest** & **React Testing Library** – Frontend testing
- **Jest** & **Supertest** – Backend testing
- **MSW** – Mock API requests
- **MongoDB Memory Server** – Testing MongoDB operations

---

## 📁 Project Structure

```
movie-review-platform/
├── client/                  # React frontend
│   ├── public/              # Static assets
│   └── src/                 # Source code
│       ├── components/      # Reusable components
│       ├── pages/           # Route-based components
│       ├── services/        # API services
│       ├── styles/          # Global styles
│       └── tests/           # Frontend tests
├── server/                  # Node.js backend
│   ├── config/              # Config and env setup
│   ├── controllers/         # Route handlers
│   ├── models/              # Mongoose models
│   ├── routes/              # API route definitions
│   └── tests/               # Backend tests
```

---

## ✨ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Redis (v7+)
- TMDB API Key (Free Tier)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ramendra777/Movie-Review-Website
cd Movie-Review-Website
```

2. **Backend setup**
```bash
cd server
npm install
cp .env.example .env
# Fill in environment variables
```

3. **Frontend setup**
```bash
cd ../client
npm install
cp .env.example .env.local
# Fill in your TMDB API key
```

### Environment Variables

**Backend (.env)**
```
MONGO_URI=mongodb://localhost:27017/movie-reviews
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=5000
```

**Frontend (.env.local)**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
```

---

## 🚀 Running the Application

### Development Mode

1. **Start backend**
```bash
cd server
npm run dev
```

2. **Start frontend**
```bash
cd ../client
npm start
```

App runs at: `http://localhost:3000`

### Production Build

1. **Build frontend**
```bash
cd client
npm run build
```

2. **Serve build**
```bash
npm install -g serve
serve -s build -l 3000
```

---

## ✅ Testing

### Frontend
```bash
cd client
npm test
npm run test:watch
```

### Backend
```bash
cd server
npm test
npm run test:integration
```

---

## 🚚 Deployment

### Option 1: Docker (Recommended)
```bash
docker-compose up --build
```

Access at `http://localhost:3000`

### Option 2: Manual Deployment

**Backend**
- Deploy to Heroku, AWS EB, etc.
- Configure production environment variables

**Frontend**
- Deploy to Netlify, Vercel, or AWS S3
- Set `REACT_APP_API_URL` to production backend URL

---

## 📈 Key Features

### Users
- Browse popular and top-rated movies
- Search by title, genre, year, or rating
- Register and log in
- Post ratings and reviews
- Add movies to watchlist
- Follow users and like reviews

### Admins
- Add, edit, and delete movies
- View and manage users
- Assign or revoke admin rights
- Monitor platform statistics

---

## 📜 API Endpoints

| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| GET    | /api/movies         | Fetch all movies                |
| GET    | /api/movies/popular | Fetch popular movies            |
| POST   | /api/movies         | Add a new movie (Admin only)    |
| GET    | /api/auth/me        | Get current user profile        |
| POST   | /api/auth/login     | Login user                      |
| POST   | /api/auth/register  | Register new user               |

---

## ⚠️ Troubleshooting

**MongoDB Issues**
- Ensure MongoDB service is running
- Check MONGO_URI in `.env`

**Redis Issues**
- Verify Redis is up and running
- Confirm host and port in `.env`

**TMDB API Issues**
- Ensure API key is correct and active
- Check usage limits and network requests

---

## 🚪 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

