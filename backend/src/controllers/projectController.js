import Project from '../models/Project.js';
import { ApiResponse, ApiError, asyncHandler } from '../utils/apiResponse.js';

export const createProject = asyncHandler(async (req, res, next) => {
  const { name, description, dueDate } = req.body;

  if (!name) {
    throw new ApiError(400, 'Project name is required');
  }

  const project = new Project({
    name,
    description,
    dueDate,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'admin' }],
  });

  await project.save();
  await project.populate('owner', 'name email');
  await project.populate('members.user', 'name email');

  res.status(201).json(
    new ApiResponse(201, project, 'Project created successfully')
  );
});

export const getProjects = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Get projects where user is owner or member
  const projects = await Project.find({
    $or: [{ owner: userId }, { 'members.user': userId }],
  })
    .populate('owner', 'name email')
    .populate('members.user', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, projects, 'Projects retrieved successfully')
  );
});

export const getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId)
    .populate('owner', 'name email')
    .populate('members.user', 'name email');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  res.status(200).json(
    new ApiResponse(200, project, 'Project retrieved successfully')
  );
});

export const updateProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { name, description, dueDate, status } = req.body;

  let project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Check authorization
  const isOwner = project.owner.toString() === req.user._id.toString();
  const memberRole = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (!isOwner && memberRole?.role !== 'admin') {
    throw new ApiError(403, 'You do not have permission to update this project');
  }

  if (name) project.name = name;
  if (description) project.description = description;
  if (dueDate) project.dueDate = dueDate;
  if (status) project.status = status;

  await project.save();
  await project.populate('owner', 'name email');
  await project.populate('members.user', 'name email');

  res.status(200).json(
    new ApiResponse(200, project, 'Project updated successfully')
  );
});

export const deleteProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only project owner can delete this project');
  }

  await Project.deleteOne({ _id: projectId });

  res.status(200).json(
    new ApiResponse(200, null, 'Project deleted successfully')
  );
});

export const addMember = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { userEmail, role } = req.body;

  if (!userEmail) {
    throw new ApiError(400, 'User email is required');
  }

  // Find user by email instead of ID
  const userToAdd = await User.findOne({ email: userEmail });
  if (!userToAdd) {
    throw new ApiError(404, 'User not found');
  }

  let project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Check authorization
  const isOwner = project.owner.toString() === req.user._id.toString();
  const memberRole = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (!isOwner && memberRole?.role !== 'admin') {
    throw new ApiError(403, 'You do not have permission to add members to this project');
  }

  // Check if member already exists
  const memberExists = project.members.some(
    (m) => m.user.toString() === userToAdd._id.toString()
  );

  if (memberExists) {
    throw new ApiError(400, 'User is already a member of this project');
  }

  project.members.push({
    user: userToAdd._id,
    role: role || 'member',
  });

  await project.save();
  await project.populate('members.user', 'name email');

  res.status(200).json(
    new ApiResponse(200, project, 'Member added successfully')
  );
});

export const removeMember = asyncHandler(async (req, res, next) => {
  const { projectId, userId } = req.params;

  let project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Check authorization
  const isOwner = project.owner.toString() === req.user._id.toString();

  if (!isOwner) {
    throw new ApiError(403, 'Only project owner can remove members');
  }

  project.members = project.members.filter(
    (m) => m.user.toString() !== userId
  );

  await project.save();
  await project.populate('members.user', 'name email');

  res.status(200).json(
    new ApiResponse(200, project, 'Member removed successfully')
  );
});
