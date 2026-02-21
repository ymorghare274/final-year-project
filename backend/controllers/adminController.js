const supabase = require('../config/supabase');

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        // 1. Get total revenue from orders
        const { data: orders, error: orderError } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('payment_status', 'Paid');

        if (orderError) throw orderError;

        const totalRevenue = (orders || []).reduce((sum, order) => sum + Number(order.total_amount), 0);
        const totalOrders = (orders || []).length;

        // 2. Get total users
        const { count: userCount, error: userError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // 3. Get pending products
        const { count: pendingCount, error: pendingError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('approved', false);

        if (pendingError) throw pendingError;

        res.json({
            revenue: totalRevenue,
            orders: totalOrders,
            users: userCount,
            pending: pendingCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                users:user_id (name, email)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { order_status } = req.body;
        const { error } = await supabase
            .from('orders')
            .update({ order_status })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminStats, getAllOrders, updateOrderStatus };