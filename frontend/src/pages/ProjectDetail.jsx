import { useContext, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
  },
  projectInfoCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#334155',
    marginBottom: '0.5rem',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
  },
  statusColors: {
    active: { backgroundColor: '#dcfce7', color: '#166534' },
    completed: { backgroundColor: '#dbeafe', color: '#1e40af' },
    default: { backgroundColor: '#f1f5f9', color: '#334155' },
  },
  dueDateText: {
    color: '#1e293b',
    fontWeight: '500',
  },
  viewTasksButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(to right, #8b5cf6, #06b6d4)',
    color: 'white',
    fontWeight: '500',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    alignSelf: 'flex-start',
  },
  membersCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
  },
  membersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  addMemberButton: {
    color: '#7c3aed',
    fontSize: '0.875rem',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  addMemberForm: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem',
    outline: 'none',
  },
  submitMemberButton: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#16a34a',
    color: 'white',
    borderRadius: '0.25rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
  },
  memberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  memberItem: {
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
  },
  memberItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  memberName: {
    fontWeight: '500',
    color: '#1e293b',
  },
  memberEmail: {
    fontSize: '0.75rem',
    color: '#475569',
  },
  removeMemberButton: {
    color: '#dc2626',
    fontSize: '0.875rem',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  roleColors: {
    owner: { backgroundColor: '#f3e8ff', color: '#7c3aed' },
    admin: { backgroundColor: '#dbeafe', color: '#1e40af' },
    member: { backgroundColor: '#f1f5f9', color: '#334155' },
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
  lgColSpan2: {
    '@media (min-width: 1024px)': {
      gridColumn: 'span 2 / span 2',
    },
  },
  lgGrid: {
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  }
};

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { projects, addMember, removeMember } = useContext(ProjectContext);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [loading, setLoading] = useState(false);

  const project = useMemo(() => {
    return projects.find(p => p._id === projectId) ?? null;
  }, [projects, projectId]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMember(projectId, newMemberEmail, newMemberRole);
      setNewMemberEmail('');
      setNewMemberRole('member');
      setShowMemberForm(false);
    } catch (err) {
      console.error('Failed to add member:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member from the project?')) {
      try {
        await removeMember(projectId, memberId);
      } catch (err) {
        console.error('Failed to remove member:', err);
      }
    }
  };

  if (!project) {
    return (
      <div className="authPage">
        <div className="spinner" />
      </div>
    );
  }

  const isOwner = project.owner._id === user?.id;

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <button onClick={() => navigate('/projects')} className="btn btnGhost">
            ← Back to Projects
          </button>
          <h1 style={{ marginTop: 12, fontSize: 30, fontWeight: 900, letterSpacing: 0.2 }}>
            {project.name}
          </h1>
          <p className="muted" style={{ marginTop: 8 }}>
            {project.description}
          </p>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {/* Project Info */}
          <div className="card cardPad">
            <h2 className="cardTitle">Project information</h2>
            <div className="stack" style={{ marginTop: 14 }}>
              <div>
                <label className="label">Project status</label>
                <span className="badge">{project.status}</span>
              </div>

              {project.dueDate && (
                <div>
                  <label className="label">Due date</label>
                  <p style={{ fontWeight: 750 }}>{new Date(project.dueDate).toLocaleDateString()}</p>
                </div>
              )}

              <button
                onClick={() => navigate(`/projects/${projectId}/tasks`)}
                className="btn btnPrimary"
                style={{ width: 'fit-content' }}
              >
                View Tasks
              </button>
            </div>
          </div>

          {/* Members */}
          <div className="card cardPad">
            <div className="row between" style={{ marginBottom: 12 }}>
              <h2 className="cardTitle">Team members</h2>
              {isOwner && (
                <button
                  onClick={() => setShowMemberForm(!showMemberForm)}
                  className={showMemberForm ? 'btn btnGhost' : 'btn btnPrimary'}
                >
                  {showMemberForm ? 'Close' : '+ Add'}
                </button>
              )}
            </div>

            {showMemberForm && isOwner && (
              <form onSubmit={handleAddMember} className="stack" style={{ marginBottom: 14 }}>
                <input
                  type="text"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="input"
                  placeholder="User Email"
                  required
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="select"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" disabled={loading} className="btn btnPrimary" style={{ width: 'fit-content' }}>
                  {loading ? 'Adding...' : 'Add member'}
                </button>
              </form>
            )}

            <div className="stack" style={{ gap: 10 }}>
              {project.members.map(member => (
                <div key={member.user._id} className="card" style={{ padding: 14 }}>
                  <div className="row between" style={{ alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: 850 }}>{member.user.name}</p>
                      <p className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{member.user.email}</p>
                    </div>
                    {isOwner && member.user._id !== project.owner._id && (
                      <button
                        onClick={() => handleRemoveMember(member.user._id)}
                        className="btn btnDanger"
                        style={{ padding: '8px 10px' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <span className="badge" style={{ marginTop: 10 }}>
                    {member.user._id === project.owner._id ? 'Owner' : member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
