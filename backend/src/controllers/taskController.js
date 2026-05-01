import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { ApiResponse, ApiError, asyncHandler } from '../utils/apiResponse.js';

export const createTask = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { title, description, assignee, priority, dueDate, estimatedHours, tags } = req.body;

  if (!title) {
    throw new ApiError(400, 'Task title is required');
  }

  // Check project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const task = new Task({
    title,
    description,
    project: projectId,
    createdBy: req.user._id,
    assignee: assignee || null,
    priority,
    dueDate,
    estimatedHours,
    tags: tags || [],
  });

  await task.save();
  await task.populate('createdBy', 'name email');
  await task.populate('assignee', 'name email');

  res.status(201).json(
    new ApiResponse(201, task, 'Task created successfully')
  );
});

export const getProjectTasks = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { status, assignee, priority, sortBy } = req.query;

  // Check project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  let filter = { project: projectId };

  if (status) filter.status = status;
  if (assignee) filter.assignee = assignee;
  if (priority) filter.priority = priority;

  let sortOption = { createdAt: -1 };
  if (sortBy === 'dueDate') sortOption = { dueDate: 1 };
  if (sortBy === 'priority') sortOption = { priority: -1 };

  const tasks = await Task.find(filter)
    .populate('createdBy', 'name email')
    .populate('assignee', 'name email')
    .sort(sortOption);

  res.status(200).json(
    new ApiResponse(200, tasks, 'Tasks retrieved successfully')
  );
});

export const getTaskById = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { taskId } = req.params;

  const task = await Task.findById(taskId)
    .populate('createdBy', 'name email')
    .populate('assignee', 'name email')
    .populate('comments.user', 'name email avatar');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  // Ensure task belongs to the project in the route
  if (task.project.toString() !== projectId) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json(
    new ApiResponse(200, task, 'Task retrieved successfully')
  );
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { taskId } = req.params;
  const { title, description, assignee, status, priority, dueDate, estimatedHours, actualHours, tags } = req.body;

  let task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  if (task.project.toString() !== projectId) {
    throw new ApiError(404, 'Task not found');
  }

  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (assignee !== undefined) task.assignee = assignee;
  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
  if (actualHours !== undefined) task.actualHours = actualHours;
  if (tags) task.tags = tags;

  await task.save();
  await task.populate('createdBy', 'name email');
  await task.populate('assignee', 'name email');

  res.status(200).json(
    new ApiResponse(200, task, 'Task updated successfully')
  );
});

export const deleteTask = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  if (task.project.toString() !== projectId) {
    throw new ApiError(404, 'Task not found');
  }

  // Only creator or project admin can delete
  const project = await Project.findById(task.project);
  const isProjectAdmin = project.owner.toString() === req.user._id.toString() ||
    project.members.some((m) => m.user.toString() === req.user._id.toString() && m.role === 'admin');

  if (task.createdBy.toString() !== req.user._id.toString() && !isProjectAdmin) {
    throw new ApiError(403, 'You do not have permission to delete this task');
  }

  await Task.deleteOne({ _id: taskId });

  res.status(200).json(
    new ApiResponse(200, null, 'Task deleted successfully')
  );
});

export const addComment = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { taskId } = req.params;
  const { text } = req.body;

  if (!text) {
    throw new ApiError(400, 'Comment text is required');
  }

  let task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  if (task.project.toString() !== projectId) {
    throw new ApiError(404, 'Task not found');
  }

  task.comments.push({
    user: req.user._id,
    text,
  });

  await task.save();
  await task.populate('comments.user', 'name email avatar');

  res.status(200).json(
    new ApiResponse(200, task.comments, 'Comment added successfully')
  );
});

export const getTaskStats = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const tasks = await Task.find({ project: projectId });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    overdue: tasks.filter((t) => t.isOverdue).length,
    byPriority: {
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
    },
  };

  res.status(200).json(
    new ApiResponse(200, stats, 'Task stats retrieved successfully')
  );
});
