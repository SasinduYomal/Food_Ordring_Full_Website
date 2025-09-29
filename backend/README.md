# Food Ordering Backend

This is the backend API for the Food Ordering website built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, profile management)
- Menu management
- Order placement and tracking
- Admin functionality for managing menu items and orders
- Payment processing integration (Stripe, PayPal, Cash on Delivery)

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Stripe for credit card payments
- PayPal for PayPal payments

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. For production:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### User Profile
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Menu Items
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get a specific menu item
- `POST /api/menu` - Create a new menu item (admin only)
- `PUT /api/menu/:id` - Update a menu item (admin only)
- `DELETE /api/menu/:id` - Delete a menu item (admin only)

### Orders
- `POST /api/orders` - Create a new order (protected)
- `GET /api/orders/myorders` - Get logged in user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/deliver` - Update order to delivered (admin only)

### Payment Integration
The backend includes services for processing payments through multiple providers:
- StripeService for credit card payments
- PayPalService for PayPal payments
- Cash on delivery requires no additional processing

## Folder Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Payment services
├── .env.example     # Environment variables example
├── package.json     # Project dependencies
├── server.js        # Entry point
└── README.md        # This file
```