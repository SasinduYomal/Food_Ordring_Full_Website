import api from './api';

class UserService {
  // Get all users (admin only)
  async getAllUsers() {
    try {
      console.log('UserService: Fetching all users');
      const response = await api.get('/users');
      console.log('UserService: Users fetched successfully', response);
      return response;
    } catch (error) {
      console.error('UserService: Error fetching users', error);
      throw error;
    }
  }

  // Update user status (admin only)
  async updateUserStatus(userId, isActive) {
    try {
      console.log('UserService: Updating user status', userId, isActive);
      const response = await api.put(`/users/${userId}/status`, { isActive });
      console.log('UserService: User status updated successfully', response);
      return response;
    } catch (error) {
      console.error('UserService: Error updating user status', error);
      throw error;
    }
  }

  // Set token for authenticated requests
  setToken(token) {
    console.log('UserService: Setting token');
    api.setToken(token);
  }

  // Remove token
  removeToken() {
    console.log('UserService: Removing token');
    api.removeToken();
  }
}

export default new UserService();