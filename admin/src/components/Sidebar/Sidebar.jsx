import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <ul>
          <li>
            <Link 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/menu" 
              className={isActive('/menu') ? 'active' : ''}
            >
              <i className="fas fa-utensils"></i>
              <span>Menu Management</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/orders" 
              className={isActive('/orders') ? 'active' : ''}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Order Management</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/reservations" 
              className={isActive('/reservations') ? 'active' : ''}
            >
              <i className="fas fa-calendar-alt"></i>
              <span>Reservation Management</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/users" 
              className={isActive('/users') ? 'active' : ''}
            >
              <i className="fas fa-users"></i>
              <span>Customer Management</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/contact-messages" 
              className={isActive('/contact-messages') ? 'active' : ''}
            >
              <i className="fas fa-envelope"></i>
              <span>Contact Messages</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/promotions" 
              className={isActive('/promotions') ? 'active' : ''}
            >
              <i className="fas fa-tags"></i>
              <span>Promotions & Discounts</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/reports" 
              className={isActive('/reports') ? 'active' : ''}
            >
              <i className="fas fa-chart-bar"></i>
              <span>Analytics Dashboard</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;