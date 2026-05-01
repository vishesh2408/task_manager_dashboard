import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { authenticate, authorizeProjectAccess } from '../middlewares/auth.js';
import { body, param } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

// All project routes require authentication
router.use(authenticate);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  ],
  validateRequest,
  createProject
);
router.get('/', getProjects);

router.get(
  '/:projectId',
  [param('projectId').isMongoId().withMessage('Invalid project id')],
  validateRequest,
  getProjectById
);
router.put(
  '/:projectId',
  [
    param('projectId').isMongoId().withMessage('Invalid project id'),
    body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
    body('status').optional().isIn(['active', 'completed', 'archived']).withMessage('Invalid status'),
  ],
  validateRequest,
  authorizeProjectAccess(),
  updateProject
);
router.delete(
  '/:projectId',
  [param('projectId').isMongoId().withMessage('Invalid project id')],
  validateRequest,
  deleteProject
);

router.post(
  '/:projectId/members',
  [
    param('projectId').isMongoId().withMessage('Invalid project id'),
    body('userId').isMongoId().withMessage('Invalid user id'),
    body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role'),
  ],
  validateRequest,
  authorizeProjectAccess('admin'),
  addMember
);
router.delete(
  '/:projectId/members/:userId',
  [
    param('projectId').isMongoId().withMessage('Invalid project id'),
    param('userId').isMongoId().withMessage('Invalid user id'),
  ],
  validateRequest,
  authorizeProjectAccess('admin'),
  removeMember
);

export default router;
