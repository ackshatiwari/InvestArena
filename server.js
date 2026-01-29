import { supabase } from './client.js';
import express from 'express';
import path from 'path';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5555;

const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    console.log('Login page requested');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Sign up endpoint
app.post('/create-user', async (req, res) => {
    const { email, password, fullName } = req.body;
    console.log(req.body);
    try {
        //user sign up
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'http://localhost:5555/auth/callback',
            },
        });
        if (error) {
            console.error('Error during sign up:', error);
            return res.status(400).json({ error: error.message });
        }
        console.log('User signed up:', data);

        const { error: dbError } = await supabase
            .from('InvestArena_UserDetails')
            .insert([{ created_at: new Date().toISOString(), full_name: fullName, email: email }]);
        if (dbError) {
            console.error('Error inserting user details:', dbError);
            return res.status(500).json({ error: dbError.message });
        }

    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ error: 'An error occurred during sign up.' });
    }
    res.status(200).json({ message: 'User created successfully' });
});

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error('Error exchanging code for session:', error);
            return res.status(400).json({ error: error.message });
        }
        res.redirect('/');
    }


});

// Log in endpoint
app.post('/log-in-user', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) {
            console.error('Error during sign in:', error);
            return res.status(400).json({ error: error.message });
        }
        console.log('User signed in:', data);
        res.status(200).json({ message: 'Sign in successful', redirectUrl: '/' });
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ error: 'An error occurred during sign in.' });
    }
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});