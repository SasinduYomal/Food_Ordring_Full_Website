import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.log('Logout button clicked');
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h3>Food Admin</h3>
      </div>
      <div className="navbar-menu">
        <div className="navbar-user">
          <span className="user-name">{user?.name || 'Admin'}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;