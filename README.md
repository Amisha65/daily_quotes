# Daily Quotes

A full-stack quote application built with React, Vite, Express, and MongoDB.

Users can:
- fetch random quotes
- register and log in
- save quotes to their account
- remove saved quotes
- share quotes

## Live Demo

- App: [https://daily-quotes-app-lake.vercel.app](https://daily-quotes-app-lake.vercel.app)
- Repository: [https://github.com/Amisha65/daily_quotes](https://github.com/Amisha65/daily_quotes)

## Tech Stack

- Frontend: React, Vite, Bootstrap, CSS Modules
- Backend: Express, JWT auth, bcrypt
- Database: MongoDB Atlas with Mongoose
- Deployment: Vercel

## Features

- Random quote generation
- User registration and login
- Saved quotes per user
- Quote delete and share actions
- Responsive layout for desktop and mobile

## Local Development

### Frontend

From the project root:

```bash
npm install
npm run dev
```

### Backend

From the `Server` folder:

```bash
npm install
node server.js
```

The backend expects a `Server/.env` file with:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_here
FRONTEND_ORIGIN=http://localhost:5173
```

## Production Notes

- Frontend is deployed on Vercel
- API routes are served through Vercel serverless functions under `/api/*`
- Production requires `MONGO_URI` and `JWT_SECRET` in Vercel environment variables

## Project Structure

```text
src/        React frontend
Server/     Express app, routes, models, middleware
api/        Vercel serverless API entrypoint
public/     Static assets
```
