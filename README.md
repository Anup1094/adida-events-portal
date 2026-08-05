# adida-events-portal

## Setup

### 1. Configure environment variables

Create a `.env` file in the `server/` directory with your MongoDB connection string:

```env
# MongoDB connection URI
MONGO_URI=mongodb://localhost:27017/adida_events

# Server port (optional, defaults to 5000)
PORT=5000
```

For a production MongoDB Atlas cluster, use:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/adida_events
```

A template is available at `server/.env.example` — copy it with `cp server/.env.example server/.env` and fill in your values.

### 2. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Seed the admin user (optional)

```bash
cd server
npm install
node seedAdmin.js
```

This creates an admin account with email `admin@adidaevents.com` and password `Admin@123`.

### 4. Run the app

```bash
# Server (runs on http://localhost:5000)
cd server
npm run dev

# Client (runs on http://localhost:5173)
cd ../client
npm run dev
```

