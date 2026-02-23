const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    getAdminProducts,
    wipeAllProducts,
    updateProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/admin', protect, authorize('admin'), getAdminProducts);
router.delete('/wipe-all-dangerous', protect, authorize('admin'), wipeAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;