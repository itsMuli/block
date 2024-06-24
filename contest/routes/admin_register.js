const express = require('express');
const router = express.Router();
const dbConnection = require('../database');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// GET route to render admin registration form
router.get('/adregister', function(req, res) {
    res.render('admin_register.ejs');
});

// POST route to handle admin registration form submission
router.post('/register', async function(req, res) {
    const { email_address, password, confirm_password } = req.body;

    // Validate input
    if (!email_address || !password || !confirm_password) {
        return res.render('admin_register.ejs', { alertMsg: 'All fields are required' });
    }

    if (password !== confirm_password) {
        return res.render('admin_register.ejs', { alertMsg: 'Passwords do not match' });
    }

    try {
        const db = dbConnection.getDB(); // Get MongoDB database instance
        const collection = db.collection('admin_users'); // Collection for admin users

        // Check if admin with the same email already exists
        const existingAdmin = await collection.findOne({ email_address: email_address });
        if (existingAdmin) {
            return res.render('admin_register.ejs', { alertMsg: 'Admin already exists with this email' });
        }

        // Hash the password before storing in database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new admin into database
        await collection.insertOne({ email_address: email_address, password: hashedPassword });

        // Redirect to admin login page after successful registration
        res.redirect('/admin/login');

    } catch (error) {
        console.error('Error registering admin:', error);
        res.render('admin_register.ejs', { alertMsg: 'An error occurred. Please try again later.' });
    }
});

module.exports = router;
