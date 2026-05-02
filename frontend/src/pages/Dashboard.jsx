import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ProjectContext } from '../context/ProjectContext';
import { TaskContext } from '../context/TaskContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { projects, fetchProjects } = useContext(ProjectContext);
  const { tasks, fetchTasks, fetchTaskStats } = useContext(TaskContext);
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);

  const effectiveSelectedProject = useMemo(() => {
    return selectedProject ?? projects[0]?._id ?? null;
  }, [projects, selectedProject]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (effectiveSelectedProject) {
      fetchTasks(effectiveSelectedProject);
      fetchTaskStats(effectiveSelectedProject);
    }
  }, [effectiveSelectedProject, fetchTasks, fetchTaskStats]);

  const overdueTasks = tasks.filter(t => t.isOverdue && t.status !== 'completed');
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="card cardPad" style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: 0.2 }}>
            Welcome, <span style={{ opacity: 0.9 }}>{user?.name}</span>
          </h1>
          <p className="muted" style={{ marginTop: 8 }}>Track your projects and tasks at a glance</p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 18 }}>
          <div className="card cardPad" style={{ textAlign: 'center' }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 650, marginBottom: 8 }}>Total Projects</div>
            <div style={{ fontSize: 28, fontWeight: 950, color: '#3b82f6' }}>{projects.length}</div>
          </div>
          <div className="card cardPad" style={{ textAlign: 'center' }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 650, marginBottom: 8 }}>Total Tasks</div>
            <div style={{ fontSize: 28, fontWeight: 950, color: '#10b981' }}>{tasks.length}</div>
          </div>
          <div className="card cardPad" style={{ textAlign: 'center' }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 650, marginBottom: 8 }}>Active</div>
            <div style={{ fontSize: 28, fontWeight: 950, color: '#f59e0b' }}>{activeTasks.length}</div>
          </div>
          <div className="card cardPad" style={{ textAlign: 'center' }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 650, marginBottom: 8 }}>Completed</div>
            <div style={{ fontSize: 28, fontWeight: 950, color: '#8b5cf6' }}>{completedTasks.length}</div>
          </div>
          <div className="card cardPad" style={{ textAlign: 'center' }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 650, marginBottom: 8 }}>Overdue</div>
            <div style={{ fontSize: 28, fontWeight: 950, color: '#ef4444' }}>{overdueTasks.length}</div>
          </div>
          <div className="card cardPad" style={{ textAlign: 'center' }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 650, marginBottom: 8 }}>Completion Rate</div>
            <div style={{ fontSize: 28, fontWeight: 950, color: '#06b6d4' }}>{completionRate}%</div>
          </div>
        </div>

        {/* Project Selector */}
        <div className="card cardPad" style={{ marginBottom: 18 }}>
          <label className="label">Select project</label>
          <select
            value={effectiveSelectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="select"
          >
            <option value="">Choose a project...</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'start' }}>
          {/* Tasks by Status */}
          <div>
            <div className="card cardPad">
              <h2 className="cardTitle">Active tasks</h2>
              
              {activeTasks.length === 0 ? (
                <p className="muted" style={{ marginTop: 12 }}>No active tasks. Create one to get started!</p>
              ) : (
                <div className="stack" style={{ marginTop: 12, gap: 10 }}>
                  {activeTasks.slice(0, 8).map(task => (
                    <div
                      key={task._id}
                      className="card"
                      style={{ padding: 14, cursor: 'pointer' }}
                      onClick={() => navigate(`/projects/${task.project}/tasks`)}
                    >
                      <div className="row between" style={{ alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 900 }}>{task.title}</p>
                          <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>{task.description}</p>
                        </div>
                        <span className="badge">{task.priority}</span>
                      </div>
                      <div className="row between" style={{ marginTop: 10, fontSize: 12.5 }}>
                        <span className="badge">{task.status}</span>
                        {task.dueDate && (
                          <span className="muted" style={{ color: task.isOverdue ? 'rgba(255,160,160,0.95)' : undefined }}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="stack">
            {/* Projects Card */}
            <div className="card cardPad">
              <h3 className="cardTitle">Your projects</h3>
              <div className="stack" style={{ marginTop: 12, gap: 10 }}>
                {projects.length === 0 ? (
                  <p className="muted">No projects yet</p>
                ) : (
                  projects.map(p => (
                    <button
                      key={p._id}
                      onClick={() => {
                        setSelectedProject(p._id);
                        navigate(`/projects/${p._id}`);
                      }}
                      className="btn btnGhost"
                      style={{
                        textAlign: 'left',
                        padding: 12,
                        borderColor: effectiveSelectedProject === p._id ? 'rgba(34,211,238,0.35)' : undefined,
                        background: effectiveSelectedProject === p._id ? 'rgba(34,211,238,0.08)' : undefined,
                      }}
                    >
                      <p style={{ fontWeight: 900 }}>{p.name}</p>
                      <p className="muted" style={{ marginTop: 4, fontSize: 12.5 }}>{p.members.length} members</p>
                    </button>
                  ))
                )}
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}
