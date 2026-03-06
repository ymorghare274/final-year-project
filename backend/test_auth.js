const supabase = require('./config/supabase');
const bcrypt = require('bcryptjs');

async function testLogin() {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    try {
        console.log('--- Testing Registration ---');
        // Delete if exists
        await supabase.from('users').delete().eq('email', testEmail);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testPassword, salt);

        // Register
        const { data: user, error: regError } = await supabase
            .from('users')
            .insert([{ name: 'Test User', email: testEmail, password: hashedPassword, phone: '1234567890' }])
            .select()
            .single();

        if (regError) {
            console.error('Registration Error:', regError);
            return;
        }
        console.log('User registered successfully:', user.email);

        console.log('\n--- Testing Login ---');
        // Check if user exists in DB
        const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('email', testEmail)
            .single();

        if (dbError) {
            console.error('Database Fetch Error:', dbError);
            return;
        }

        console.log('User found in DB. Comparing passwords...');
        const isMatch = await bcrypt.compare(testPassword, dbUser.password);
        console.log('Password match:', isMatch);

        if (isMatch) {
            console.log('LOGIN SUCCESSFUL');
        } else {
            console.log('LOGIN FAILED: Password mismatch');
            console.log('Input password:', testPassword);
            console.log('DB Hashed password:', dbUser.password);
        }

    } catch (err) {
        console.error('Test Exception:', err);
    } finally {
        // Cleanup
        await supabase.from('users').delete().eq('email', testEmail);
        process.exit();
    }
}

testLogin();