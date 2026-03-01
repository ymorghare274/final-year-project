const supabase = require('./config/supabase');
const fs = require('fs');
const path = require('path');

async function comprehensiveCheck() {
    console.log('🔍 COMPREHENSIVE PROJECT CHECK\n');
    console.log('='.repeat(50));

    // 1. Check Database Connection
    console.log('\n1️⃣  DATABASE CONNECTION');
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.log('❌ Database connection failed:', error.message);
        } else {
            console.log('✅ Database connected successfully');
        }
    } catch (err) {
        console.log('❌ Database error:', err.message);
    }

    // 2. Check Users Table Schema
    console.log('\n2️⃣  USERS TABLE SCHEMA');
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (data && data.length > 0) {
            const columns = Object.keys(data[0]);
            console.log('✅ Columns:', columns.join(', '));

            const requiredCols = ['wishlist', 'addresses', 'saved_cards', 'phone'];
            requiredCols.forEach(col => {
                if (columns.includes(col)) {
                    console.log(`   ✅ ${col} exists`);
                } else {
                    console.log(`   ❌ ${col} MISSING`);
                }
            });
        } else {
            console.log('⚠️  No users in database yet');
        }
    } catch (err) {
        console.log('❌ Error:', err.message);
    }

    // 3. Check Products Table Schema
    console.log('\n3️⃣  PRODUCTS TABLE SCHEMA');
    try {
        const { data, error } = await supabase.from('products').select('*').limit(1);
        if (data && data.length > 0) {
            const columns = Object.keys(data[0]);
            console.log('✅ Columns:', columns.join(', '));

            const requiredCols = ['approved', 'category'];
            requiredCols.forEach(col => {
                if (columns.includes(col)) {
                    console.log(`   ✅ ${col} exists`);
                } else {
                    console.log(`   ❌ ${col} MISSING`);
                }
            });
        } else {
            console.log('⚠️  No products in database yet');
        }
    } catch (err) {
        console.log('❌ Error:', err.message);
    }

    // 4. Check All Tables Exist
    console.log('\n4️⃣  TABLE EXISTENCE CHECK');
    const tables = [
        'users', 'categories', 'products', 'orders', 'order_items',
        'reviews', 'wishlist_items', 'contact_messages', 'newsletter_subscriptions'
    ];

    for (const table of tables) {
        try {
            const { error } = await supabase.from(table).select('count').limit(1);
            if (error) {
                console.log(`   ❌ ${table}: ${error.message}`);
            } else {
                console.log(`   ✅ ${table}`);
            }
        } catch (err) {
            console.log(`   ❌ ${table}: ${err.message}`);
        }
    }

    // 5. Check Environment Variables
    console.log('\n5️⃣  ENVIRONMENT VARIABLES');
    const envVars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'JWT_SECRET',
        'STRIPE_SECRET_KEY',
        'STRIPE_PUBLISHABLE_KEY',
        'PORT'
    ];

    envVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`   ✅ ${varName}`);
        } else {
            console.log(`   ❌ ${varName} MISSING`);
        }
    });

    // 6. Check Critical Backend Files
    console.log('\n6️⃣  BACKEND FILES');
    const backendFiles = [
        './server.js',
        './config/supabase.js',
        './middleware/authMiddleware.js',
        './controllers/authController.js',
        './controllers/productController.js',
        './controllers/orderController.js',
        './controllers/paymentController.js',
        './controllers/wishlistController.js',
        './controllers/reviewController.js',
        './controllers/contactController.js',
        './routes/authRoutes.js',
        './routes/productRoutes.js',
        './routes/orderRoutes.js',
        './routes/paymentRoutes.js'
    ];

    backendFiles.forEach(file => {
        if (fs.existsSync(path.join(__dirname, file))) {
            console.log(`   ✅ ${file}`);
        } else {
            console.log(`   ❌ ${file} MISSING`);
        }
    });

    // 7. Check Data Counts
    console.log('\n7️⃣  DATABASE STATISTICS');
    try {
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

        console.log(`   Users: ${userCount || 0}`);
        console.log(`   Products: ${productCount || 0}`);
        console.log(`   Orders: ${orderCount || 0}`);
    } catch (err) {
        console.log('   ❌ Could not fetch counts');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ CHECK COMPLETE\n');
    process.exit(0);
}

comprehensiveCheck();