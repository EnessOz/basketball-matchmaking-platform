# Basketball Matchmaking Platform

Basketball Matchmaking Platform is a personal project built to help basketball players find courts, create games, and join existing matches.

The main goal is to make it easier for players to organize real-world basketball games without relying on large social media groups or messaging apps.

---

## Current Features

### Courts

* Court listing
* District-based filtering
* Court search
* Court detail pages
* Dynamic routing for court details

### Matches

* Match listing
* Match search
* District-based filtering
* Match detail pages
* Join match simulation
* Match creation form

### General

* React Router navigation
* Responsive page structure
* Header and footer navigation
* About page
* Contact page
* Login page
* Register page

---

## Tech Stack

### Frontend

* React
* JavaScript
* React Router

### Backend

* Node.js
* Express.js

### Database (Planned)

* MongoDB

### Image Hosting (Planned)

* Cloudinary

---

## Backend Progress

The backend setup has been initialized using Express.

Current API endpoints:

* GET /courts
* GET /matches

At the moment, endpoints return local data stored inside the backend project. These endpoints will later be connected to MongoDB.

---

## Current Project Status

The project is currently in MVP development.

Completed:

* Frontend architecture
* Routing system
* Court system
* Match system
* Search and filtering
* Match detail pages
* Match creation flow
* Express backend setup
* Initial API endpoints

Currently Working On:

* Connecting frontend to backend APIs
* MongoDB integration
* Authentication system

Planned Features:

* User accounts
* Favorite courts
* Match participation tracking
* Real-time matchmaking
* Notifications
* Player profiles
* Interactive maps

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
