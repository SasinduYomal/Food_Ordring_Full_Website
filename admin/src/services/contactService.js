import api from './api';

class ContactService {
  setToken(token) {
    api.setToken(token);
  }

  // Get all contact messages
  async getAllMessages() {
    return await api.get('/contact');
  }

  // Get contact message by ID
  async getMessageById(id) {
    return await api.get(`/contact/${id}`);
  }

  // Update contact message status
  async updateMessageStatus(id, status) {
    return await api.put(`/contact/${id}`, { status });
  }

  // Delete a contact message
  async deleteMessage(id) {
    return await api.delete(`/contact/${id}`);
  }
}

export default new ContactService();