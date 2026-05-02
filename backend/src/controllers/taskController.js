import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { ApiResponse, ApiError, asyncHandler } from '../utils/apiResponse.js';

// CREATE
export const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignee, priority, dueDate, estimatedHours, tags } = req.body;

  if (!title) throw new ApiError(400, 'Task title is required');

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, 'Project not found');

  const task = await Task.create({
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

  await task.populate('createdBy', 'name email');
  await task.populate('assignee', 'name email');

  res.status(201).json(new ApiResponse(201, task, 'Task created successfully'));
});

// GET ALL
export const getProjectTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status, assignee, priority, sortBy } = req.query;

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

  res.status(200).json(new ApiResponse(200, tasks));
});

// GET ONE
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId)
    .populate('createdBy', 'name email')
    .populate('assignee', 'name email')
    .populate('comments.user', 'name email avatar');

  if (!task) throw new ApiError(404, 'Task not found');

  res.status(200).json(new ApiResponse(200, task));
});

// UPDATE
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) throw new ApiError(404, 'Task not found');

  Object.assign(task, req.body);

  await task.save();
  await task.populate('createdBy', 'name email');
  await task.populate('assignee', 'name email');

  res.status(200).json(new ApiResponse(200, task, 'Task updated'));
});

// DELETE
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) throw new ApiError(404, 'Task not found');

  await task.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Task deleted'));
});

// COMMENT
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) throw new ApiError(400, 'Comment text required');

  const task = await Task.findById(req.params.taskId);
  if (!task) throw new ApiError(404, 'Task not found');

  task.comments.push({ user: req.user._id, text });

  await task.save();
  await task.populate('comments.user', 'name email avatar');

  res.status(200).json(new ApiResponse(200, task.comments));
});

// STATS
export const getTaskStats = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const tasks = await Task.find({ project: projectId });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => t.isOverdue).length,
  };

  res.status(200).json(new ApiResponse(200, stats));
});