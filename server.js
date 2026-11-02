const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");

    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
})
.catch(err => console.log(err));

