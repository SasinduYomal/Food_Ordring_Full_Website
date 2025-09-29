import api from './api';

class MenuService {
  // Get all menu items
  async getMenuItems() {
    console.log('MenuService: Fetching menu items');
    try {
      const result = await api.get('/menu');
      console.log('MenuService: Successfully fetched menu items', result);
      return result;
    } catch (error) {
      console.error('MenuService: Error fetching menu items', error);
      throw error;
    }
  }

  // Get menu item by ID
  async getMenuItemById(id) {
    console.log('MenuService: Fetching menu item by ID', id);
    try {
      const result = await api.get(`/menu/${id}`);
      console.log('MenuService: Successfully fetched menu item', result);
      return result;
    } catch (error) {
      console.error('MenuService: Error fetching menu item', error);
      throw error;
    }
  }

  // Create a new menu item (admin only)
  async createMenuItem(menuItemData) {
    return await api.post('/menu', menuItemData);
  }

  // Update a menu item (admin only)
  async updateMenuItem(id, menuItemData) {
    return await api.put(`/menu/${id}`, menuItemData);
  }

  // Delete a menu item (admin only)
  async deleteMenuItem(id) {
    return await api.delete(`/menu/${id}`);
  }
}

export default new MenuService();