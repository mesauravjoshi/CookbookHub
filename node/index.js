const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Import connectDB
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe'); 

require('dotenv').config();

const {jwtAuthMiddleware,generateToken} = require('./jwt')

connectDB().catch(err => console.log(err)); // Call connectDB function

// ***************************************************************************************
// for test  
// Schema for Bookmark
// *************************************************************************************
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ***********************************************************************

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const bookmarkRoutes = require('./routes/bookmark');

app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/bookmark', bookmarkRoutes);

// ***********************************************************************


// ****************************************************************************************
// for test 

// ****************************************************************************************

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});