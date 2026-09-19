# Basketball Matchmaking Platform

Basketball Matchmaking Platform is a full-stack web application for finding basketball courts, creating local games, and joining existing matches.

The project is currently under active development.

---

## Features

- Basketball court listing
- Court search and district filtering
- Court detail pages
- Favorite courts
- Match listing and filtering
- Match creation
- Match detail pages
- Joining and leaving matches
- User-specific match ownership
- My Matches page
- Users can delete their own matches
- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Protected routes
- MongoDB database integration
- Notifications for new matches on favorite courts
- Accept and reject match notifications
- Global notification mute
- Notification bell with unread count

---

## Tech Stack

### Frontend

- React
- JavaScript
- React Router
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---

## Current Development

Currently working on:

- Notification spam protection
- Match creation rate limiting and cooldown
- Notification center improvements
- Match lifecycle and expiration
- Player profiles

Planned for later:

- Match reminders
- Match check-in and attendance
- Trust Score
- Interactive maps
- Real-time features
- Image hosting
- Deployment

---

## Installation

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
node src/server.js
```

Create a `.env` file inside the backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit the `.env` file.