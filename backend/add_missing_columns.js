const supabase = require('./config/supabase');

async function addMissingColumns() {
    try {
        console.log('Adding wishlist column to users table...');

        // First, let's check current schema
        const { data: users, error: checkError } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (checkError) {
            console.error('Error checking schema:', checkError);
            return;
        }

        if (users && users.length > 0) {
            const columns = Object.keys(users[0]);
            console.log('Current columns:', columns);

            const hasWishlist = columns.includes('wishlist');
            console.log('Has wishlist column:', hasWishlist);

            if (!hasWishlist) {
                console.log('\n⚠️  IMPORTANT: You need to add the wishlist column to your Supabase users table.');
                console.log('Run this SQL in your Supabase SQL Editor:');
                console.log('\nALTER TABLE users ADD COLUMN wishlist JSONB DEFAULT \'[]\';');
            } else {
                console.log('✓ Wishlist column exists');
            }
        }



    } catch (err) {
        console.error('Exception:', err.message);
    }
    process.exit(0);
}

addMissingColumns();