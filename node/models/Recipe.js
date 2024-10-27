const mongoose = require('mongoose');

// Schema for Recipes and PostedBy object
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    _id: String,
});

const recipeSchema = new mongoose.Schema({
    Image_URL: { type: String, required: true },
    Recipes: { type: String, required: true },
    Ingredients: { type: String, required: true },
    Instructions: { type: String, required: true },
    PostedBy: { type: userSchema, required: true }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;