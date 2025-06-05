const express = require("express");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const cors = require('cors')
const bodyParser = require("body-parser");

const app = express();
mongoose.connect(`mongodb+srv://${process.env.db_username}:${process.env.db_password}@mean-course.u8lbvod.mongodb.net/${process.env.db}?retryWrites=true&w=majority&appName=mean-course`).then(res => {
    console.log("Server connected to mongo db successfully...");
}).catch(error => {
    console.log("Connection failed!!");
})


app.use(cors())
app.use(bodyParse.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use("/images", express.static(path.join("mean-course-backend/images")));

app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
