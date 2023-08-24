const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {connection} = require('./database/db');  //Imported DB connection
const userRoute = require('./routes/user.route');   //Imported routes
const blogRoute = require('./routes/blog.route');
const {auth} = require('./middlewares/auth.middleware');

const app = express();  //Created Express App

app.use(express.json());
app.use(cors());

// app.get('/', async (req,res) => {
//     res.status(200).send("Masai Hospital");
// });

app.use('/',userRoute);
app.use(auth);
app.use('/',blogRoute);

//Establishing Atlas DB connection
const port = process.env.PORT;
app.listen(port, async() => {
    try {
        await connection;
        console.log("Connected to Mongo Atlas DB");
        console.log(`Server running at port ${port}`);
    } catch (error) {
        console.log("Error connecting to database");
    }
})

module.exports = app;   //Exported Express App