import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>📚 LMS</Link>
      <div style={styles.links}>
        <Link to="/courses" style={styles.link}>Courses</Link>
        
        {user && (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            {isAdmin && (
              <Link to="/admin/courses" style={{...styles.link, backgroundColor: '#e74c3c'}}>
                Admin Panel
              </Link>
            )}
            <span style={styles.userName}>
              {isAdmin ? '👑 ' : '👤 '}{user.name}
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
        
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2c3e50',
    color: 'white'
  },
  logo: {
    color: 'white',
    fontSize: '1.5rem',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background 0.3s'
  },
  userName: {
    color: '#ecf0f1',
    marginLeft: '1rem'
  },
  logoutBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '0.5rem'
  }
};

export default Navbar;