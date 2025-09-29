const jwt = require('jsonwebtoken');

// Replace with an actual token from your application
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzAwY2U5ZTdlNjQ5MDNlOWExMDg4NyIsImlhdCI6MTcyNTg3NjM3NywiZXhwIjoxNzI4NDY4Mzc3fQ.YourActualTokenHere';

try {
  // Use the same secret as in your .env file
  const decoded = jwt.verify(token, 'dev-secret-key-change-me');
  console.log('Decoded token:', decoded);
  console.log('User ID from token:', decoded.id);
} catch (error) {
  console.error('Error decoding token:', error.message);
}