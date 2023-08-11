// import app
const app = require("./app");

// dotenv configure
const dotenv = require('dotenv');
dotenv.config({path: "./config.env"});

// defining port
const port = process.env.RUNNING_PORT;


// connecting with port
app.listen(port, ()=>{
    console.log("server is running on port:", port)
})