const supabase = require('../config/supabase');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const { data: wishlist, error } = await supabase
            .from('wishlist_items')
            .select(`
                *,
                products (*)
            `)
            .eq('user_id', req.user.id);

        if (error) throw error;

        // Transform to flat format
        const products = wishlist.map(item => item.products);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('wishlist_items')
            .upsert([{ user_id: userId, product_id: productId }], { onConflict: 'user_id, product_id' })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', req.user.id)
            .eq('product_id', req.params.productId);

        if (error) throw error;

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };