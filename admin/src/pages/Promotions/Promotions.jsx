import { useState } from 'react';
import './Promotions.css';

const Promotions = () => {
  const [promotions, setPromotions] = useState([
    // Sample data - in a real app this would come from an API
    { id: 1, code: 'WELCOME10', discount: '10%', type: 'Percentage', status: 'Active', expiry: '2025-12-31' },
    { id: 2, code: 'SAVE20', discount: 'Rs 20', type: 'Fixed Amount', status: 'Active', expiry: '2025-11-30' },
    { id: 3, code: 'HAPPYHOUR', discount: '15%', type: 'Percentage', status: 'Inactive', expiry: '2025-10-15' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'Percentage',
    expiry: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call
    const newPromotion = {
      id: promotions.length + 1,
      ...formData,
      status: 'Active'
    };
    setPromotions(prev => [...prev, newPromotion]);
    setFormData({ code: '', discount: '', type: 'Percentage', expiry: '' });
    setShowForm(false);
  };

  const toggleStatus = (id) => {
    setPromotions(prev => 
      prev.map(promo => 
        promo.id === id 
          ? { ...promo, status: promo.status === 'Active' ? 'Inactive' : 'Active' } 
          : promo
      )
    );
  };

  return (
    <div className="promotions">
      <div className="promotions-header">
        <h1>Promotions & Discounts</h1>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Promotion'}
        </button>
      </div>

      {showForm && (
        <div className="promotion-form">
          <h2>Create New Promotion</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="code">Promo Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="discount">Discount</label>
                <input
                  type="text"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="expiry">Expiry Date</label>
              <input
                type="date"
                id="expiry"
                name="expiry"
                value={formData.expiry}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">Create Promotion</button>
          </form>
        </div>
      )}

      <div className="promotions-list">
        <h2>Active Promotions</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map(promo => (
                <tr key={promo.id}>
                  <td>{promo.code}</td>
                  <td>{promo.discount}</td>
                  <td>{promo.type}</td>
                  <td>{promo.expiry}</td>
                  <td>
                    <span className={`status ${promo.status.toLowerCase()}`}>
                      {promo.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={() => toggleStatus(promo.id)}
                    >
                      {promo.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
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

export default Promotions;