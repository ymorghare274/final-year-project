const supabase = require('./config/supabase');

async function checkSchema() {
    try {
        console.log('Checking database columns...');
        const { data, error } = await supabase
            .from('users')
            .select('addresses, saved_cards')
            .limit(1);

        if (error) {
            if (error.code === '42703') {
                console.error('CRITICAL: Database columns "addresses" or "saved_cards" are missing!');
                console.log('Please run the following SQL in your Supabase SQL Editor:');
                console.log(`
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS saved_cards JSONB DEFAULT '[]';
                `);
            } else {
                console.error('Database Check Error:', error.message);
            }
        } else {
            console.log('SUCCESS: Database columns are correctly configured.');
        }
    } catch (err) {
        console.error('Unexpected Error:', err.message);
    }
}

checkSchema();