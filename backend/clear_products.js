const supabase = require('./config/supabase');

const clearAllProducts = async () => {
    try {
        console.log('🧹 Preparing to clear all products...');

        // Delete all products where ID is not null (effectively all)
        const { error } = await supabase
            .from('products')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) throw error;

        console.log('✅ Success! All products have been removed from the database.');
        console.log('🚀 Your shop is now a clean slate for admin-only additions.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing products:', error.message);
        process.exit(1);
    }
};

clearAllProducts();