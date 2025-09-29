import api from './api';

class UserService {
  // Register a new user
  async register(userData) {
    return await api.post('/users/register', userData);
  }

  // Login user
  async login(credentials) {
    return await api.post('/users/login', credentials);
  }

  // Logout user
  logout() {
    api.removeToken();
  }

  // Get user profile
  async getProfile() {
    console.log('UserService: Getting profile');
    return await api.get('/users/profile');
  }

  // Update user profile
  async updateProfile(userData) {
    return await api.put('/users/profile', userData);
  }

  // Update only profile picture
  async updateProfilePicture(profilePicture) {
    return await api.put('/users/profile/picture', { profilePicture });
  }

  // Set token for authenticated requests
  setToken(token) {
    console.log('UserService: Setting token', token ? `${token.substring(0, 20)}...` : 'null');
    api.setToken(token);
  }

  // Remove token
  removeToken() {
    console.log('UserService: Removing token');
    api.removeToken();
  }
}

export default new UserService();