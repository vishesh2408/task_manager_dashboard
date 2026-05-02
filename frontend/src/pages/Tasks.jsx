import { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { ProjectContext } from '../context/ProjectContext';

export default function Tasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { projects } = useContext(ProjectContext);
  const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useContext(TaskContext);

  const project = useMemo(
    () => projects.find(p => p._id === projectId),
    [projects, projectId]
  );

  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    estimatedHours: 0,
  });

  // 🔹 FETCH TASKS
  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  // 🔹 SUBMIT FORM
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedTask) {
        await updateTask(projectId, selectedTask._id, formData);
      } else {
        await createTask(projectId, formData);
      }

      // reset
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        estimatedHours: 0,
      });

      setSelectedTask(null);
      setShowForm(false);

    } catch (err) {
      console.error('❌ Failed to save task:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 DELETE TASK
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await deleteTask(projectId, taskId);

      if (selectedTask?._id === taskId) {
        setSelectedTask(null);
        setShowForm(false);
      }

    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  // 🔹 SELECT TASK (EDIT)
  const handleSelectTask = (task) => {
    setSelectedTask(task);

    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0]
        : '',
      estimatedHours: task.estimatedHours || 0,
    });

    setShowForm(true);
  };

  const statuses = ['todo', 'in-progress', 'review', 'completed'];

  if (!project) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>

      {/* 🔹 HEADER */}
      <button onClick={() => navigate(`/projects/${projectId}`)}>
        ← Back
      </button>

      <h1>{project.name} - Tasks</h1>
      <p>{tasks.length} tasks</p>

      <button
        onClick={() => {
          setSelectedTask(null);
          setFormData({
            title: '',
            description: '',
            priority: 'medium',
            dueDate: '',
            estimatedHours: 0,
          });
          setShowForm(prev => !prev);
        }}
      >
        {showForm ? 'Cancel' : '+ New Task'}
      </button>

      {/* 🔹 FORM */}
      {showForm && (
        <form onSubmit={handleFormSubmit} style={{ marginTop: '20px' }}>

          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />

          <input
            type="number"
            value={formData.estimatedHours}
            onChange={(e) =>
              setFormData({
                ...formData,
                estimatedHours: Number(e.target.value),
              })
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : selectedTask ? 'Update' : 'Create'}
          </button>

          {selectedTask && (
            <button
              type="button"
              onClick={() => handleDeleteTask(selectedTask._id)}
            >
              Delete
            </button>
          )}
        </form>
      )}

      {/* 🔹 KANBAN */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        {statuses.map(status => {
          const filtered = tasks.filter(t => t.status === status);

          return (
            <div key={status} style={{ flex: 1 }}>
              <h3>{status} ({filtered.length})</h3>

              {filtered.map(task => (
                <div
                  key={task._id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSelectTask(task)}
                >
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>

                  {task.dueDate && (
                    <small>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

    </div>
  );
}