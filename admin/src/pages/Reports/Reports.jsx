import { useState } from 'react';
import './Reports.css';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');

  // Sample data - in a real app this would come from an API
  const salesData = [
    { period: 'Monday', amount: 1200 },
    { period: 'Tuesday', amount: 1900 },
    { period: 'Wednesday', amount: 1500 },
    { period: 'Thursday', amount: 2200 },
    { period: 'Friday', amount: 2800 },
    { period: 'Saturday', amount: 3500 },
    { period: 'Sunday', amount: 2400 }
  ];

  const popularItems = [
    { name: 'Margherita Pizza', orders: 42 },
    { name: 'Caesar Salad', orders: 38 },
    { name: 'Grilled Salmon', orders: 35 },
    { name: 'Chocolate Cake', orders: 30 },
    { name: 'Iced Coffee', orders: 28 }
  ];

  const renderSalesReport = () => (
    <div className="report-section">
      <h3>Daily Sales Report</h3>
      <div className="chart-container">
        <div className="chart">
          {salesData.map((item, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar" 
                style={{ height: `${(item.amount / 4000) * 200}px` }}
              >
                <span className="bar-value">Rs {item.amount}</span>
              </div>
              <span className="bar-label">{item.period}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPopularItemsReport = () => (
    <div className="report-section">
      <h3>Most Ordered Dishes</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Dish Name</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {popularItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.orders} orders</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="reports">
      <div className="reports-header">
        <h1>Analytics Dashboard</h1>
      </div>

      <div className="report-filters">
        <button 
          className={`filter-btn ${reportType === 'sales' ? 'active' : ''}`}
          onClick={() => setReportType('sales')}
        >
          Sales Report
        </button>
        <button 
          className={`filter-btn ${reportType === 'popular' ? 'active' : ''}`}
          onClick={() => setReportType('popular')}
        >
          Popular Items
        </button>
        <button 
          className={`filter-btn ${reportType === 'reservations' ? 'active' : ''}`}
          onClick={() => setReportType('reservations')}
        >
          Reservation Trends
        </button>
      </div>

      {reportType === 'sales' && renderSalesReport()}
      {reportType === 'popular' && renderPopularItemsReport()}
      
      {reportType === 'reservations' && (
        <div className="report-section">
          <h3>Peak Reservation Times</h3>
          <div className="insights">
            <div className="insight-card">
              <h4>Busiest Day</h4>
              <p>Friday</p>
            </div>
            <div className="insight-card">
              <h4>Peak Hours</h4>
              <p>7:00 PM - 9:00 PM</p>
            </div>
            <div className="insight-card">
              <h4>Average Party Size</h4>
              <p>3.2 people</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;