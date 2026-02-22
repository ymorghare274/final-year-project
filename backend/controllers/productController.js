const supabase = require('../config/supabase');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        let query = supabase
            .from('products')
            .select('*')
            .eq('approved', true);

        if (req.query.category) {
            query = query.eq('category', req.query.category);
        }

        const { data: products, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product (Admin/Seller)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,

            purity,
            weight,
            price,
            stock,
            images,
            discount
        } = req.body;

        const { data: product, error } = await supabase
            .from('products')
            .insert([
                {
                    name,
                    description,
                    category,

                    purity,
                    weight,
                    price,
                    stock,
                    images,
                    discount,
                    created_by: req.user.id,
                    approved: req.user.role === 'admin'
                }
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products (Admin)
// @route   GET /api/products/admin
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Wipe all products (DANGEROUS)
// @route   DELETE /api/products/wipe-all-dangerous
// @access  Private/Admin
const wipeAllProducts = async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) throw error;
        res.json({ message: 'Inventory wiped clean' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .update(req.body)
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct, getAdminProducts, wipeAllProducts, updateProduct };