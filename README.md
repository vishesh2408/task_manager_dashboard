# TaskMaster - Team Task Manager

A comprehensive full-stack web application for team project and task management with real-time collaboration, role-based access control, and professional dashboard.

## 🌟 Features

✅ **User Authentication**
- Secure signup and login with JWT tokens
- Password hashing with bcrypt
- Token-based session management

✅ **Project Management**
- Create, edit, and delete projects
- Add team members with different roles (Admin/Member)
- Project status tracking
- Due date management

✅ **Task Management**
- Create and assign tasks
- Multiple task statuses (todo, in-progress, review, completed)
- Priority levels (low, medium, high)
- Due date tracking with overdue detection
- Time estimation and tracking
- Comments and collaboration

✅ **Dashboard & Analytics**
- Real-time task statistics
- Project overview
- Overdue task alerts
- Completion rate tracking
- Task filtering and sorting

✅ **Role-Based Access Control (RBAC)**
- Admin: Full project control
- Member: Task assignment and updates
- Project-level permissions

✅ **Professional UI**
- Responsive design (mobile, tablet, desktop)
- Modern gradient aesthetics
- Smooth animations
- Tailwind CSS v4 styling
- Dark-mode ready

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Password Hashing:** bcryptjs
- **CORS:** cors

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **HTTP Client:** Fetch API
- **State Management:** Context API (no prop drilling)
- **Code Splitting:** React.lazy & Suspense

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── middlewares/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js
│   │   │   └── jwt.js
│   │   └── services/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   ├── ProjectDetail.jsx
    │   │   └── Tasks.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── ProjectContext.jsx
    │   │   └── TaskContext.jsx
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task_manager
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start the server:**
   ```bash
   npm run dev          # Development with hot reload
   npm start            # Production
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   App runs on `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register    - Create new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Project Endpoints

```
POST   /api/projects         - Create project
GET    /api/projects         - Get all user projects
GET    /api/projects/:id     - Get project details
PUT    /api/projects/:id     - Update project
DELETE /api/projects/:id     - Delete project
POST   /api/projects/:id/members      - Add member
DELETE /api/projects/:id/members/:uid - Remove member
```

### Task Endpoints

```
POST   /api/projects/:projectId/tasks         - Create task
GET    /api/projects/:projectId/tasks         - Get project tasks
GET    /api/projects/:projectId/tasks/:id     - Get task details
PUT    /api/projects/:projectId/tasks/:id     - Update task
DELETE /api/projects/:projectId/tasks/:id     - Delete task
POST   /api/projects/:projectId/tasks/:id/comments - Add comment
GET    /api/projects/:projectId/tasks/stats   - Get task statistics
```

## 🔐 Authentication Flow

1. User registers/logs in with email and password
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. All requests include `Authorization: Bearer <token>` header
5. Protected routes validate token and user permissions
6. Automatic logout on token expiration

## 🎨 UI Features

### Design Highlights
- **Gradient Buttons:** Purple to Cyan
- **Card-based Layout:** Easy to scan and navigate
- **Status Indicators:** Color-coded by priority/status
- **Responsive Grid:** Auto-adapts to screen size
- **Loading States:** Smooth animations
- **Error Handling:** User-friendly messages

### Unique Design Elements
- Distinctive gradient header (slate-900 to slate-800)
- Custom progress tracking cards
- Interactive task status transitions
- Animated stats cards
- Color-coded priority badges

## 📱 Responsive Breakpoints

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large Desktop: 1280px+

## 🚢 Deployment on Railway

### Prerequisites
- Railway account
- GitHub repository with code

### Deployment Steps

1. **Create MongoDB Atlas cluster:**
   - Go to MongoDB Atlas
   - Create a cluster and database user
   - Copy connection string

2. **Deploy Backend:**
   - Push code to GitHub
   - Create new service on Railway
   - Connect GitHub repo
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Secure random string
     - `NODE_ENV`: production
     - `CORS_ORIGIN`: Your frontend URL
   - Deploy

3. **Deploy Frontend:**
   - In Railway project, create new service
   - Connect GitHub repo (frontend folder)
   - Add build command: `npm run build`
   - Add start command: `npm run preview`
   - Add environment variable:
     - `VITE_API_URL`: Your backend URL
   - Deploy

### Railway Configuration

**Backend Service:**
```
Build Command: npm install
Start Command: npm start
Port: 5000
```

**Frontend Service:**
```
Build Command: npm install && npm run build
Start Command: npm run preview
Port: 3000
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: enum ['admin', 'member'],
  avatar: String,
  isActive: Boolean,
  timestamps: true
}
```

### Project Model
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [{user, role}],
  status: enum ['active', 'completed', 'archived'],
  dueDate: Date,
  timestamps: true
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignee: ObjectId (User),
  createdBy: ObjectId (User),
  status: enum ['todo', 'in-progress', 'review', 'completed'],
  priority: enum ['low', 'medium', 'high'],
  dueDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  isOverdue: Boolean,
  tags: [String],
  comments: [{user, text, createdAt}],
  timestamps: true
}
```

## 🧪 Testing

### Sample Test Data

1. **Create Account:**
   - Email: user@example.com
   - Password: password123

2. **Create Project:**
   - Name: "Website Redesign"
   - Members: Add team colleagues

3. **Create Tasks:**
   - Title: "Design homepage"
   - Priority: High
   - Due Date: Tomorrow

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Check MONGODB_URI in .env
- Ensure whitelist includes your IP
- Verify database user credentials

**Port Already in Use:**
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Frontend Issues

**Blank Page:**
- Clear browser cache
- Check console for errors
- Ensure backend is running

**API Connection Issues:**
- Verify CORS_ORIGIN matches frontend URL
- Check backend is accessible
- Ensure token is valid

## 📝 Best Practices

1. **Security:**
   - Keep JWT_SECRET secure
   - Use HTTPS in production
   - Validate all inputs
   - Sanitize user data

2. **Performance:**
   - Use lazy loading for routes
   - Optimize images
   - Implement pagination for large lists
   - Cache API responses when appropriate

3. **Code Quality:**
   - Follow ES6+ standards
   - Use proper error handling
   - Add loading and error states
   - Document complex logic

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Express, and MongoDB**

Live Demo: [Coming Soon]
