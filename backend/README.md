# TaskMaster Backend API

Express.js REST API for TaskMaster task management system with MongoDB.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task_manager
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Running

```bash
npm run dev      # Development mode with auto-reload
npm start        # Production mode
```

## 📚 API Routes

All routes require JWT token in `Authorization` header.

### Authentication (No Auth Required)

```
POST /api/auth/register
  body: { name, email, password }
  
POST /api/auth/login
  body: { email, password }
  
GET /api/auth/me (Auth Required)
```

### Projects

```
POST /api/projects
  body: { name, description?, dueDate? }

GET /api/projects

GET /api/projects/:projectId

PUT /api/projects/:projectId
  body: { name?, description?, dueDate?, status? }

DELETE /api/projects/:projectId

POST /api/projects/:projectId/members
  body: { userId, role? }

DELETE /api/projects/:projectId/members/:userId
```

### Tasks

```
POST /api/projects/:projectId/tasks
  body: { title, description?, priority?, dueDate?, estimatedHours? }

GET /api/projects/:projectId/tasks?status=&priority=&sortBy=

GET /api/projects/:projectId/tasks/:taskId

PUT /api/projects/:projectId/tasks/:taskId
  body: { title?, description?, status?, priority?, ... }

DELETE /api/projects/:projectId/tasks/:taskId

POST /api/projects/:projectId/tasks/:taskId/comments
  body: { text }

GET /api/projects/:projectId/tasks/stats
```

## 🗂️ Project Structure

```
src/
├── config/           # Database and configuration
├── models/           # MongoDB schemas
├── controllers/      # Business logic
├── routes/           # API endpoints
├── middlewares/      # Auth, error handling
├── utils/            # Helpers and utilities
└── services/         # External services

server.js            # Entry point
```

## 🔐 Security Features

- **JWT Authentication:** Secure token-based auth
- **Password Hashing:** bcrypt with salt rounds
- **CORS Protection:** Configurable origin
- **Input Validation:** express-validator
- **Role-Based Access:** Admin/Member permissions
- **Error Handling:** Centralized error middleware

## 📊 Data Models

### User
- name, email (unique), password (hashed)
- role (admin/member), avatar, isActive
- Timestamps (createdAt, updatedAt)

### Project
- name, description, owner (ref)
- members (array with roles)
- status (active/completed/archived)
- dueDate, timestamps

### Task
- title, description, project (ref)
- assignee, createdBy (refs)
- status, priority, dueDate
- estimatedHours, actualHours
- isOverdue, tags, comments
- Timestamps

## 🛡️ Middleware

### Authentication (`auth.js`)
- `authenticate`: Verify JWT token
- `authorize`: Check user roles
- `authorizeProjectAccess`: Project-level permissions

### Error Handling (`errorHandler.js`)
- Centralized error responses
- Validation error handling
- JWT error handling
- MongoDB error handling

## 📝 Response Format

### Success
```json
{
  "statusCode": 200,
  "data": {...},
  "message": "Success message",
  "success": true
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'
```

### Get Projects
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚢 Deployment

### Railway

1. Push to GitHub
2. Create Railway project
3. Add MongoDB service (or use Atlas)
4. Connect GitHub repository
5. Set environment variables
6. Deploy

### Environment Variables for Production
```
PORT=5000
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
CORS_ORIGIN=<frontend-url>
```

## 🔍 Debugging

Enable debug logging:
```javascript
// In server.js
const debug = require('debug')('app:*');
```

Check MongoDB connection:
```bash
# Test connection string
mongo "mongodb+srv://user:pass@cluster.mongodb.net/task_manager"
```

## 📦 Dependencies

- **express** (4.x) - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT handling
- **express-validator** - Input validation
- **cors** - CORS middleware
- **dotenv** - Environment variables

## 📄 License

MIT

---

**API Documentation:** See main README.md
