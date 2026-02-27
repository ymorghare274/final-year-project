const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

const products = [
    {
        name: "Golden Temple Necklace",
        description: "Exquisite 22k gold necklace with temple motifs.",
        price: 45000,
        category: "Necklaces",

        purity: "22k",
        weight: "12g",
        stock: 10,
        images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop"],
        approved: true
    },
    {
        name: "Diamond Solitaire Ring",
        description: "Elegant 18k gold ring with a 1 carat diamond.",
        price: 95000,
        category: "Rings",

        purity: "18k",
        weight: "4g",
        stock: 5,
        images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop"],
        approved: true
    },
    {
        name: "Luxury Rose Serum",
        description: "Rejuvenating face serum with rose extracts and 24k gold flakes.",
        price: 3500,
        category: "Beauty",

        purity: "N/A",
        weight: "30ml",
        stock: 50,
        images: ["https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=2080&auto=format&fit=crop"],
        approved: true
    }
];

const seedData = async () => {
    try {
        console.log('Seeding started...');

        // 1. Create or get Admin
        const adminEmail = 'admin@yukta.com';
        let { data: admin } = await supabase
            .from('users')
            .select('id')
            .eq('email', adminEmail)
            .single();

        if (!admin) {
            const hashedPassword = await bcrypt.hash('adminpassword123', 10);
            const { data: newUser, error: userError } = await supabase
                .from('users')
                .insert([{
                    name: "Admin User",
                    email: adminEmail,
                    password: hashedPassword,
                    role: "admin",
                    phone: "1234567890"
                }])
                .select()
                .single();

            if (userError) throw userError;
            admin = newUser;
            console.log('Admin user created');
        }

        // 2. Clear existing products
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) throw deleteError;
        console.log('Old products cleared');

        // 3. Insert new products
        const productsWithAdmin = products.map(p => ({ ...p, created_by: admin.id }));
        const { error: insertError } = await supabase
            .from('products')
            .insert(productsWithAdmin);

        if (insertError) throw insertError;

        console.log('✅ Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error.message);
        process.exit(1);
    }
};

seedData();