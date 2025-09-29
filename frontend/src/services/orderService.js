import api from './api';

class OrderService {
  // Set token for authenticated requests
  setToken(token) {
    api.setToken(token);
  }

  // Remove token
  removeToken() {
    api.removeToken();
  }

  // Logout user (remove token)
  logout() {
    api.removeToken();
  }

  // Create a new order
  async createOrder(orderData) {
    return await api.post('/orders', orderData);
  }

  // Get order by ID
  async getOrderById(id) {
    return await api.get(`/orders/${id}`);
  }

  // Get logged in user's orders
  async getMyOrders() {
    console.log('Fetching my orders from API...');
    try {
      // Log the token being used
      const token = localStorage.getItem('token');
      console.log('Token being used for orders fetch:', token ? `${token.substring(0, 20)}...` : 'null');
      
      // Add a small delay to ensure token is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const orders = await api.get('/orders/myorders');
      console.log('Orders fetched successfully:', orders);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get all orders (admin only)
  async getAllOrders() {
    return await api.get('/orders');
  }

  // Update order to delivered (admin only)
  async updateOrderToDelivered(id) {
    return await api.put(`/orders/${id}/deliver`, {});
  }

  // Associate guest orders with user
  async associateGuestOrders(orderIds) {
    console.log('AssociateGuestOrders called with orderIds:', orderIds);
    try {
      const result = await api.post('/orders/associate-guest-orders', { orderIds });
      console.log('AssociateGuestOrders result:', result);
      return result;
    } catch (error) {
      console.error('Error in associateGuestOrders:', error);
      throw error;
    }
  }
  
  // Get order counts for menu items
  async getOrderCountsForMenuItems() {
    try {
      const result = await api.get('/orders/counts/menu-items');
      return result;
    } catch (error) {
      console.error('Error fetching order counts for menu items:', error);
      throw error;
    }
  }
}

export default new OrderService();