# SkySense AI – Intelligent Weather Monitoring and Personalized Recommendation System

Full-stack main project built with React, Node.js, Express and MongoDB.

## Features
- User registration/login with JWT
- Protected routes
- Current weather by city
- GPS/current-location weather
- 7-day forecast
- Hourly forecast
- Favorites
- Search history
- AI-style weather recommendations
- Weather assistant
- Weather alerts
- User profile
- Admin dashboard
- Responsive UI

## Requirements
- Node.js 18+
- MongoDB running locally or MongoDB Atlas
- npm

## Run

### Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Environment
Backend `.env`:
MONGO_URI=mongodb://127.0.0.1:27017/weather_ai
JWT_SECRET=change_this_to_a_long_secret
PORT=5000

The weather service uses Open-Meteo, so no weather API key is required.
