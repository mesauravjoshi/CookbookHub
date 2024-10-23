const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Import connectDB
const mongoose = require('mongoose');
require('dotenv').config();

const {jwtAuthMiddleware,generateToken} = require('./jwt')

connectDB().catch(err => console.log(err)); // Call connectDB function

// Schema for users
const usersSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true }, // Ensure unique usernames
    password: String
});
// model for users
const User = mongoose.model('User', usersSchema);

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

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
    const { name,username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        console.log('User already exists:', username);
        return res.status(400).json({ message: 'User already exists' });
    }

    let user = new User();
    user.name = name;
    user.username = username;
    user.password = password;

    const doc = await user.save();
    console.log('New user created:', doc);  

    const payload = {
        id: doc.id,
        username: doc.username
    }

    // const token = generateToken(doc.username);
    console.log(JSON.stringify((payload)));
    const token = generateToken(payload);
    console.log('Token is : ', token);
    
    res.json({doc: doc, token : token});
})

app.post('/login', async (req, res) => {
    // console.log(req.body);
    // res.json(req.body)

    const { username, password } = req.body;
    // Find user by username
    const user = await User.findOne({ username });
    // Check if user exists
    if (!user) {
        return res.status(400).json({ message: 'Incorrect username' });
    }
    // Compare passwords
    if (password !== user.password) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    const payload = {
        id: user.id,
        username: user.username
    }
    const token = generateToken(payload)
    // Successful login
    res.json({ message: 'Login successful', user ,token });
})

// Recipe_Data route
app.post('/recipie_data', jwtAuthMiddleware,async (req, res) => {
    const { Image_URL, Recipes, Ingredients, Instructions, PostedBy } = req.body; // Ensure you destructure UploadedBy
    if (!Image_URL || !Recipes || !Ingredients || !Instructions || !PostedBy) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Create a new recipe document
    const recipe = new Recipe({ Image_URL, Recipes, Ingredients, Instructions, PostedBy: PostedBy }); // Save UploadedBy as PostedBy
    try {
        const savedRecipe = await recipe.save();
        console.log('New recipe created:', savedRecipe);
        res.status(201).json(savedRecipe); // Respond with the created recipe
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).json({ message: 'Error saving recipe' });
    }
});

app.get('/data',jwtAuthMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find(); // Fetch all recipes
        res.json(recipes); // Return the recipes as JSON
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});