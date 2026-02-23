const express = require('express');
const router = express.Router();
const { getAdminStats, getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/orders', protect, authorize('admin'), getAllOrders);
router.put('/orders/:id', protect, authorize('admin'), updateOrderStatus);

module.exports = router;