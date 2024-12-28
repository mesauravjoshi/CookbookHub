const express = require('express');
const router = express.Router();
const User = require('../../models/User'); 
const Recipe = require('../../models/Recipe'); 
const Bookmark = require('../../models/Bookmarks'); 

router.get('/bookmarks', async (req, res) => {
    try {
      // Fetch all bookmarks
      const totalBookmarkRecipes = await Bookmark.find(); // Exclude the password field
  
      if (totalBookmarkRecipes) {
        // Filter to get unique Post_id values
        const uniqueData = totalBookmarkRecipes.filter((value, index, self) => 
          self.findIndex(item => item.Post_id === value.Post_id) === index
        );
        const uniqueID = uniqueData.map((ids) => ids.Post_id);
        
        // Query to find recipes that match the unique Post_id's (using $in operator to match multiple IDs)
        // const recName = await Recipe.find({
        //   '_id': { $in: uniqueID.map(id => new mongoose.Types.ObjectId(id)) } // Convert to ObjectId format
        // });
        const recName = await Recipe.find({
            '_id': { $in: uniqueID } // Directly pass the uniqueID array
          }).select('_id Recipes');
        return res.json({ recipes: recName });
      }
      return res.json({ recipes: false });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
});
  
router.get('/detail_bookmarkRecipe/:recipe_id', async (req, res) => {
    const { recipe_id } = req.params; 
    try {
        const recipe = await Bookmark.find({ 'Post_id': recipe_id }); // Fetch recipes for the specific user
        // console.log(recipe);

        res.json({recipe }); // Return the recipes as JSON
    } catch (error) {
        console.log('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

module.exports = router;
