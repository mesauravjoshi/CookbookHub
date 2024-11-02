const mongoose = require('mongoose');

// Schema for Bookmark
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    _id: String,
});

const bookmarkSchema = new mongoose.Schema({
    Post_id: { type: String,  unique: true , required: true },
    Image_URL: { type: String, required: true },
    Recipes: { type: String, required: true },
    Ingredients: { type: String, required: true },
    Instructions: { type: String, required: true },
    PostedBy: { type: userSchema, required: true }
});
// model for Bookmark
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;