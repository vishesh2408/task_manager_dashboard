/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ProjectContext = createContext({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  fetchProjects: () => {},
  createProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  addMember: () => {},
  removeMember: () => {},
});

export const ProjectProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProjects(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createProject = useCallback(async (projectData) => {
    setError(null);
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });
    const data = await response.json();
    if (response.ok) {
      setProjects([data.data, ...projects]);
      return data.data;
    } else {
      setError(data.message);
      throw new Error(data.message);
    }
  }, [token, projects]);

  const updateProject = useCallback(async (projectId, projectData) => {
    setError(null);
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });
    const data = await response.json();
    if (response.ok) {
      setProjects(projects.map(p => p._id === projectId ? data.data : p));
      return data.data;
    } else {
      setError(data.message);
      throw new Error(data.message);
    }
  }, [token, projects]);

  const deleteProject = useCallback(async (projectId) => {
    setError(null);
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      setProjects(projects.filter(p => p._id !== projectId));
    } else {
      const data = await response.json();
      setError(data.message);
      throw new Error(data.message);
    }
  }, [token, projects]);

  const addMember = useCallback(async (projectId, userId, role = 'member') => {
    setError(null);
    const response = await fetch(`${API_URL}/projects/${projectId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, role }),
    });
    const data = await response.json();
    if (response.ok) {
      setProjects(projects.map(p => p._id === projectId ? data.data : p));
      return data.data;
    } else {
      setError(data.message);
      throw new Error(data.message);
    }
  }, [token, projects]);

  const removeMember = useCallback(async (projectId, userId) => {
    setError(null);
    const response = await fetch(`${API_URL}/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setProjects(projects.map(p => p._id === projectId ? data.data : p));
    } else {
      const data = await response.json();
      setError(data.message);
      throw new Error(data.message);
    }
  }, [token, projects]);

  const value = {
    projects,
    currentProject,
    setCurrentProject,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
