/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TaskContext = createContext({
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

export const TaskProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (projectId, filters = {}) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams(filters);
      const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (response.ok) {
        setTasks(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchTaskStats = useCallback(async (projectId) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (response.ok) {
        setTaskStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch task stats:', err);
    }
  }, [token]);

  const createTask = useCallback(async (projectId, taskData) => {
    setError(null);
    // Filter out empty assignee field
    const filteredData = { ...taskData };
    if (!filteredData.assignee || filteredData.assignee.trim() === '') {
      delete filteredData.assignee;
    }
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filteredData),
    });
    const data = await response.json();
    if (response.ok) {
      setTasks([data.data, ...tasks]);
      return data.data;
    } else {
      setError(data.message);
      throw new Error(data.message);
    }
  }, [token, tasks]);

  const updateTask = useCallback(async (taskId, taskData) => {
    setError(null);
    // Extract projectId from the first task or pass it separately
    const projectId = tasks[0]?.project;
    // Filter out empty assignee field
    const filteredData = { ...taskData };
    if (!filteredData.assignee || filteredData.assignee.trim() === '') {
      delete filteredData.assignee;
    }
    const response = await fetch(
      `${API_URL}/projects/${projectId}/tasks/${taskId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filteredData),
      }
    );
    const data = await response.json();
    if (response.ok) {
      setTasks(tasks.map(t => t._id === taskId ? data.data : t));
      return data.data;
    } else {
      setError(data.message);
      throw new Error(data.message);
    }
  }, [token, tasks]);

  const deleteTask = useCallback(async (taskId) => {
    setError(null);
    const projectId = tasks[0]?.project;
    const response = await fetch(
      `${API_URL}/projects/${projectId}/tasks/${taskId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.ok) {
      setTasks(tasks.filter(t => t._id !== taskId));
    } else {
      const data = await response.json();
      setError(data.message);
      throw new Error(data.message);
    }
  }, [token, tasks]);

  const addComment = useCallback(async (taskId, text) => {
    setError(null);
    const projectId = tasks[0]?.project;
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
    const data = await response.json();
    if (response.ok) {
      setTasks(tasks.map(t => t._id === taskId ? { ...t, comments: data.data } : t));
    } else {
      setError(data.message);
      throw new Error(data.message);
    }
  }, [token, tasks]);

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

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
