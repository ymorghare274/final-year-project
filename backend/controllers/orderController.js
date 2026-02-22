const supabase = require('../config/supabase');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, address, totalAmount } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // 1. Create the order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: req.user.id,
                    total_amount: totalAmount,
                    address
                }
            ])
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Create order items
        const itemsToInsert = orderItems.map((item) => ({
            order_id: order.id,
            product_id: item._id,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (*),
        users:user_id (name, email)
      `)
            .eq('id', req.params.id)
            .single();

        if (error || !order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select(', order_items()')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { addOrderItems, getOrderById, getMyOrders };