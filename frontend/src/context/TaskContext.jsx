import { createContext, useState, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TaskContext = createContext({
  tasks: [],
  taskStats: null,
  loading: false,
  error: null,
  fetchTasks: () => {},
  fetchTaskStats: () => {},
  createTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  addComment: () => {},
});

export { TaskContext };

export const TaskProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 FETCH TASKS
  const fetchTasks = useCallback(async (projectId, filters = {}) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(filters);

      const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }

      setTasks(data.data || []);

    } catch (err) {
      setError(err.message);
      console.error('🔥 Fetch Tasks Error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 🔹 FETCH STATS
  const fetchTaskStats = useCallback(async (projectId) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setTaskStats(data.data);
      }

    } catch (err) {
      console.error('🔥 Task Stats Error:', err);
    }
  }, [token]);

  // 🔹 CREATE TASK
  const createTask = useCallback(async (projectId, taskData) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
      }

      setTasks(prev => [data.data, ...prev]);

      return data.data;

    } catch (err) {
      setError(err.message);
      console.error('🔥 Create Task Error:', err);
      throw err;
    }
  }, [token]);

  // 🔹 UPDATE TASK
  const updateTask = useCallback(async (projectId, taskId, taskData) => {
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task');
      }

      setTasks(prev =>
        prev.map(t => (t._id === taskId ? data.data : t))
      );

      return data.data;

    } catch (err) {
      setError(err.message);
      console.error('🔥 Update Task Error:', err);
      throw err;
    }
  }, [token]);

  // 🔹 DELETE TASK
  const deleteTask = useCallback(async (projectId, taskId) => {
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete task');
      }

      setTasks(prev => prev.filter(t => t._id !== taskId));

    } catch (err) {
      setError(err.message);
      console.error('🔥 Delete Task Error:', err);
      throw err;
    }
  }, [token]);

  // 🔹 ADD COMMENT
  const addComment = useCallback(async (projectId, taskId, text) => {
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks/${taskId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }

      setTasks(prev =>
        prev.map(t =>
          t._id === taskId ? { ...t, comments: data.data } : t
        )
      );

    } catch (err) {
      setError(err.message);
      console.error('🔥 Add Comment Error:', err);
      throw err;
    }
  }, [token]);

  const value = {
    tasks,
    taskStats,
    loading,
    error,
    fetchTasks,
    fetchTaskStats,
    createTask,
    updateTask,
    deleteTask,
    addComment,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};