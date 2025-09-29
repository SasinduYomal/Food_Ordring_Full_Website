import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard/StatsCard';
import './Dashboard.css';

// Import chart components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Import services
import menuService from '../../services/menuService';
import orderService from '../../services/orderService';
import reservationService from '../../services/reservationService';
import userService from '../../services/userService';
import contactService from '../../services/contactService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalMenuItems: 0,
    pendingReservations: 0,
    unreadMessages: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [menuData, orderData, reservationData, userData, contactData] = await Promise.all([
        menuService.getAll(),
        orderService.getAll(),
        reservationService.getAllReservations(),
        userService.getAllUsers(),
        contactService.getAllMessages()
      ]);

      // Calculate stats
      const totalOrders = orderData.length;
      const totalRevenue = orderData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = orderData.filter(order => order.status === 'pending').length;
      const totalCustomers = userData.filter(user => user.role === 'customer').length;
      const totalMenuItems = menuData.length;
      const pendingReservations = reservationData.filter(res => res.status === 'Pending').length;
      const unreadMessages = contactData.filter(msg => msg.status === 'new').length;

      setStats({
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalCustomers,
        totalMenuItems,
        pendingReservations,
        unreadMessages
      });

      // Get recent orders (last 5)
      const sortedOrders = [...orderData].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);
      setRecentOrders(sortedOrders);

      // Get recent reservations (last 5)
      const sortedReservations = [...reservationData].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);
      setRecentReservations(sortedReservations);

      // Prepare chart data (last 7 days of orders)
      const chartData = prepareChartData(orderData);
      setChartData(chartData);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try refreshing the page.');
      setLoading(false);
    }
  };

  // Prepare chart data for the last 7 days
  const prepareChartData = (orders) => {
    const today = new Date();
    const dates = [];
    const orderCounts = [];
    const revenueData = [];

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      
      // Filter orders for this date
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      orderCounts.push(dayOrders.length);
      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      revenueData.push(dayRevenue / 100); // Convert cents to dollars
    }

    return {
      labels: dates,
      datasets: [
        {
          label: 'Orders',
          data: orderCounts,
          borderColor: '#4361ee',
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Revenue (Rs)',
          data: revenueData,
          borderColor: '#2ec4b6',
          backgroundColor: 'rgba(46, 196, 182, 0.1)',
          tension: 0.3,
          fill: true,
        }
      ]
    };
  };

  // Function to navigate to different sections
  const goToSection = (path) => {
    navigate(path);
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Orders & Revenue (Last 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Main admin functions data
  const adminFunctions = [
    {
      id: 1,
      title: "Menu Management",
      description: "Add/Edit/Delete food items, Upload images, set price, availability, description, Categorize items",
      icon: "🍽️",
      path: "/menu"
    },
    {
      id: 2,
      title: "Order Management",
      description: "View all incoming orders, Update order status in real-time, Assign orders to delivery staff",
      icon: "📋",
      path: "/orders"
    },
    {
      id: 3,
      title: "Reservation Management",
      description: "View all reservations by date & time, Approve/Decline reservations, Manage table availability",
      icon: "📅",
      path: "/reservations"
    },
    {
      id: 4,
      title: "Customer Management",
      description: "View registered customers, Manage customer feedback/reviews, Handle loyalty program or discounts",
      icon: "👥",
      path: "/users"
    },
    {
      id: 5,
      title: "Promotions & Discounts",
      description: "Create & manage discount codes, Offer special deals",
      icon: "🏷️",
      path: "/promotions"
    },
    {
      id: 6,
      title: "Analytics Dashboard",
      description: "Daily/weekly/monthly sales reports, Most ordered dishes, Peak reservation times, Customer insights",
      icon: "📊",
      path: "/reports"
    }
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <div className="error-message">
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={fetchData} className="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchData}>
            <span className="icon">↻</span>
            Refresh Data
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stats-grid">
          <StatsCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon="📋" 
            color="#4361ee" 
          />
          <StatsCard 
            title="Total Revenue" 
            value={`Rs ${(stats.totalRevenue/100).toFixed(2)}`} 
            icon="💰" 
            color="#2ec4b6" 
          />
          <StatsCard 
            title="Pending Orders" 
            value={stats.pendingOrders} 
            icon="⏳" 
            color="#ff9f1c" 
          />
          <StatsCard 
            title="Total Customers" 
            value={stats.totalCustomers} 
            icon="👥" 
            color="#e71d36" 
          />
          <StatsCard 
            title="Menu Items" 
            value={stats.totalMenuItems} 
            icon="🍽️" 
            color="#6a0dad" 
          />
          <StatsCard 
            title="Pending Reservations" 
            value={stats.pendingReservations} 
            icon="📅" 
            color="#f77f00" 
          />
          <StatsCard 
            title="Unread Messages" 
            value={stats.unreadMessages} 
            icon="✉️" 
            color="#0077b6" 
          />
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="card">
          <div className="card-body" style={{ height: '400px' }}>
            {chartData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <div className="empty-state-text">No chart data available</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Admin Functions Section */}
      <div className="admin-functions-section">
        <h2>Main Admin Functions</h2>
        <div className="functions-grid">
          {adminFunctions.map((func) => (
            <div 
              key={func.id} 
              className="function-card"
              onClick={() => goToSection(func.path)}
            >
              <div className="function-icon">{func.icon}</div>
              <h3>{func.title}</h3>
              <p>{func.description}</p>
              <button className="manage-btn">Manage</button>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          <div className="card">
            <div className="card-header">
              <h3>Recent Orders</h3>
              <button className="view-all-btn" onClick={() => goToSection('/orders')}>View All</button>
            </div>
            <div className="card-body">
              {recentOrders.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-6)}</td>
                          <td>{order.user ? order.user.name : 'Guest'}</td>
                          <td>Rs {(order.totalAmount / 100).toFixed(2)}</td>
                          <td><span className={`status ${order.status}`}>{order.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-text">No recent orders</div>
                  <p>Orders will appear here when customers place them</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Recent Reservations</h3>
              <button className="view-all-btn" onClick={() => goToSection('/reservations')}>View All</button>
            </div>
            <div className="card-body">
              {recentReservations.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Date & Time</th>
                        <th>Guests</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReservations.map((reservation) => (
                        <tr key={reservation._id}>
                          <td>{reservation.name}</td>
                          <td>{new Date(reservation.date).toLocaleDateString()} at {reservation.time}</td>
                          <td>{reservation.guests}</td>
                          <td><span className={`status ${reservation.status.toLowerCase()}`}>{reservation.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📅</div>
                  <div className="empty-state-text">No recent reservations</div>
                  <p>Reservations will appear here when customers make them</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;