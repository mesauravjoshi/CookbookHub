const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Use lowercase 'user'
const Recipe = require('../models/Recipe');
const Bookmark = require('../models/Bookmarks');
const { generateToken, jwtAuthMiddleware } = require('../jwt');

router.put('/name', jwtAuthMiddleware, async (req, res) => {
    const { name } = req.body; // Access the name from the request body
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        // ------------- from Uaer schema
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedName = updatedUser.name;
        // console.log(updatedName);
        const payload = {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username
        }
        const token = generateToken(payload)

        // ------------- from Recipe schema
        const updateUserFromRec = await Recipe.find({ "PostedBy._id": userId }); // Find all recipes with matching PostedBy._id
        if (!updateUserFromRec || updateUserFromRec.length === 0) {
            return res.status(404).json({ message: 'No user found.' });
        }

        // Update the name of the PostedBy object for each matching recipe
        for (const recipe of updateUserFromRec) {
            recipe.PostedBy.name = name;
            await recipe.save(); // Save the updated recipe back to the database
        }

        console.log(`${updatedUser.username}'s Account name updated to ${updatedUser.name}`);
        res.json({ message: 'Name change successful', updatedName, token });

        // res.json(updatedUser);
    } catch (error) {
        console.error('Error updating name:', error);
        res.status(500).json({ message: 'Error updating name' });
    }
});

router.put('/username', jwtAuthMiddleware, async (req, res) => {
    const { username } = req.body; // Access the username from the request body
    const userId = req.user.id;

    try {
        // ----------------------------------- from User schema
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('User already exists:', username);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Update the username in the User schema
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare payload and generate a new token
        const updatedUsername = updatedUser.username;
        const payload = {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username
        };
        const token = generateToken(payload);
        
        // ----------------------------------- from Recipe schema
        const updateUsernameFromRec = await Recipe.find({ "PostedBy._id": userId }); // Find all recipes with matching PostedBy._id
        if (!updateUsernameFromRec || updateUsernameFromRec.length === 0) {
            return res.status(404).json({ message: 'No Username found.' });
        }

        // Update the username of the PostedBy object for each matching recipe
        for (const recipe of updateUsernameFromRec) {
            recipe.PostedBy.username = username;
            await recipe.save(); // Save the updated recipe back to the database
        }
        
        // ----------------------------------- from Bookmark schema
        const updateUsernameFromBook = await Bookmark.find({ "BookmarkBy._id": userId }); // Find all recipes with matching PostedBy._id
        if (!updateUsernameFromBook || updateUsernameFromBook.length === 0) {
            return res.status(404).json({ message: 'No Username found.' });
        }

        // Update the username of the PostedBy object for each matching recipe
        for (const bookmarks of updateUsernameFromBook) {
            bookmarks.BookmarkBy.username = username;
            await bookmarks.save(); // Save the updated recipe back to the database
        }

        // Log and send success response
        console.log(`${updatedUser.username}'s Account username updated to ${updatedUser.name}`);
        res.json({ message: 'Username change successful', updatedUsername, token ,updateUsernameFromRec, updateUsernameFromBook });
    } catch (error) {
        // Handle errors
        console.error('Error updating username:', error);
        res.status(500).json({ message: 'Error updating username' });
    }
});

module.exports = router;