const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded){
            req.body.username = decoded.username;
            next();
        } else {
            res.status(400).json({msg: "Unauthorised Access"});
        }
    } catch (err) {
        res.status(400).json({msg: err.message});
    }
}

module.exports = {auth};
