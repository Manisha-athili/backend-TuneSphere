# 🎵 TuneSphere Backend

Express.js REST API server for TuneSphere music streaming platform with MongoDB database.

## 🎯 Overview

The TuneSphere backend is a RESTful API built with Express.js and MongoDB. It handles user authentication, music streaming, playlist management, and administrative functions.

### Key Features

- 🔐 JWT-based authentication
- 👤 User management and profiles
- 🎵 Music track CRUD operations
- 📝 Playlist management
- 👑 Admin controls
- 🔍 Search functionality
- ⚡ Fast and scalable architecture

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv
- **CORS**: Express CORS middleware

---

## 📁 Project Structure

```
backend/
│
├── config/
│   └── db.js                  # MongoDB connection configuration
│
├── models/
│   ├── User.js               # User model schema
│   ├── Music.js              # Music track schema
│   ├── Playlist.js           # Playlist schema
│   └── ...                   # Other models
│
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── userRoutes.js         # User management routes
│   ├── musicRoutes.js        # Music CRUD routes
│   ├── playlistRoutes.js     # Playlist routes
│   └── adminRoutes.js        # Admin routes
│
├── controllers/
│   ├── authController.js     # Auth business logic
│   ├── userController.js     # User operations
│   ├── musicController.js    # Music operations
│   └── ...                   # Other controllers
│
├── middleware/
│   ├── auth.js               # JWT verification
│   ├── admin.js              # Admin authorization
│   └── errorHandler.js       # Error handling
│
├── utils/
│   ├── generateToken.js      # JWT generation
│   └── ...                   # Helper utilities
│
├── uploads/                   # File uploads directory
│
├── server.js                 # Application entry point
├── package.json
├── .env                      # Environment variables (DO NOT COMMIT)
├── .env.example             # Example environment file
├── .gitignore
└── README.md                 # This file
```

---

## 📦 Prerequisites

Before starting, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB** - One of the following:
  - Local MongoDB installation - [Download](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas account - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.x",
    "mongoose": "^7.x.x",
    "dotenv": "^16.x.x",
    "cors": "^2.8.x",
    "jsonwebtoken": "^9.x.x",
    "bcryptjs": "^2.4.x"
  }
}
```

### Step 3: Install Additional Dependencies (if needed)


# For development (optional)
npm install --save-dev nodemon
```

---

## ⚙️ Configuration

### Step 1: Create Environment File

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Or create manually:

```bash
touch .env
```

### Step 2: Configure Environment Variables

Edit `.env` file with your configuration:

```env
# ======================
# SERVER CONFIGURATION
# ======================
PORT=5000
NODE_ENV=development

# ======================
# DATABASE CONFIGURATION
# ======================
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/tunesphere

# OR MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tunesphere?retryWrites=true&w=majority

# ======================
# JWT CONFIGURATION
# ======================
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

<!-- PORT=5000
MONGO_URI=mongodb://localhost:27017/musicApp
YOUTUBE_API_KEY=AIzaSyDyPrsctKIfNWauWCX5_O3I2XtHnD7xH10
JWT_SECRET=mysecretkey123456

SPOTIFY_CLIENT_ID=47643d2ef52344bbb90c9c611eb4fa54
SPOTIFY_CLIENT_SECRET=aa5bdd746e6f4eacbee18bcf6ffa914d

API_BASE_URL=http://localhost:5000/api -->

# ======================
# ADMIN CONFIGURATION
# ======================
ADMIN_EMAIL=admin@tunesphere.com
ADMIN_PASSWORD=admin123

# ======================
# FILE UPLOAD
# ======================
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# ======================
# CORS CONFIGURATION
# ======================
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006

# ======================
# EMAIL CONFIGURATION (Optional)
# ======================
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@tunesphere.com

# ======================
# CLOUD STORAGE (Optional)
# ======================
# AWS_ACCESS_KEY_ID=your_aws_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret
# AWS_BUCKET_NAME=tunesphere-music
# AWS_REGION=us-east-1
```

### Step 3: Generate Secure JWT Secret

Generate a secure random secret key:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

Copy the output and paste it as your `JWT_SECRET` value.

### Step 4: Set Up MongoDB

#### Option A: Local MongoDB

