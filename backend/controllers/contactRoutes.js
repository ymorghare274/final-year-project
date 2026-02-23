const express = require('express');
const router = express.Router();
const { sendContactMessage, getContactMessages } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', sendContactMessage);
router.get('/', protect, authorize('admin'), getContactMessages);

module.exports = router;