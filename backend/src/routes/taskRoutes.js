import express from 'express';
import { body, param, query } from 'express-validator';
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
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router({ mergeParams: true });

// All task routes require authentication
router.use(authenticate);
// All task routes require project membership (or owner)
router.use(authorizeProjectAccess());

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('assignee').optional({ nullable: true }).isEmail().withMessage('Assignee must be a valid email address'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date'),
    body('estimatedHours').optional().isNumeric().withMessage('Estimated hours must be a number'),
    body('actualHours').optional().isNumeric().withMessage('Actual hours must be a number'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ],
  validateRequest,
  createTask
);
router.get(
  '/',
  [
    query('status').optional().isIn(['todo', 'in-progress', 'review', 'completed']).withMessage('Invalid status'),
    query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    query('sortBy').optional().isIn(['dueDate', 'priority', 'createdAt']).withMessage('Invalid sortBy'),
    query('assignee').optional().isEmail().withMessage('Assignee must be a valid email address'),
  ],
  validateRequest,
  getProjectTasks
);
router.get('/stats', getTaskStats);

router.get(
  '/:taskId',
  [param('taskId').isMongoId().withMessage('Invalid task id')],
  validateRequest,
  getTaskById
);
router.put(
  '/:taskId',
  [
    param('taskId').isMongoId().withMessage('Invalid task id'),
    body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('assignee').optional({ nullable: true }).isEmail().withMessage('Assignee must be a valid email address'),
    body('status').optional().isIn(['todo', 'in-progress', 'review', 'completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date'),
    body('estimatedHours').optional().isNumeric().withMessage('Estimated hours must be a number'),
    body('actualHours').optional().isNumeric().withMessage('Actual hours must be a number'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ],
  validateRequest,
  updateTask
);
router.delete(
  '/:taskId',
  [param('taskId').isMongoId().withMessage('Invalid task id')],
  validateRequest,
  deleteTask
);

router.post(
  '/:taskId/comments',
  [
    param('taskId').isMongoId().withMessage('Invalid task id'),
    body('text').trim().notEmpty().withMessage('Comment text is required'),
  ],
  validateRequest,
  addComment
);

export default router;
