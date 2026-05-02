import { ApiError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  // ✅ 1. Log error (VERY IMPORTANT)
  console.error('🔥 ERROR:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });

  // ✅ 2. Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // ✅ 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => e.message);
  }

  // ✅ 4. Duplicate Key Error (MongoDB)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  // ✅ 5. Invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  // ✅ 6. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // ✅ 7. Final Response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // 🔥 only in dev
  });
};