import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="navInner">
          <Link to="/" className="brand">
            <div className="brandMark">TM</div>
            <span className="brandName">TaskMaster</span>
          </Link>

          {user ? (
            <div className="navLinks">
              <Link to="/dashboard" className="navLink">
                Dashboard
              </Link>
              <Link to="/projects" className="navLink">
                Projects
              </Link>
              <div className="row">
                <span className="muted" style={{ fontSize: 13 }}>
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn btnDanger">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="row">
              <Link to="/login" className="btn btnGhost" style={{ textDecoration: 'none' }}>
                Login
              </Link>
              <Link to="/register" className="btn btnPrimary" style={{ textDecoration: 'none' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
