const supabase = require('../config/supabase');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select(`
                *,
                users:user_id (name)
            `)
            .eq('product_id', req.params.productId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        // Check if user already reviewed
        const { data: existingReview } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .eq('user_id', userId)
            .single();

        if (existingReview) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const { data, error } = await supabase
            .from('reviews')
            .insert([{ product_id: productId, user_id: userId, rating, comment }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProductReviews, addReview };