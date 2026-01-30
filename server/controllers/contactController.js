const ContactMessage = require('../models/ContactMessage');

// Create a new contact message
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message
    });

    const savedMessage = await contactMessage.save();
    res.status(201).json({ 
      message: 'Message sent successfully',
      id: savedMessage._id
    });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(400).json({ message: err.message });
  }
};

// Get all contact messages (admin only)
exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark message as read (admin only)
exports.markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a message (admin only)
exports.deleteContactMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
