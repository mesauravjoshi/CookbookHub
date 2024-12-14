const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Use lowercase 'user'
const Bookmark = require('../models/Bookmarks'); // Use lowercase 'user'
const { generateToken, jwtAuthMiddleware } = require('../jwt');


router.post('/delete', jwtAuthMiddleware,async (req, res) => {
    const {username} = req.body;
    console.log(username);

    if (!username) {
        return res.status(400).json({ message: 'username is required' });
    }

    try {
        const userResult  = await User.deleteOne({username}); // Use the correct field name
        if (userResult .deletedCount === 0) {
            return res.status(404).json({ message: 'Username not found' });
        }
        console.log(`${username}'s Account deleted permanently`);

        // if userdata removed then data from bookmark removing
        const bookmarkResult  = await Bookmark.deleteMany({"BookmarkBy.username": `${username}`});
        console.log(`${bookmarkResult .deletedCount} bookmarks deleted successfully`);

        res.json({ message: 'User and associated bookmarks removed successfully'});
    } catch (error) {
        console.error('Error removing username or bookmarks:', error);
        res.status(500).json({ message: 'Error removing username or bookmarks'  });
    }
});

module.exports = router;