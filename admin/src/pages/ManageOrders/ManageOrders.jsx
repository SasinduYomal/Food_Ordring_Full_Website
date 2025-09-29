import { useEffect, useState } from 'react';
import './ManageOrders.css';
import orderService from '../../services/orderService';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const markDelivered = async (id) => {
    try {
      await orderService.updateToDelivered(id);
      setOrders(prev => prev.map(o => (o._id === id ? { ...o, status: 'delivered' } : o)));
    } catch (err) {
      setError(err.message || 'Failed to update order');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'confirmed': return 'accepted';
      case 'preparing': return 'accepted';
      case 'out-for-delivery': return 'accepted';
      case 'delivered': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  // Function to render special instructions and special items for an order item
  const renderCustomizations = (item) => {
    if (!item.customizations) return null;
    
    const { specialInstructions, specialItems } = item.customizations;
    
    return (
      <div className="customizations">
        {specialInstructions && (
          <div className="special-instructions">
            <strong>Special Instructions:</strong> {specialInstructions}
          </div>
        )}
        {specialItems && specialItems.length > 0 && (
          <div className="special-items">
            <strong>Add Special Things:</strong> {specialItems.join(', ')}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await orderService.getAll();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="manage-orders">
      <div className="orders-header">
        <h1>Order Management</h1>
      </div>

      <div className="orders-list">
        <h2>All Orders</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.user ? (order.user.name || order.user._id) : 'Guest'}</td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div>
                          {item.menuItem?.name || 'Unknown Item'} (x{item.quantity})
                        </div>
                        {renderCustomizations(item)}
                      </div>
                    ))}
                  </td>
                  <td>Rs {Number(order.totalAmount).toFixed(2)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status !== 'delivered' && (
                      <button 
                        className="action-btn complete-btn"
                        onClick={() => markDelivered(order._id)}
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;