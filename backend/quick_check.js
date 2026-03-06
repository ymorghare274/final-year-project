const supabase = require('./config/supabase');
const fs = require('fs');

async function quickCheck() {
    const results = {
        database: '❌',
        userSchema: '❌',
        productSchema: '❌',
        allTables: [],
        envVars: [],
        files: []
    };

    // Database check
    try {
        const { error } = await supabase.from('users').select('count').limit(1);
        results.database = error ? '❌' : '✅';
    } catch (e) {
        results.database = '❌';
    }

    // User schema
    try {
        const { data } = await supabase.from('users').select('*').limit(1);
        if (data && data.length > 0) {
            const cols = Object.keys(data[0]);
            const hasWishlist = cols.includes('wishlist');
            const hasAddresses = cols.includes('addresses');
            results.userSchema = (hasWishlist && hasAddresses) ? '✅' : '⚠️';
        }
    } catch (e) { }

    // Product schema
    try {
        const { data } = await supabase.from('products').select('*').limit(1);
        if (data && data.length > 0) {
            const cols = Object.keys(data[0]);
            results.productSchema = '✅';
        }
    } catch (e) { }

    // Tables
    const tables = ['users', 'categories', 'products', 'orders', 'order_items', 'reviews', 'wishlist_items', 'contact_messages'];
    for (const table of tables) {
        try {
            const { error } = await supabase.from(table).select('count').limit(1);
            results.allTables.push(error ? `❌ ${table}` : `✅ ${table}`);
        } catch (e) {
            results.allTables.push(`❌ ${table}`);
        }
    }

    // Env vars
    ['SUPABASE_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY'].forEach(v => {
        results.envVars.push(process.env[v] ? `✅ ${v}` : `❌ ${v}`);
    });

    // Files
    ['./server.js', './config/supabase.js', './controllers/authController.js'].forEach(f => {
        results.files.push(fs.existsSync(f) ? `✅ ${f}` : `❌ ${f}`);
    });

    console.log('\n📊 PROJECT STATUS REPORT\n');
    console.log(`Database Connection: ${results.database}`);
    console.log(`User Schema: ${results.userSchema}`);
    console.log(`Product Schema: ${results.productSchema}`);
    console.log('\nTables:', results.allTables.join(', '));
    console.log('\nEnv:', results.envVars.join(', '));
    console.log('\nFiles:', results.files.join(', '));
    console.log('\n');

    process.exit(0);
}

quickCheck();