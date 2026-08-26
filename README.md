# Basketball Matchmaking Platform

Basketball Matchmaking Platform is a full-stack web application for finding basketball courts, creating local games, and joining existing matches.

The project is currently under active development.

---

## Features

- Basketball court listing
- Court search and district filtering
- Court detail pages
- Match listing and filtering
- Match creation
- Match detail pages
- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Protected routes
- User-specific match ownership
- My Matches page
- Users can delete their own matches
- MongoDB database integration

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

- User-based match participation
- Preventing duplicate participation
- Leaving matches
- Joined matches
- Player profiles
- Favorite courts

Planned for later:

- Interactive maps
- Notifications
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