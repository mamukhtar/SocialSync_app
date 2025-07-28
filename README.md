# 📅 SocialSync

**SocialSync** is a web-based planner designed to help users manage their social events and tasks efficiently. Built with a modern tech stack, SocialSync helps users stay on top of social events; birthdays, dinners, anniversaries, gift reminders, and personal to-dos — all in one place.

---

## Features

- Create and manage events with categories and custom labels
- Attach curated or uploaded images using vibe-based prompts
- Create tasks and associate them with events
- View everything in a unified monthly calendar
- See upcoming items via a filtered agenda (Today / This Week / All)
- Toggle task status directly from the list
- Fully responsive UI (Mobile, Tablet, Desktop)
- User authentication with JWT and secure cookies
- Profile view with logout (edit features coming soon)

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Big Calendar
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT with HTTP-only cookies
- **Testing:** Jest, React Testing Library

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/socialsync.git
cd socialsync
```

### 2. Install dependencies

### Backend Setup (API)
1. Navigate to the `api` folder:
   ```bash
   cd SocialSync/api
    ```
2. Install all backend dependencies from the generated backend-requirements.txt:
    ```bash
    npm install
    xargs npm install < backend-requirements.txt

    ```

### 4. Set up the database
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```


### Frontend Setup (Client)
1. Navigate to the client folder:
    ```bash
    cd SocialSync/client
    ```
2. Install all backend dependencies from the generated frontend-requirements.txt:
    ```bash
    npm install
    xargs npm install < frontend-requirements.txt
    ```

### 3. Configure Environment Variables

Create `.env` files in both `client` and `server` folders.

#### Server (`/server/.env`)

  ```env
  DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/socialsync"

  REACT_APP_API_URL=http://localhost:5000/api


  # JWT Secret Key
  JWT_SECRET=myverysecuresecretkey

  CLOUDINARY_CLOUD_NAME=....
  CLOUDINARY_API_KEY=.....
  CLOUDINARY_API_SECRET=.....

  ```

#### Client (`/client/.env`)

  ```env
  REACT_APP_API_URL=http://localhost:5000/api
  ```

## Testing the Application 
**Client:**

1. Start the Backend:
..* Navigate to SocialSync/api and run:
    ```bash
    npx nodemon server.js
    ```
2. Start the Frontend:
..* Navigate to SocialSync/client and run:
    ```bash
    npm start
    ```

---

## Running Tests

To run component tests:

```bash
cd client
npm test
```

Tests are written using **Jest** and **React Testing Library**. Components like the image selector, EventList and Login are mocked and validated for UX and API behavior.

---

## Project Structure

```
/server         # Node/Express backend
  /controllers  # Route logic
  /middleware   # Auth and upload logic
  /routes       # API endpoints
  prisma/       # Database schema

/client         # React frontend
  /components   # Reusable components
  /pages        # Main pages (Dashboard, Events, Tasks)
  security/   # Authentication context

```

---

## Usage Guide

See the **[Getting Started](http://localhost:3000/how-to)** page in-app for a full walkthrough on how to use SocialSync!

---

## Future Improvements

- Email reminders for upcoming tasks/events
- Event sharing with others
- Group scheduling to find the best time that works for everyone 

---

## 📬 Feedback or Contributions?

We’re just getting started — feel free to fork, suggest features, or report bugs!
