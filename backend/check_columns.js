const supabase = require('./config/supabase');

async function checkColumns() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error) {
            console.error('ERROR:', JSON.stringify(error, null, 2));
            return;
        }

        if (data && data.length > 0) {
            const columns = Object.keys(data[0]);
            console.log('COLUMNS:', JSON.stringify(columns, null, 2));

            // Check for specific columns
            const hasAddresses = columns.includes('addresses');
            const hasSavedCards = columns.includes('saved_cards');

            console.log('Has addresses column:', hasAddresses);
            console.log('Has saved_cards column:', hasSavedCards);
        }
    } catch (err) {
        console.error('EXCEPTION:', err.message);
    }
    process.exit(0);
}

checkColumns();