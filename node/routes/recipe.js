const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { jwtAuthMiddleware } = require('../jwt');
const multer = require('multer');
const { uploadFile } = require('../storage/upload'); // Import Cloudinary upload helper

// Get all recipes with pagination
router.get('/data',jwtAuthMiddleware, async (req, res) => {
    const limit = parseInt(req.query._limit) || 4;  // Default to 4 if no limit is provided
    const page = parseInt(req.query._page) || 1;    // Default to page 1 if no page is provided
    const skip = (page - 1) * limit;  // Calculate skip for pagination

    try {
        // Fetch recipes from the database with pagination
        const recipes = await Recipe.find()
            .skip(skip)   // Skip the records based on page number
            .limit(limit); // Apply the limit to restrict the number of records
        
        // Send the response as JSON
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

// Initialize multer (use memory storage to handle images as buffers)
const uploader = multer({
  storage: multer.memoryStorage(),
});

// Endpoint to upload recipe data
router.post('/recipie_data', jwtAuthMiddleware, uploader.single('Image_URL'), async (req, res) => {
  const { Category, Cuisine, Recipes, Ingredients, Instructions, PostedBy, Tags } = req.body;
  
  const imageBuffer = req.file.buffer; // Get the file buffer from multer
  
  if (!Category || !Cuisine || !imageBuffer || !Recipes || !Ingredients || !Instructions || !PostedBy) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    // Upload image to Cloudinary
    const uploadResult = await uploadFile(imageBuffer); // Pass the image buffer to upload helper function
    // console.log(uploadResult);
    const Image_URL = uploadResult.secure_url; // Cloudinary will return the image URL

    // Parse the PostedBy object since it's sent as a JSON string
    const postedBy = JSON.parse(PostedBy);

    // Create a new recipe object and save it to MongoDB
    const recipe = new Recipe({
      Category,
      Cuisine,
      Image_URL,
      Recipes,
      Ingredients,
      Instructions,
      PostedBy: postedBy,  // Store PostedBy as an object
      Tags: Tags ? JSON.parse(Tags) : [],  // Tags are optional and can be empty
    });

    // Save the recipe to MongoDB
    const savedRecipe = await recipe.save();

    res.status(201).json(savedRecipe); // Respond with the saved recipe
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ message: 'Error saving recipe' });
  }
});

router.get('/user_data/:username', jwtAuthMiddleware, async (req, res) => {
    const { username } = req.params; // Extract username from URL

    try {
        const recipes = await Recipe.find({ 'PostedBy.username': username }); // Fetch recipes for the specific user
        res.json(recipes); // Return the recipes as JSON
    } catch (error) {
        console.log('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

// api for recipe id 
router.get('/recipe/:_id', async (req, res) => {
    const { _id } = req.params; 
    // console.log(_id);
    try {
        const recipe = await Recipe.find({ '_id': _id }); // Fetch recipes for the specific user
        res.json(recipe); // Return the recipes as JSON
    } catch (error) {
        console.log('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

// GET request: Fetch the recipe by ID
router.get('/edit_recipe/:_id', async (req, res) => {
    const { _id } = req.params;
    try {
      const recipe = await Recipe.findById(_id);  // Find the recipe by ID
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json(recipe);  // Return the recipe as a JSON response
    } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ message: 'Error fetching recipe' });
    }
  });

// Update recipe endpoint (PUT)
router.put('/edit_recipe/:_id', async (req, res) => {
    const { _id } = req.params;
    
    const { Image_URL, Recipes, Ingredients, Instructions, Category, Cuisine } = req.body;
  
    try {
      const updatedRecipe = await Recipe.findByIdAndUpdate(_id, {
        Image_URL,
        Recipes,
        Ingredients,
        Instructions,
        Category,
        Cuisine
      }, { new: true }); // `new: true` returns the updated document
  
      if (!updatedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      res.json(updatedRecipe);
    } catch (error) {
      console.error('Error updating recipe:', error);
      res.status(500).json({ message: 'Error updating recipe' });
    }
  });
  
// DELETE request: Delete the recipe by ID
router.delete('/edit_recipe/:_id', async (req, res) => {
    const { _id } = req.params;  // Get the recipe ID from the request parameters
    try {
      const recipe = await Recipe.findByIdAndDelete(_id);  // Find and delete the recipe by ID
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      res.status(200).json({ message: 'Recipe successfully deleted' });  // Return success message
    } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(500).json({ message: 'Error deleting recipe' });
    }
  });
  
module.exports = router;