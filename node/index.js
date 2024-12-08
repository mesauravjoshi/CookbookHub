const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Import connectDB
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe'); 

require('dotenv').config();

const {jwtAuthMiddleware,generateToken} = require('./jwt')

connectDB().catch(err => console.log(err)); // Call connectDB function

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ***********************************************************************

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const recipe_category = require('./routes/recipe_category');
const bookmarkRoutes = require('./routes/bookmark');
const search = require('./routes/search');

app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/recipe_category', recipe_category);
app.use('/bookmark', bookmarkRoutes);
app.use('/search', search);

// ***********************************************************************

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});