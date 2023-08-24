const {UserModel} = require('../models/user.model');
const {Router} = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userRouter = Router();

// Register
userRouter.post('/register', async (req,res) => {
    const {username, avatar, email, password} = req.body;
    try {
        const isUser = await UserModel.findOne({email});
        if(isUser){
            res.status(200).json({msg: "User already registered. Kindly signin"});
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                const payload = {username, avatar, email, password: hash};
                const user = new UserModel(payload);
                await user.save();
                res.status(200).json({msg: "SignUp Successful"});
            });
        }
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
});

userRouter.post('/login', async (req,res) => {
    const { email, password} = req.body;
    try {
        const isUser = await UserModel.findOne({email});
        // console.log(isUser)
        if(!isUser){
            res.status(200).json({msg: "User not registered"});
        }
        bcrypt.compare(password, isUser.password, async (err, result) => {
            if(result){
                res.status(200).json({
                    username: isUser.username,
                    email: isUser.email,
                    avatar: isUser.avatar,
                    token: jwt.sign({ username: isUser.username, email: isUser.email }, process.env.JWT_SECRET)
                });
            } else if(err){
                res.status(400).json({msg: err.message});
            }
        });
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
});





module.exports = userRouter;
