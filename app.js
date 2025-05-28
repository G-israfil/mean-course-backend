const express = require("express");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/post");
var cors = require('cors')

const app = express();
mongoose.connect("dummy").then(res => {
    console.log("Server connected to mongo db successfully...");
}).catch(error => {
    console.log("Connection failed!!");
})


app.use(cors())
app.use(bodyParse.json());
app.post('/api/posts',async (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    await post.save();
    res.status(201).json({
        message: "Post created successfully.",
        post: post
    });
})

app.get('/api/posts',(req, res, next) => {
     Post.find().then(documents => {
         res.status(200).json({
             message: 'Posts fetched successfully',
             posts: documents
         });
     }).catch(error => {
         res.status(500).json({
             message: 'Posts could not fetch!!!'
         });
     })
})

app.delete('/api/posts/:id',(req, res, next) => {
    const id = req.params.id;
    Post.deleteOne({
        _id: id
    }).then(() => {
        res.status(200).json({
            message: 'Post deleted successfully'
        });
    }).catch(error => {
        res.status(403).json({
            message: 'Could not delete the post!!'
        });
    })
})

module.exports = app;
