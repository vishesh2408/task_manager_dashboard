import express from 'express';
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  getTaskStats,
} from '../controllers/taskController.js';

import { authenticate, authorizeProjectAccess } from '../middlewares/auth.js';

const router = express.Router({ mergeParams: true });

// ✅ Authentication
router.use(authenticate);

// ✅ Authorization (IMPORTANT FIX)
router.use(authorizeProjectAccess);

// Routes
router.post('/', createTask);
router.get('/', getProjectTasks);
router.get('/stats', getTaskStats);

router.get('/:taskId', getTaskById);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

router.post('/:taskId/comments', addComment);

export default router;