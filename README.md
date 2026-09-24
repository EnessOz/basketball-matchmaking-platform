# Basketball Matchmaking Platform

Basketball Matchmaking Platform is a full-stack web application for finding basketball courts, creating local games, and joining existing matches.

The project is currently under active development.

---

**Features**

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
- Rank-based daily match creation limits
- Rank-based daily match participation limits
- Match creation cooldown
- 90-minute match time blocks
- Prevention of joining overlapping matches
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

**Rank System**

New users start with 1000 rank points.

Rank points determine how many matches a user can create or participate in per day.

| Rank Points | Join Limit | Create Limit |
|------------|------------|--------------|
| 0–499 | 1 | 0 |
| 500–999 | 1 | 1 |
| 1000–1499 | 2 | 1 |
| 1500+ | 2 | 2 |

Matches are currently treated as 90-minute time blocks. A user cannot join another match if its time overlaps with a match they are already participating in.

The point earning, penalty and location verification systems are still under development.

---

**Tech Stack**

Frontend:
- React
- JavaScript
- React Router
- CSS

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---

**Currently Working On**

- Rank point transactions
- Match check-in and location verification
- Attendance verification
- Player ratings
- Rank rewards and penalties
- Match deletion abuse protection
- Daily and rolling 7-day usage tracking
- Player profiles

Later:
- Regional rankings and leaderboards
- Rank badges
- Match reminders
- Interactive maps
- Real-time features
- Image hosting
- Deployment

---

**Installation**

Frontend:

```bash
cd frontend
npm install
npm start