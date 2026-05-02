import jwt from 'jsonwebtoken';
import { ApiError } from './apiResponse.js';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ✅ FIXED
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};