const MenuItem = require('../models/MenuItem');

// Get all menu items (public - only available items)
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ available: true }).populate('relatedItems', 'name price category imageUrl');
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all menu items (admin - all items regardless of availability)
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({}).populate('relatedItems', 'name price category imageUrl');
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('relatedItems', 'name price category imageUrl');

    if (menuItem) {
      res.json(menuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create menu item (admin only)
const createMenuItem = async (req, res) => {
  // Handle both JSON and FormData
  let bodyData = req.body;
  
  // If FormData was used, parse JSON strings
  if (req.body.sizes && typeof req.body.sizes === 'string') {
    try {
      bodyData.sizes = JSON.parse(req.body.sizes);
    } catch (e) {
      bodyData.sizes = {};
    }
  }
  
  if (req.body.relatedItems && typeof req.body.relatedItems === 'string') {
    try {
      bodyData.relatedItems = JSON.parse(req.body.relatedItems);
    } catch (e) {
      bodyData.relatedItems = [];
    }
  }
  
  const { name, description, price, category, subCategory, vegetarian, available, imageUrl, sizes, relatedItems } = bodyData;

  // Validate price
  const priceValue = parseFloat(price);
  if (isNaN(priceValue) || priceValue < 0) {
    return res.status(400).json({ message: 'Price must be a valid positive number' });
  }

  try {
    // If file was uploaded, use the file path; otherwise use the provided imageUrl
    const imagePath = req.file ? `/uploads/${req.file.filename}` : imageUrl;

    const menuItem = new MenuItem({
      name,
      description,
      price: priceValue,
      category,
      subCategory,
      vegetarian,
      available,
      imageUrl: imagePath,
      sizes: sizes || {},
      relatedItems: relatedItems || []
    });

    const createdMenuItem = await menuItem.save();
    // Populate related items before sending response
    await createdMenuItem.populate('relatedItems', 'name price category imageUrl');
    res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update menu item (admin only)
const updateMenuItem = async (req, res) => {
  // Handle both JSON and FormData
  let bodyData = req.body;
  
  // If FormData was used, parse JSON strings
  if (req.body.sizes && typeof req.body.sizes === 'string') {
    try {
      bodyData.sizes = JSON.parse(req.body.sizes);
    } catch (e) {
      bodyData.sizes = undefined;
    }
  }
  
  if (req.body.relatedItems && typeof req.body.relatedItems === 'string') {
    try {
      bodyData.relatedItems = JSON.parse(req.body.relatedItems);
    } catch (e) {
      bodyData.relatedItems = undefined;
    }
  }
  
  const { name, description, price, category, subCategory, vegetarian, available, imageUrl, sizes, relatedItems } = bodyData;

  // Validate price if provided
  let priceValue = undefined;
  if (price !== undefined) {
    priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number' });
    }
  }

  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.description = description || menuItem.description;
      menuItem.price = priceValue !== undefined ? priceValue : menuItem.price;
      menuItem.category = category || menuItem.category;
      // Update subCategory if provided
      if (subCategory !== undefined) {
        menuItem.subCategory = subCategory;
      }
      menuItem.vegetarian = vegetarian !== undefined ? vegetarian : menuItem.vegetarian;
      menuItem.available = available !== undefined ? available : menuItem.available;
      
      // Update sizes if provided
      if (sizes !== undefined) {
        menuItem.sizes = sizes;
      }
      
      // Update related items if provided
      if (relatedItems !== undefined) {
        menuItem.relatedItems = relatedItems;
      }
      
      // If file was uploaded, use the file path; otherwise use the provided imageUrl
      if (req.file) {
        menuItem.imageUrl = `/uploads/${req.file.filename}`;
      } else if (imageUrl !== undefined) {
        menuItem.imageUrl = imageUrl;
      }

      const updatedMenuItem = await menuItem.save();
      // Populate related items before sending response
      await updatedMenuItem.populate('relatedItems', 'name price category imageUrl');
      res.json(updatedMenuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete menu item (admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      await menuItem.deleteOne();
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};