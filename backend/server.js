const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser middleware with increased limits for profile pictures
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/categories', require('./routes/categoryRoutes')); // Uncomment if exists
app.use('/api/menu', require('./routes/menuRoutes'));
// app.use('/api/cart', require('./routes/cartRoutes')); // Uncomment if exists
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Adjust 'dist' to 'build' if using CRA
  const frontendPath = path.join(__dirname, 'frontend', 'dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  // Optional: Root route in development
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
