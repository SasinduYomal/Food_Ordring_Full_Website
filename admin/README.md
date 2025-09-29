# Food Ordering Admin Panel

Admin dashboard for managing the food ordering system.

## Features

1. **Admin Authentication**
   - Secure login for administrators
   - Session management

2. **Menu Management**
   - Add/Edit/Delete food items
   - Upload images
   - Set price, availability, and description
   - Categorize items

3. **Order Management**
   - View all incoming orders (Pending/Accepted/Completed/Cancelled)
   - Update order status in real-time
   - Assign orders to delivery staff

4. **Reservation Management**
   - View all reservations by date & time
   - Approve/Decline reservations
   - Manage table availability

5. **Customer Management**
   - View registered customers
   - Manage customer feedback/reviews
   - Handle loyalty program or discounts

6. **Analytics Dashboard**
   - Daily/weekly/monthly sales reports
   - Most ordered dishes
   - Peak reservation times
   - Customer insights

## Tech Stack

- React 18
- React Router v6
- Vite
- CSS Modules

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Folder Structure

```
src/
├── components/
│   ├── Navbar/
│   ├── Sidebar/
│   └── StatsCard/
├── context/
│   └── AuthContext.js
├── pages/
│   ├── Dashboard/
│   ├── Login/
│   ├── ManageMenu/
│   ├── ManageOrders/
│   ├── ManageReservations/
│   ├── ManageUsers/
│   └── Reports/
└── services/
```

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Food Ordering Admin
```