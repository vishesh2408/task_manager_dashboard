import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  headerTitle: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    color: '#475569',
    marginTop: '0.5rem',
  },
  newProjectButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(to right, #8b5cf6, #06b6d4)',
    color: 'white',
    fontWeight: '500',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
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
    gridTemplateColumns: 'repeat(1, 1fr)',
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
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#16a34a',
    color: 'white',
    fontWeight: '500',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  error: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#b91c1c',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '3rem',
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#475569',
    marginBottom: '1rem',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '1.5rem',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer',
    borderTop: '4px solid',
    borderImage: 'linear-gradient(to right, #8b5cf6, #06b6d4) 1',
  },
  projectCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  projectCardTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1e293b',
    transition: 'color 0.2s',
  },
  projectCardMembers: {
    fontSize: '0.875rem',
    color: '#475569',
    marginTop: '0.25rem',
  },
  projectStatus: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  statusColors: {
    active: { backgroundColor: '#dcfce7', color: '#166534' },
    completed: { backgroundColor: '#dbeafe', color: '#1e40af' },
    default: { backgroundColor: '#f1f5f9', color: '#334155' },
  },
  projectCardBody: {
    color: '#475569',
    marginBottom: '1.5rem',
    height: '3rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  projectCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#64748b',
  },
  dueDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  deleteButton: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  projectCardHover: {
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  projectCardTitleHover: {
    color: '#7c3aed',
  },
  deleteButtonHover: {
    opacity: 1,
  },
  buttonHover: {
    opacity: 0.9,
  },
  submitButtonHover: {
    backgroundColor: '#15803d',
  },
  inputFocus: {
    boxShadow: '0 0 0 2px #c4b5fd',
  }
};

export default function Projects() {
  const { projects, fetchProjects, createProject, deleteProject, error } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', dueDate: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject(formData);
      setFormData({ name: '', description: '', dueDate: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation(); // Prevent navigation
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="row between" style={{ marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 850, letterSpacing: 0.2 }}>Projects</h1>
            <p className="muted" style={{ marginTop: 6 }}>Manage and organize your projects</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? 'btn btnGhost' : 'btn btnPrimary'}
          >
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {/* Create Project Form */}
        {showForm && (
          <div className="card cardPad" style={{ marginBottom: 18 }}>
            <h2 className="cardTitle">Create new project</h2>
            <form onSubmit={handleCreateProject} className="stack" style={{ marginTop: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="label">Project name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <label className="label">Due date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea"
                  placeholder="Enter project description"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btnPrimary"
                style={{ width: 'fit-content' }}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        )}

        {error && <div className="alert" style={{ marginBottom: 16 }}>{error}</div>}

        {/* Projects Grid */}
        {projects.length === 0 && !loading ? (
          <div className="card cardPad" style={{ textAlign: 'center', padding: 28 }}>
            <p className="muted" style={{ marginBottom: 14 }}>No projects yet. Create one to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btnPrimary"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {projects.map(project => (
              <div
                key={project._id}
                className="card cardPad"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <div className="row between" style={{ alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 850, letterSpacing: 0.15 }}>{project.name}</h3>
                    <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>{project.members.length} members</p>
                  </div>
                  <span className="badge">{project.status || 'active'}</span>
                </div>
                <p className="muted" style={{ marginTop: 12, minHeight: 44, overflow: 'hidden' }}>
                  {project.description}
                </p>
                <div className="row between" style={{ marginTop: 14, fontSize: 13 }}>
                  {project.dueDate && (
                    <span className="muted">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                  )}
                  {user?._id === project.owner && (
                     <button
                        onClick={(e) => handleDeleteProject(e, project._id)}
                        className="btn btnDanger"
                        style={{ padding: '8px 10px' }}
                     >
                        Delete
                     </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