1. **Install MongoDB** - [Download](https://www.mongodb.com/try/download/community)

2. **Start MongoDB Service**:

   **Windows:**
   ```bash
   net start MongoDB
   ```

   **macOS:**
   ```bash
   brew services start mongodb-community
   ```

   **Linux:**
   ```bash
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running**:
   ```bash
   mongo --eval "db.version()"
   ```

#### Option B: MongoDB Atlas (Cloud)

1. **Create Account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a Cluster** (Free tier available)

3. **Create Database User**:
   - Go to Database Access
   - Add New Database User
   - Set username and password
   - Grant read/write permissions

4. **Whitelist IP Address**:
   - Go to Network Access
   - Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for development)

5. **Get Connection String**:
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in `.env`

---

## 🎮 Running the Server

### Development Mode (with auto-restart)

Add this script to `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

Then run:

```bash
# Install nodemon if not already installed
npm install --save-dev nodemon

# Start development server
npm run dev
```

### Production Mode

```bash
npm start
```

### Verify Server is Running

1. **Check console output**:
```
==================================================
✅ MongoDB Connected
✅ Server running on port 5000
🌐 Local: http://localhost:5000
🌐 Network: http://192.168.1.16:5000
📊 Health: http://localhost:5000/health
==================================================
```

2. **Test endpoints**:
```bash
# Test root endpoint
curl http://localhost:5000/

# Test health check
curl http://localhost:5000/health
```

Expected responses:
```json
// Root endpoint
{
  "message": "Backend Running ✅",
  "status": "OK",
  "timestamp": "2025-10-04T10:30:00.000Z"
}

// Health endpoint
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/verify` | Verify JWT token | ✅ |
| POST | `/api/auth/refresh` | Refresh access token | ✅ |
| POST | `/api/auth/forgot-password` | Request password reset | ❌ |
| POST | `/api/auth/reset-password/:token` | Reset password | ❌ |

**Example Request - Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| PUT | `/api/users/password` | Change password | ✅ |
| DELETE | `/api/users/account` | Delete account | ✅ |
| GET | `/api/users/:id` | Get user by ID | ✅ |

### Music Routes (`/api/music`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/music` | Get all tracks | ❌ |
| GET | `/api/music/:id` | Get track by ID | ❌ |
| POST | `/api/music` | Upload new track | ✅ (Admin) |
| PUT | `/api/music/:id` | Update track | ✅ (Admin) |
| DELETE | `/api/music/:id` | Delete track | ✅ (Admin) |
| GET | `/api/music/search` | Search tracks | ❌ |
| GET | `/api/music/genre/:genre` | Get by genre | ❌ |
| GET | `/api/music/artist/:artist` | Get by artist | ❌ |

**Example Request - Get All Music:**
```bash
curl http://localhost:5000/api/music
```

### Playlist Routes (`/api/playlists`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/playlists` | Get user playlists | ✅ |
| POST | `/api/playlists` | Create playlist | ✅ |
| GET | `/api/playlists/:id` | Get playlist by ID | ✅ |
| PUT | `/api/playlists/:id` | Update playlist | ✅ |
| DELETE | `/api/playlists/:id` | Delete playlist | ✅ |
| POST | `/api/playlists/:id/tracks` | Add track | ✅ |
| DELETE | `/api/playlists/:id/tracks/:trackId` | Remove track | ✅ |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | Get all users | ✅ (Admin) |
| GET | `/api/admin/stats` | Platform statistics | ✅ (Admin) |
| PUT | `/api/admin/users/:id` | Update user | ✅ (Admin) |
| DELETE | `/api/admin/users/:id` | Delete user | ✅ (Admin) |
| GET | `/api/admin/analytics` | Analytics data | ✅ (Admin) |

### Authentication Header

For protected routes, include JWT token:

```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  avatar: String,
  playlists: [ObjectId],
  favorites: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Music Model
```javascript
{
  title: String,
  artist: String,
  album: String,
  genre: String,
  duration: Number,
  fileUrl: String,
  coverImage: String,
  releaseDate: Date,
  plays: Number,
  likes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Playlist Model
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  tracks: [ObjectId (ref: Music)],
  isPublic: Boolean,
  coverImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛡️ Middleware

### Authentication Middleware (`middleware/auth.js`)

Protects routes by verifying JWT tokens:

```javascript
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### Admin Middleware (`middleware/admin.js`)

Restricts routes to admin users only:

```javascript
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};
```

---

## ❌ Error Handling

The server implements centralized error handling:

```javascript
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || "Internal Server Error", 
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
```

---

## 🧪 Testing

### Install Testing Dependencies

```bash
npm install --save-dev jest supertest
```

### Run Tests

```bash
npm test
```

### Example Test

```javascript
import request from 'supertest';
import app from '../server.js';

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123!'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

---

## 🚀 Deployment

### Heroku Deployment

1. **Install Heroku CLI** - [Download](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login to Heroku**:
```bash
heroku login
```

3. **Create Heroku App**:
```bash
heroku create tunesphere-api
```

4. **Set Environment Variables**:
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
```

5. **Deploy**:
```bash
git push heroku main
```

### Railway/Render Deployment

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

### VPS Deployment (AWS EC2, DigitalOcean)

1. **Connect to VPS**:
```bash
ssh user@your-server-ip
```

2. **Install Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone Repository**:
```bash
git clone your-repo-url
cd backend
npm install
```

4. **Install PM2**:
```bash
sudo npm install -g pm2
pm2 start server.js --name tunesphere-api
pm2 startup
pm2 save
```

5. **Configure Nginx** (Optional):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Problem**: `MongoServerError: connect ECONNREFUSED`

**Solutions**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check MongoDB Atlas IP whitelist
# Verify connection string in .env
```

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions**:
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=5001
```

### JWT Token Invalid

**Problem**: `JsonWebTokenError: invalid token`

**Solutions**:
- Check `JWT_SECRET` matches between token creation and verification
- Ensure token is sent in correct format: `Bearer <token>`
- Check token expiration (`JWT_EXPIRE`)
- Clear old tokens and login again

### CORS Errors

**Problem**: `Access-Control-Allow-Origin error`

**Solutions**:
```javascript
// Update CORS configuration in server.js
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));
```

### Database Model Errors

**Problem**: `ValidationError` or `CastError`

**Solutions**:
- Check request body matches model schema
- Validate required fields
- Check data types match schema definitions
- Use Mongoose validation

---

## 📊 Monitoring & Logging

### Add Morgan for HTTP Logging

```bash
npm install morgan
```

```javascript
import morgan from 'morgan';
app.use(morgan('dev'));
```

### Add Winston for Advanced Logging

```bash
npm install winston
```

---

## 🔒 Security Best Practices

- ✅ Use strong JWT secrets (32+ characters)
- ✅ Hash passwords with bcryptjs
- ✅ Validate and sanitize user inputs
- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated (`npm audit`)
- ✅ Never commit `.env` files
- ✅ Use environment variables for secrets
- ✅ Implement proper CORS policies
- ✅ Add request size limits

---

## 📧 Support

For backend-specific issues:
- Check this README
- Review server logs
- Test endpoints with Postman
- Check MongoDB connection

---

**Backend API Ready! 🚀**

Next step: [Frontend Setup](../frontend/README.md)