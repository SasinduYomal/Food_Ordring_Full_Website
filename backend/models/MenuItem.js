const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['starter', 'main', 'dessert', 'drink']
  },
  // New field for subcategory
  subCategory: {
    type: String,
    enum: ['rice', 'kottu', 'pesta', 'noodles', 'chicken', 'mix', 'seafood', 'vegetable', 'cheese']
  },
  vegetarian: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String
  },
  // New fields for customization
  sizes: {
    small: {
      price: { type: Number, min: 0 },
      available: { type: Boolean, default: true }
    },
    large: {
      price: { type: Number, min: 0 },
      available: { type: Boolean, default: true }
    }
  },
  // Related items (suggestions)
  relatedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);