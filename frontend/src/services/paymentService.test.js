// Simple test script for payment service
import paymentService from './paymentService';

// Test data
const testPaymentData = {
  amount: 25.99,
  currency: 'inr',
  customerInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890'
  },
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'USA'
  }
};

// Test all payment methods
async function testPaymentMethods() {
  console.log('Testing payment methods...');
  
  // Test credit card payment
  console.log('\n1. Testing Credit Card Payment:');
  try {
    const creditCardResult = await paymentService.initializePayment(
      testPaymentData, 
      'credit-card'
    );
    console.log('Credit Card Result:', creditCardResult);
  } catch (error) {
    console.error('Credit Card Error:', error);
  }
  
  // Test PayPal payment
  console.log('\n2. Testing PayPal Payment:');
  try {
    const paypalResult = await paymentService.initializePayment(
      testPaymentData, 
      'paypal'
    );
    console.log('PayPal Result:', paypalResult);
  } catch (error) {
    console.error('PayPal Error:', error);
  }
  
  // Test cash on delivery
  console.log('\n3. Testing Cash on Delivery:');
  try {
    const codResult = await paymentService.initializePayment(
      testPaymentData, 
      'cash-on-delivery'
    );
    console.log('Cash on Delivery Result:', codResult);
  } catch (error) {
    console.error('Cash on Delivery Error:', error);
  }
  
  // Test invalid payment method
  console.log('\n4. Testing Invalid Payment Method:');
  try {
    const invalidResult = await paymentService.initializePayment(
      testPaymentData, 
      'invalid-method'
    );
    console.log('Invalid Method Result:', invalidResult);
  } catch (error) {
    console.error('Invalid Method Error:', error);
  }
}

// Run tests
testPaymentMethods();

export default testPaymentMethods;