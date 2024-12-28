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
const deleteAccount = require('./routes/deleteAccount');
const updateUserInfo = require('./routes/updateUserInfo');
// --------> admin routes 
const admin = require('./routes/admin/admin');
const admin_auth = require('./routes/admin/admin_auth');
const admin_bookmark = require('./routes/admin/admin_bookmark');

app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/recipe_category', recipe_category);
app.use('/bookmark', bookmarkRoutes);
app.use('/search', search);
app.use('/delete_account', deleteAccount);
app.use('/update_UserInfo', updateUserInfo);
// --------> admin routes 
app.use('/admin', admin);
app.use('/admin_auth', admin_auth);
app.use('/admin_bookmark', admin_bookmark);

// ***********************************************************************

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});