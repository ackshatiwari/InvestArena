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
    try {
        const { user, error } = await supabase.auth.signUp(
            { email, password },
            { data: { full_name: fullName } }
        );

        if (error) {
            console.error('Error during sign up:', error);
            return res.status(400).json({ error: error.message });
        }
        const { data, error: dbError } = await supabase
            .from('InvestArena_UserDetails')
            .insert([{created_at: new Date(), full_name: fullName, email: email }]);
        if (dbError) {
            console.error('Error inserting user details:', dbError);
            return res.status(500).json({ error: dbError.message });
        }


        res.status(201).json({ user });
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ error: 'An error occurred during sign up.' });
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