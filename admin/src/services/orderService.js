import api from './api';

class AdminOrderService {
  async getAll() {
    return await api.get('/orders');
  }

  async updateToDelivered(id) {
    return await api.put(`/orders/${id}/deliver`, {});
  }
}

export default new AdminOrderService();
