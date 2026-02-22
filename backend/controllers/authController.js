const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email: rawEmail, password: rawPassword, phone } = req.body;
        const email = rawEmail ? rawEmail.toLowerCase().trim() : '';
        const password = rawPassword ? rawPassword.trim() : '';

        console.log('Register attempt for email:', email);

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const { data: user, error } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword, phone }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            addresses: user.addresses || [],
            saved_cards: user.saved_cards || [],
            token: generateToken(user.id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email: rawEmail, password: rawPassword } = req.body;
        const email = rawEmail ? rawEmail.toLowerCase().trim() : '';
        const password = rawPassword ? rawPassword.trim() : '';

        console.log('Login attempt for email:', email);

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Login database error:', error.message);
        }

        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Login failed: Password mismatch');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('Login successful:', email);

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            addresses: user.addresses || [],
            saved_cards: user.saved_cards || [],
            token: generateToken(user.id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role, phone, addresses, saved_cards, wishlist')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            addresses: user.addresses || [],
            saved_cards: user.saved_cards || [],
            wishlist: user.wishlist || []
        });
    } catch (error) {
        res.status(404).json({ message: 'User not found' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone, addresses, saved_cards } = req.body;
        console.log('Update Profile Request:', { userId: req.user.id, name, phone });

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (phone !== undefined) updates.phone = phone;
        if (addresses !== undefined) updates.addresses = addresses;
        if (saved_cards !== undefined) updates.saved_cards = saved_cards;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        const { data: user, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', req.user.id)
            .select('id, name, email, role, phone, addresses, saved_cards, wishlist')
            .single();

        if (error) {
            console.error('Supabase Update Error:', error);
            return res.status(500).json({ message: error.message });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Update Successful for User ID:', user.id);

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            addresses: user.addresses || [],
            saved_cards: user.saved_cards || [],
            wishlist: user.wishlist || []
        });
    } catch (error) {
        console.error('Update Profile Exception:', error.message);
        res.status(500).json({ message: 'Internal server error during profile update' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('password')
            .eq('id', req.user.id)
            .single();

        if (error || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        const { error: updateError } = await supabase
            .from('users')
            .update({ password: hashedNewPassword })
            .eq('id', req.user.id);

        if (updateError) throw updateError;

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', req.user.id);

        if (error) throw error;

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, name, email, role, phone, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getProfile, updateProfile, getUsers, updatePassword, deleteAccount };