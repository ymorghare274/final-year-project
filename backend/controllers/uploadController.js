const supabase = require('../config/supabase');
const path = require('path');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const file = req.file;
        const fileName = `${Date.now()}_${path.basename(file.originalname)}`;
        const filePath = `products/${fileName}`;

        // Upload to Supabase Storage
        // Note: Make sure you have a bucket named 'products' with public access
        const { data, error } = await supabase.storage
            .from('products')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) throw error;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        res.json({
            message: 'Image uploaded successfully',
            url: publicUrl
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadImage };