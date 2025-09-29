import { useEffect, useState } from 'react';
import './ManageMenu.css';
import menuService from '../../services/menuService';
import config from '../../services/config';

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'main',
    subCategory: '',
    description: '',
    price: '',
    availability: true,
    vegetarian: false,
    image: null,
    imagePreview: '',
    relatedItems: []
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate price
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      setError('Please enter a valid price (must be a positive number)');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare data for submission
      const submissionData = {
        name: formData.name,
        category: formData.category,
        price: priceValue,
        description: formData.description,
        vegetarian: formData.vegetarian,
        availability: formData.availability,
        image: formData.image,
        relatedItems: formData.relatedItems
      };
      
      // Add subCategory only if it's not empty
      if (formData.subCategory) {
        submissionData.subCategory = formData.subCategory;
      }
      
      if (editingId) {
        const updated = await menuService.update(editingId, submissionData);
        setMenuItems(prev => prev.map(m => ((m._id || m.id) === editingId ? updated : m)));
      } else {
        const created = await menuService.create(submissionData);
        setMenuItems(prev => [created, ...prev]);
      }
      setFormData({ 
        name: '', 
        category: 'main', 
        subCategory: '',
        description: '', 
        price: '', 
        availability: true, 
        vegetarian: false, 
        image: null, 
        imagePreview: '',
        relatedItems: []
      });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (!file) {
      setFormData(prev => ({ ...prev, image: null, imagePreview: '' }));
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: file, imagePreview: previewUrl }));
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError('');
        const items = await menuService.getAll();
        setMenuItems(items);
      } catch (err) {
        setError(err.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleAvailability = async (id) => {
    try {
      const item = menuItems.find(i => (i._id || i.id) === id);
      if (!item) return;
      const next = !(item.available ?? item.availability);
      await menuService.toggleAvailability(id, next);
      setMenuItems(prev => prev.map(i => ((i._id || i.id) === id ? { ...i, available: next } : i)));
    } catch (err) {
      setError(err.message || 'Failed to update availability');
    }
  };

  const deleteItem = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this item? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await menuService.remove(id);
      setMenuItems(prev => prev.filter(item => (item._id || item.id) !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    }
  };

  // Function to construct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's an absolute path starting with /, prepend the base URL
    if (imageUrl.startsWith('/')) {
      return `${config.ASSET_BASE_URL}${imageUrl}`;
    }
    
    // Otherwise, return as is (relative path)
    return imageUrl;
  };

  const startEdit = (item) => {
    setEditingId(item._id || item.id);
    setFormData({
      name: item.name || '',
      category: item.category || 'main',
      subCategory: item.subCategory || '',
      description: item.description || '',
      price: String(item.price ?? ''),
      availability: item.available ?? item.availability ?? true,
      vegetarian: !!item.vegetarian,
      image: null,
      imagePreview: item.imageUrl ? getImageUrl(item.imageUrl) : '',
      relatedItems: item.relatedItems || []
    });
    setShowForm(true);
  };

  // Define subcategories for main course
  const subCategories = [
    { id: '', name: 'None' },
    { id: 'rice', name: 'Fried Rice' }, // Changed from 'Rice' to 'Fried Rice'
    { id: 'kottu', name: 'Kottu' },
    { id: 'pesta', name: 'Pesta' },
    { id: 'noodles', name: 'Noodles' }
  ];

  return (
    <div className="manage-menu">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="menu-form">
          <h2>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Item Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.imagePreview && (
                <div className="image-preview" style={{ marginTop: '8px' }}>
                  <img src={formData.imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="starter">Starter</option>
                <option value="main">Main</option>
                <option value="dessert">Dessert</option>
                <option value="drink">Drink</option>
              </select>
            </div>
            
            {/* Show subcategory selection only for main category */}
            {formData.category === 'main' && (
              <div className="form-group">
                <label htmlFor="subCategory">Sub Category</label>
                <select 
                  id="subCategory" 
                  name="subCategory" 
                  value={formData.subCategory} 
                  onChange={handleInputChange}
                >
                  {subCategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Base Price (RS)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleInputChange}
                />
                Available
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="vegetarian"
                  checked={formData.vegetarian}
                  onChange={handleInputChange}
                />
                Vegetarian
              </label>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : (editingId ? 'Update Item' : 'Add Item')}
            </button>
          </form>
        </div>
      )}

      <div className="menu-list">
        <h2>Menu Items</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item._id || item.id}>
                  <td>
                    {item.imageUrl ? (
                      <img src={getImageUrl(item.imageUrl)} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <span style={{ color: '#999' }}>-</span>
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.subCategory === 'rice' ? 'Fried Rice' : (item.subCategory || '-')}</td> {/* Display Fried Rice instead of rice */}
                  <td>
                    RS.{Number(item.price).toFixed(2)}
                    {item.sizes?.small?.price && (
                      <div>Small: RS.{Number(item.sizes.small.price).toFixed(2)}</div>
                    )}
                    {item.sizes?.large?.price && (
                      <div>Large: RS.{Number(item.sizes.large.price).toFixed(2)}</div>
                    )}
                  </td>
                  <td>
                    <span className={`status ${(item.available ?? item.availability) ? 'available' : 'unavailable'}`}>
                      {(item.available ?? item.availability) ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={() => toggleAvailability(item._id || item.id)}
                    >
                      {(item.available ?? item.availability) ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => startEdit(item)}
                      style={{ marginLeft: '8px' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => deleteItem(item._id || item.id)}
                      style={{ marginLeft: '8px' }}
                    >
                      Delete
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

export default ManageMenu;