const supabase = require('../config/supabase');

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
const sendContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide name, email and message' });
        }

        const { data, error } = await supabase
            .from('contact_messages')
            .insert([{ name, email, subject, message }]);

        if (error) throw error;

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
    try {
        const { data: messages, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendContactMessage, getContactMessages };