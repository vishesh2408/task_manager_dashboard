import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { ApiError } from '../utils/apiResponse.js';

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(' ')[1] ||
      req.cookies?.accessToken;

    if (!token) {
      return next(new ApiError(401, 'No token provided'));
    }

    const decoded = verifyToken(token); // now throws error automatically

    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error); // ✅ safe now
  }
};

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          'You do not have permission to perform this action'
        )
      );
    }

    next();
  };
};

export const authorizeProjectAccess = (roleRequired = 'member') => {
  return async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user._id;

      const project = await Project.findById(projectId);

      if (!project) {
        return next(new ApiError(404, 'Project not found'));
      }

      const isOwner = project.owner.toString() === userId.toString();
      const memberRole = project.members.find(
        (m) => m.user.toString() === userId.toString()
      );

      if (!isOwner && !memberRole) {
        return next(
          new ApiError(403, 'You do not have access to this project')
        );
      }

      if (
        roleRequired === 'admin' &&
        !isOwner &&
        memberRole?.role !== 'admin'
      ) {
        return next(
          new ApiError(
            403,
            'Only project admins can perform this action'
          )
        );
      }

      req.project = project;
      next();
    } catch (error) {
      next(error);
    }
  };
};
