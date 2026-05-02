import { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { ProjectContext } from '../context/ProjectContext';

const styles = {
  container: {
    minHeight: '100vh',
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
    color: 'var(--primary-1)',
    marginBottom: '1rem',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  headerTitle: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: 'var(--text)',
  },
  headerSubtitle: {
    color: 'var(--muted)',
    marginTop: '0.5rem',
  },
  newTaskButton: {
    padding: '0.75rem 1.5rem',
    background: 'var(--primary-1)',
    color: 'var(--primary-text)',
    fontWeight: '500',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
  },
  formContainer: {
    backgroundColor: 'var(--surface)',
    borderRadius: '0.5rem',
    boxShadow: 'var(--shadow-md)',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--text)',
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
    color: 'var(--muted)',
    marginBottom: '0.25rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'var(--bg-elev)',
    color: 'var(--text)',
  },
  select: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'var(--bg-elev)',
    color: 'var(--text)',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    outline: 'none',
    height: '6rem',
    resize: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'var(--bg-elev)',
    color: 'var(--text)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
    paddingTop: '1rem',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--success)',
    color: 'var(--primary-text)',
    fontWeight: '500',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--danger)',
    color: 'var(--primary-text)',
    fontWeight: '500',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
  },
  kanbanBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  kanbanColumn: {
    backgroundColor: 'var(--surface)',
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
    color: 'var(--text)',
    textTransform: 'capitalize',
  },
  taskCount: {
    backgroundColor: 'var(--bg-elev)',
    color: 'var(--muted)',
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
    backgroundColor: 'var(--card)',
    borderRadius: '0.5rem',
    boxShadow: 'var(--shadow-sm)',
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
    color: 'var(--text)',
  },
  priorityBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  priorityColors: {
    low: { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#bfdbfe' },
    medium: { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fde68a' },
    high: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fecaca' },
  },
  taskDescription: {
    fontSize: '0.875rem',
    color: 'var(--muted)',
    marginBottom: '1rem',
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: 'var(--faint)',
  },
  dueDate: {
    fontWeight: '500',
  },
  overdue: {
    color: 'var(--danger)',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'var(--muted)',
  },
  mdGrid2: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
};

export default function Tasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects } = useContext(ProjectContext);
  const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useContext(TaskContext);
  
  const project = useMemo(() => projects.find(p => p._id === projectId), [projects, projectId]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    estimatedHours: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      fetchTasks(projectId);
    }
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
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '', estimatedHours: 0 });
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
    });
    setShowForm(true);
  };

  const statuses = ['todo', 'in-progress', 'review', 'completed'];

  if (!project) {
    return (
      <div style={styles.loading}>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <button
              onClick={() => navigate(`/projects/${projectId}`)}
              style={styles.backButton}
            >
              ← Back
            </button>
            <h1 style={styles.headerTitle}>{project.name} - Tasks</h1>
            <p style={styles.headerSubtitle}>{tasks.length} tasks</p>
          </div>
          <button
            onClick={() => {
              setSelectedTask(null);
              setFormData({ title: '', description: '', priority: 'medium', dueDate: '', estimatedHours: 0 });
              setShowForm(!showForm);
            }}
            style={styles.newTaskButton}
          >
            {showForm && !selectedTask ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>
              {selectedTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleFormSubmit} style={styles.form}>
              <div style={{...styles.formGrid, ...styles.mdGrid2}}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Task Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={styles.input} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} style={styles.select}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={styles.textarea} />
              </div>
              <div style={{...styles.formGrid, ...styles.mdGrid2}}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Estimated Hours</label>
                  <input type="number" value={formData.estimatedHours} onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })} style={styles.input} />
                </div>
              </div>
              <div style={styles.buttonGroup}>
                <button type="submit" disabled={loading} style={{...styles.submitButton, ...(loading ? {opacity: 0.5} : {})}}>
                  {loading ? 'Saving...' : selectedTask ? 'Update Task' : 'Create Task'}
                </button>
                {selectedTask && (
                  <button type="button" onClick={() => handleDeleteTask(selectedTask._id)} style={styles.deleteButton}>
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Kanban Board */}
        <div style={styles.kanbanBoard}>
          {statuses.map(status => {
            const tasksInStatus = tasks.filter(t => t.status === status);
            return (
              <div key={status} style={styles.kanbanColumn}>
                <div style={styles.kanbanColumnHeader}>
                  <h3 style={styles.kanbanColumnTitle}>{status.replace('-', ' ')}</h3>
                  <span style={styles.taskCount}>{tasksInStatus.length}</span>
                </div>
                <div style={styles.kanbanTasks}>
                  {tasksInStatus.map(task => (
                    <div key={task._id} style={styles.taskCard} onClick={() => handleSelectTask(task)}>
                      <div style={styles.taskCardHeader}>
                        <p style={styles.taskTitle}>{task.title}</p>
                        <span style={{...styles.priorityBadge, ...styles.priorityColors[task.priority]}}>{task.priority}</span>
                      </div>
                      <p style={styles.taskDescription}>{task.description}</p>
                      <div style={styles.taskFooter}>
                        {task.dueDate && (
                          <span style={{...styles.dueDate, ...(task.isOverdue ? styles.overdue : {})}}>
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
