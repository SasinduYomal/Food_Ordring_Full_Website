import api from './api';

class MenuService {
  async getAll() {
    return await api.get('/menu/admin/all');
  }

  async create({ name, category, subCategory, price, availability, image, description, vegetarian, sizes, relatedItems }) {
    // Validate price
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      throw new Error('Price must be a valid positive number');
    }
    
    const form = new FormData();
    form.append('name', name);
    form.append('category', category);
    if (subCategory) form.append('subCategory', subCategory);
    form.append('price', priceValue);
    form.append('available', availability);
    if (description) form.append('description', description);
    if (typeof vegetarian === 'boolean') form.append('vegetarian', vegetarian);
    if (image) form.append('image', image);
    
    // Add sizes if provided
    if (sizes) {
      form.append('sizes', JSON.stringify(sizes));
    }
    
    // Add related items if provided
    if (relatedItems && Array.isArray(relatedItems)) {
      form.append('relatedItems', JSON.stringify(relatedItems));
    }
    
    return await api.post('/menu', form);
  }

  async toggleAvailability(id, available) {
    return await api.put(`/menu/${id}`, { available });
  }

  async update(id, { name, category, subCategory, price, availability, description, vegetarian, image, sizes, relatedItems }) {
    // Validate price if provided
    let priceValue = undefined;
    if (price !== undefined) {
      priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue < 0) {
        throw new Error('Price must be a valid positive number');
      }
    }
    
    const hasImage = !!image;
    if (hasImage) {
      const form = new FormData();
      if (name !== undefined) form.append('name', name);
      if (category !== undefined) form.append('category', category);
      if (subCategory !== undefined) form.append('subCategory', subCategory);
      if (priceValue !== undefined) form.append('price', priceValue);
      if (availability !== undefined) form.append('available', availability);
      if (description !== undefined) form.append('description', description);
      if (typeof vegetarian === 'boolean') form.append('vegetarian', vegetarian);
      form.append('image', image);
      
      // Add sizes if provided
      if (sizes !== undefined) {
        form.append('sizes', JSON.stringify(sizes));
      }
      
      // Add related items if provided
      if (relatedItems !== undefined) {
        form.append('relatedItems', JSON.stringify(relatedItems));
      }
      
      return await api.put(`/menu/${id}`, form);
    }
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (category !== undefined) payload.category = category;
    if (subCategory !== undefined) payload.subCategory = subCategory;
    if (priceValue !== undefined) payload.price = priceValue;
    if (availability !== undefined) payload.available = availability;
    if (description !== undefined) payload.description = description;
    if (typeof vegetarian === 'boolean') payload.vegetarian = vegetarian;
    
    // Add sizes if provided
    if (sizes !== undefined) {
      payload.sizes = sizes;
    }
    
    // Add related items if provided
    if (relatedItems !== undefined) {
      payload.relatedItems = relatedItems;
    }
    
    return await api.put(`/menu/${id}`, payload);
  }

  async remove(id) {
    return await api.delete(`/menu/${id}`);
  }
}

export default new MenuService();