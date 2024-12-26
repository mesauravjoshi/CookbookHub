const express = require('express');
const router = express.Router();
const Admin = require('../../models/Admin')
const { generateToken, jwtAuthMiddleware } = require('../../jwt');

router.post('/signup',async (req,res) => {
    const {username_admin, password} = req.body;

    console.log(username_admin ,password);
    
    const existingUser = await Admin.findOne({ username_admin });
    if(existingUser){
        return res.status(400).json({message: 'User aready exists'});
    }

    let admin = new Admin();
    admin.username_admin = username_admin;
    admin.password = password;

    const doc = await admin.save();
    console.log('New user created:', doc);

    const payload = {
        id: doc.id,
        username_admin: username_admin
    }
    console.log('payload', payload);

    // const token = generateToken(doc.username);
    // console.log(JSON.stringify((payload)));
    const token = generateToken(payload);
    // console.log('Token is : ', token);
    res.json({ doc: doc, token: token });
})

module.exports = router;