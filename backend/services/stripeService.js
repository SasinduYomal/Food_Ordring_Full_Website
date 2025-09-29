const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  /**
   * Create a payment intent for Stripe
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code (e.g., 'usd')
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} Payment intent
   */
  async createPaymentIntent(amount, currency = 'inr', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Confirm a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @param {Object} paymentMethod - Payment method details
   * @returns {Promise<Object>} Confirmation result
   */
  async confirmPayment(paymentIntentId, paymentMethod) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(
        paymentIntentId,
        { payment_method: paymentMethod }
      );
      
      return {
        success: true,
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe payment confirmation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Retrieve payment intent details
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Payment intent details
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      console.error('Stripe payment intent retrieval error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new StripeService();