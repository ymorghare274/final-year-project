const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getUsers, updatePassword, deleteAccount } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);
router.delete('/delete-account', protect, deleteAccount);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;