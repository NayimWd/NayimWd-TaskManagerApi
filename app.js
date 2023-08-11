// basic import
const express = require('express');
const router = require('./src/router/api');
const app = new express();
const bodyParser = require('body-parser');

// security middleware import
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanatize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// db import
const mongoose = require('mongoose');

// security middleware implement
app.use(helmet());
app.use(mongoSanatize());
app.use(xss());
app.use(hpp());
app.use(cors());
app.use(bodyParser.json())

// Request Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// db connection
// dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const userName = process.env.USER_NAME;
const password = process.env.PASSWORD;

// database connection
const URI = `mongodb+srv://${userName}:${password}@cluster0.ilf0sgi.mongodb.net/crud?retryWrites=true&w=majority`;

mongoose
	.connect(URI)
	.then(() => {
		console.log("db connect success!");
	})
	.catch((err) => {
		console.log("db is not connected!");
		console.log(err);
	});


app.use("/api/v1", router);

app.use("*", (req, res)=>{
    res.status(404).json({status: "Router Connect Failed", data: "Router Not Matched"})
})


module.exports = app;