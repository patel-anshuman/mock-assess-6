const {UserModel} = require('../models/user.model');
const {Router} = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRouter = Router();

// Register
userRouter.post('/signup', async (req,res) => {
    const {email, password} = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new UserModel({email, password: hash});
            await user.save();
            res.status(200).json({msg: "User registered successfully"});
        });
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
});

//Login
userRouter.post('/login', async (req,res) => {
    const {email, password} = req.body;
    try {
        const isUser = await UserModel.findOne({email});
        if(!isUser){
            res.status(400).json({msg: "User not registered"});
        }
        bcrypt.compare(password, isUser.password, (err, result) => {
            if(result){
                res.status(200).json({
                    msg: "User Login Successful",
                    token: jwt.sign({"userID": isUser._id, email}, process.env.JWT_SECRET)
                });
            } else {
                res.status(400).json({msg: err.message});
            }
        });
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
})



module.exports = userRouter;
