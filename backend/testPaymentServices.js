// Simple test script for backend payment services
const stripeService = require('./services/stripeService');
const paypalService = require('./services/paypalService');

// Test data
const testAmount = 2599; // Rs 25.99 in cents
const testCurrency = 'inr';
const testMetadata = {
  orderId: 'TEST_ORDER_123',
  customerId: 'TEST_CUSTOMER_456'
};

// Test Stripe service
async function testStripeService() {
  console.log('Testing Stripe Service...');
  
  try {
    // Test creating a payment intent
    console.log('\n1. Creating Stripe Payment Intent:');
    const paymentIntentResult = await stripeService.createPaymentIntent(
      testAmount,
      testCurrency,
      testMetadata
    );
    console.log('Payment Intent Result:', paymentIntentResult);
    
    if (paymentIntentResult.success) {
      // Test retrieving the payment intent
      console.log('\n2. Retrieving Stripe Payment Intent:');
      const retrieveResult = await stripeService.getPaymentIntent(
        paymentIntentResult.paymentIntentId
      );
      console.log('Retrieve Result:', retrieveResult);
    }
  } catch (error) {
    console.error('Stripe Service Error:', error);
  }
}

// Test PayPal service
async function testPayPalService() {
  console.log('\n\nTesting PayPal Service...');
  
  try {
    // Test creating an order
    console.log('\n1. Creating PayPal Order:');
    const orderResult = await paypalService.createOrder(
      25.99,
      'INR',
      testMetadata
    );
    console.log('Order Result:', orderResult);
    
    if (orderResult.success) {
      // Test getting order details
      console.log('\n2. Getting PayPal Order Details:');
      const detailsResult = await paypalService.getOrderDetails(
        orderResult.orderId
      );
      console.log('Order Details Result:', detailsResult);
    }
  } catch (error) {
    console.error('PayPal Service Error:', error);
  }
}

// Run tests
async function runAllTests() {
  await testStripeService();
  await testPayPalService();
}

runAllTests();