# TaskMaster Frontend

React + Vite + Tailwind CSS web application for team task management.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs on `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   └── Navbar.jsx      # Navigation bar
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Projects.jsx    # Projects list
│   ├── ProjectDetail.jsx # Project details
│   └── Tasks.jsx       # Tasks management
├── context/            # Global state (Context API)
│   ├── AuthContext.jsx   # Authentication state
│   ├── ProjectContext.jsx # Projects state
│   └── TaskContext.jsx    # Tasks state
├── services/           # API services
├── utils/              # Utility functions
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎯 Pages Overview

### Login & Register
- JWT-based authentication
- Email validation
- Password strength requirements
- Smooth transitions

### Dashboard
- Task overview and statistics
- Project quick access
- Overdue task alerts
- Completion rate tracking
- Active tasks list

### Projects
- Create new projects
- View all projects
- Delete projects
- Member management
- Project status tracking

### Project Details
- Project information
- Team members list
- Add/remove members
- Role assignment

### Tasks
- Create and edit tasks
- Filter by status and priority
- Task comments
- Time estimation
- Due date tracking

## 🔄 Global State Management

### AuthContext
- User authentication state
- Login/logout functions
- Token management
- User profile

### ProjectContext
- Projects list
- Create/edit/delete projects
- Member management
- Loading and error states

### TaskContext
- Tasks list
- Task operations
- Task statistics
- Comments management

## 🎨 Styling Features

### Tailwind CSS v4
- Utility-first CSS framework
- Responsive design
- Gradient color schemes
- Dark mode support
- Custom animations

## 🚀 Build & Deploy

### Production Build
```bash
npm run build
```

### Deployment to Railway
Connect GitHub repository and deploy automatically.

## 📄 License

MIT

---

See main [README.md](../README.md) for full documentation.
