// Simple mock server for testing the admin panel
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Mock data
let menuItems = [
  {
    _id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'main',
    vegetarian: true,
    available: true,
    imageUrl: ''
  },
  {
    _id: '2',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons',
    price: 8.99,
    category: 'starter',
    vegetarian: true,
    available: true,
    imageUrl: ''
  }
];

// Routes
app.get('/api/menu/admin/all', (req, res) => {
  res.json(menuItems);
});

app.get('/api/menu', (req, res) => {
  // Only return available items for the frontend
  const availableItems = menuItems.filter(item => item.available);
  res.json(availableItems);
});

app.post('/api/menu', (req, res) => {
  const newItem = {
    _id: Date.now().toString(),
    ...req.body
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/menu/:id', (req, res) => {
  const id = req.params.id;
  const index = menuItems.findIndex(item => item._id === id);
  
  if (index !== -1) {
    menuItems[index] = {
      ...menuItems[index],
      ...req.body
    };
    res.json(menuItems[index]);
  } else {
    res.status(404).json({ message: 'Menu item not found' });
  }
});

app.delete('/api/menu/:id', (req, res) => {
  const id = req.params.id;
  const index = menuItems.findIndex(item => item._id === id);
  
  if (index !== -1) {
    menuItems.splice(index, 1);
    res.json({ message: 'Menu item removed' });
  } else {
    res.status(404).json({ message: 'Menu item not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});