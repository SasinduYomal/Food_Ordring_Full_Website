const ContactMessage = require('../models/ContactMessage');

// Create a new contact message (public)
const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message
    });
    
    const createdMessage = await contactMessage.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all contact messages (admin only)
const getAllContactMessages = async (req, res) => {
  try {
    // Only admins can get all contact messages
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });
      
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get contact message by ID (admin only)
const getContactMessageById = async (req, res) => {
  try {
    // Only admins can get contact messages
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const message = await ContactMessage.findById(req.params.id);
    
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact message status (admin only)
const updateContactMessageStatus = async (req, res) => {
  try {
    // Only admins can update contact messages
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { status } = req.body;
    
    const message = await ContactMessage.findById(req.params.id);
    
    if (message) {
      message.status = status || message.status;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete contact message (admin only)
const deleteContactMessage = async (req, res) => {
  try {
    // Only admins can delete contact messages
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const message = await ContactMessage.findById(req.params.id);
    
    if (message) {
      await message.deleteOne();
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage
};