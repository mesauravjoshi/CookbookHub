const express = require('express');
const router = express.Router();
const Admin = require('../../models/Admin');
const User = require('../../models/User'); 
const { generateToken, jwtAuthMiddleware } = require('../../jwt');

router.post('/signup',async (req,res) => {
    const {username_admin, password} = req.body;

    console.log(username_admin ,password);
    
    const existingUser = await Admin.findOne({ username_admin });
    if(existingUser){
        return res.status(400).json({message: 'User aready exists'});
    }

    let admin = new Admin();
    admin.username_admin = username_admin;
    admin.password = password;

    const doc = await admin.save();
    console.log('New user created:', doc);

    const payload = {
        id: doc.id,
        username_admin: username_admin
    }
    console.log('payload', payload);

    // const token = generateToken(doc.username);
    // console.log(JSON.stringify((payload)));
    const token = generateToken(payload);
    // console.log('Token is : ', token);
    res.json({ doc: doc, token: token });
})

router.post('/login', async (req, res) => {
    const {username_admin, password} = req.body;
    
    // Find user by username
    const admin = await Admin.findOne({ username_admin });
    // Check if user exists
    if (!admin) {
        return res.status(400).json({ message: 'Incorrect username' });
    }
    // Compare passwords
    const isPasswordMatch = await admin.comparePassword(password)
    if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    const payload = {
        id: admin.id,
        username_admin: admin.username_admin
    }
    
    const token = generateToken(payload)
    // Successful login
    res.json({ message: 'Login successful', admin, token });
})

router.delete('/delete_user/:user_id',jwtAuthMiddleware, async (req, res) => {
    const { user_id } = req.params;  // Get the recipe ID from the request parameters
    
    try {
        const user = await User.findByIdAndDelete(user_id);  // Find and delete the recipe by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User successfully deleted' });  // Return success message
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

module.exports = router;