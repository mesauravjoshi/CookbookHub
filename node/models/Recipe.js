const mongoose = require('mongoose');

// Schema for Recipes and PostedBy object
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    _id: String,
});

const recipeSchema = new mongoose.Schema({
    Created_At: {
        type: Date,
        default: Date.now, // Automatically sets the current date
    },
    Category : { type: String, required: true },
    Cuisine :{ type: String, required: true },
    Image_URL: { type: String, required: true },
    Recipes: { type: String, required: true },
    Ingredients: { type: String, required: true },
    Instructions: { type: String, required: true },
    PostedBy: { type: userSchema, required: true },
    Tags: { type: Array, required: false},
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;