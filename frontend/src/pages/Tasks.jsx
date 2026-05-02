import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';

// eslint-disable-next-line no-unused-vars
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
    padding: '1.5rem',
    fontFamily: "'Inter', sans-serif",
  },
  maxWidth: {
    maxWidth: '80rem',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  backButton: {
    color: '#7c3aed',
    marginBottom: '1rem',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  headerTitle: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    color: '#475569',
    marginTop: '0.5rem',
  },
  newTaskButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(to right, #8b5cf6, #06b6d4)',
    color: 'white',
    fontWeight: '500',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#334155',
    marginBottom: '0.25rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '0.5rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '0.5rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '0.5rem',
    outline: 'none',
    height: '6rem',
    resize: 'none',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
    paddingTop: '1rem',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#16a34a',
    color: 'white',
    fontWeight: '500',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#dc2626',
    color: 'white',
    fontWeight: '500',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
  },
  kanbanBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  kanbanColumn: {
    backgroundColor: '#f1f5f9',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  kanbanColumnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  kanbanColumnTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  taskCount: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    borderRadius: '9999px',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  kanbanTasks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minHeight: '100px',
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    padding: '1rem',
    cursor: 'pointer',
  },
  taskCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  taskTitle: {
    fontWeight: '600',
    color: '#1e293b',
  },
  priorityBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  priorityColors: {
    low: { backgroundColor: '#dbeafe', color: '#1e40af' },
    medium: { backgroundColor: '#fee_cd', color: '#c2410c' },
    high: { backgroundColor: '#fecaca', color: '#b91c1c' },
  },
  taskDescription: {
    fontSize: '0.875rem',
    color: '#475569',
    marginBottom: '1rem',
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: '#64748b',
  },
  dueDate: {
    fontWeight: '500',
  },
  overdue: {
    color: '#b91c1c',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#475569',
  },
  mdGrid2: {
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  }
};

export default function Tasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  useContext(AuthContext);
  const { projects } = useContext(ProjectContext);
  const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useContext(TaskContext);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    estimatedHours: 0,
    assignee: '',
  });
  const [loading, setLoading] = useState(false);

  const project = useMemo(() => {
    return projects.find(p => p._id === projectId) ?? null;
  }, [projects, projectId]);

  useEffect(() => {
    if (project) fetchTasks(projectId);
  }, [project, projectId, fetchTasks]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, formData);
      } else {
        await createTask(projectId, formData);
      }
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '', estimatedHours: 0, assignee: '' });
      setShowForm(false);
      setSelectedTask(null);
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(taskId);
        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask(null);
          setShowForm(false);
        }
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      estimatedHours: task.estimatedHours || 0,
      assignee: task.assignee?.email || '',
    });
    setShowForm(true);
  };

  const statuses = ['todo', 'in-progress', 'review', 'completed'];

  if (!project) {
    return (
      <div className="authPage">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="row between" style={{ alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <button onClick={() => navigate(`/projects/${projectId}`)} className="btn btnGhost">
              ← Back
            </button>
            <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 900, letterSpacing: 0.2 }}>
              {project.name} · Tasks
            </h1>
            <p className="muted" style={{ marginTop: 6 }}>{tasks.length} tasks</p>
          </div>
          <button
            onClick={() => {
              setSelectedTask(null);
              setFormData({ title: '', description: '', priority: 'medium', dueDate: '', estimatedHours: 0, assignee: '' });
              setShowForm(!showForm);
            }}
            className={showForm && !selectedTask ? 'btn btnGhost' : 'btn btnPrimary'}
          >
            {showForm && !selectedTask ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="card cardPad" style={{ marginBottom: 18 }}>
            <h2 className="cardTitle">
              {selectedTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleFormSubmit} className="stack" style={{ marginTop: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="label">Task title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="select">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="textarea" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="label">Due date</label>
                  <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Estimated hours</label>
                  <input type="number" value={formData.estimatedHours} onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })} className="input" />
                </div>
              </div>
              <div>
                <label className="label">Assignee Email (optional)</label>
                <input type="email" value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="input" placeholder="user@example.com" />
              </div>
              <div className="row" style={{ justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="submit" disabled={loading} className="btn btnPrimary">
                  {loading ? 'Saving...' : selectedTask ? 'Update Task' : 'Create Task'}
                </button>
                {selectedTask && (
                  <button type="button" onClick={() => handleDeleteTask(selectedTask._id)} className="btn btnDanger">
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Kanban Board */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {statuses.map(status => {
            const tasksInStatus = tasks.filter(t => t.status === status);
            return (
              <div key={status} className="card cardPad">
                <div className="row between" style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 850, textTransform: 'capitalize' }}>
                    {status.replace('-', ' ')}
                  </h3>
                  <span className="badge">{tasksInStatus.length}</span>
                </div>
                <div className="stack" style={{ gap: 10 }}>
                  {tasksInStatus.map(task => (
                    <div key={task._id} className="card" style={{ padding: 14, cursor: 'pointer' }} onClick={() => handleSelectTask(task)}>
                      <div className="row between" style={{ alignItems: 'flex-start' }}>
                        <p style={{ fontWeight: 850 }}>{task.title}</p>
                        <span className="badge">{task.priority}</span>
                      </div>
                      <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>{task.description}</p>
                      <div className="row between" style={{ marginTop: 10, fontSize: 12.5 }}>
                        {task.dueDate && (
                          <span className="muted" style={{ color: task.isOverdue ? 'rgba(255,160,160,0.95)' : undefined }}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
