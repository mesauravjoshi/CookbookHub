const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Recipe = require('../../models/Recipe');
const Bookmark = require('../../models/Bookmarks');
const { jwtAuthMiddleware } = require('../../jwt');

router.patch('/recipe/:recipe_id', jwtAuthMiddleware, async (req, res) => {
    const { recipe_id } = req.params;
    const { initialRecipe } = req.body;
    console.log('hi');


    if (!initialRecipe) {
        return res.status(400).json({ message: 'No recipe data provided' });
    }

    try {
        // Update only the fields present in initialRecipe
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            recipe_id,
            { $set: initialRecipe }, // MongoDB update operator to set only provided fields
            { new: true } // Returns the updated document
        );

        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json({ message: 'Recipe updated successfully', updatedRecipe });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Error updating recipe' });
    }
});


router.put('/username/:user_id', jwtAuthMiddleware, async (req, res) => {
    const { user_id } = req.params;  // Get recipe_id from URL params
    const { name, username } = req.body;  // Get other details from request body

    try {
        // ------------- from Uaer schema
        const updateUserData = await User.findByIdAndUpdate(
            user_id,
            {
                name: name,
                username: username,
            },
            { new: true } // Returns the updated document
        );

        if (!updateUserData) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // ------------- from Recipe schema
        const updateUserFromRec = await Recipe.findOne({ "PostedBy._id": user_id }); // Find recipe with matching PostedBy._id
        if (!updateUserFromRec) {
            return res.status(404).json({ message: 'User ID not found for this user.' });
        }
        // Update the name and username of the PostedBy object
        updateUserFromRec.PostedBy.name = name;
        updateUserFromRec.PostedBy.username = username;
        // Save the updated recipe back to the database
        await updateUserFromRec.save();

        // ------------- from Uaer Bookmark
        const updateUserFromBook = await Bookmark.findOne({ "BookmarkBy._id": user_id }); // Find recipe with matching PostedBy._id
        if (!updateUserFromBook) {
            return res.status(404).json({ message: 'User ID not found for this user.' });
        }
        // Update the name and username of the PostedBy object
        updateUserFromBook.BookmarkBy.username = username;
        // Save the updated recipe back to the database
        await updateUserFromBook.save();

        // Send back a success response
        return res.status(200).json({
            message: 'Username and name updated successfully',
            updateUserFromRec, updateUserData, updateUserFromBook
        });

        // res.json({ message: 'Recipe updated successfully', updateUserData });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Error updating recipe' });
    }
});

module.exports = router;