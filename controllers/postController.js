const multer = require("multer");
const path = require("path");
const Post = require("../models/post");
const fs = require("fs");
const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/PNG':'PNG',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const uploadPath = path.join(__dirname, '../images');

        cb(null, uploadPath);
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ext)
    },
})

const upload = multer({ storage: storage });

exports.createPost = async (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: req.file ? '/images/' + req.file.filename : '',
        createdBy: req.userId
    });
    await post.save();
    res.status(201).json({
        message: "Post created successfully.",
        post: post
    });
};

exports.updatePost = async (req, res, next) => {
    Post.updateOne({_id: req.body.id,createdBy: req.userId},{
        title: req.body.title,
        content: req.body.content,
        imagePath: req.file ? '/images/' + req.file.filename : ''
    }).then(rs => {
        if(rs.modifiedCount > 0){
            res.status(202).json({
                message: "Post updated successfully."
            });
        }else{
            res.status(401).json({
                message: "Post could not updated. You are not authorized!"
            });
        }
    })
};

exports.getPosts = (req, res, next) => {
    const pageSize = req.query.pageSize ?? 9999;
    const currentPage = req.query.pageIndex ?? 0;
    Post.find()
        .skip(pageSize*currentPage)
        .limit(pageSize)
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
            });
        }).catch(error => {
        res.status(500).json({
            message: 'Posts could not fetch!!!'
        });
    })
}

exports.getPost = (req, res, next) => {
    const id = req.params.id;
    Post.findOne({
        _id: id
    }).then((document) => {
        res.status(200).json({
            message: 'Post fetched successfully',
            post: document
        });
    }).catch(error => {
        res.status(403).json({
            message: 'Could not fetch the post!!'
        });
    })
};

exports.getPostImage = async (req, res, next) => {
    const id = req.params.id;
    try {
        const post = await Post.findOne({
            _id: id
        })
        console.log(post);
        const imageFileName = path.basename(post.imagePath);
        const imagePath = path.join(__dirname, '../images', imageFileName);
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Image file not found on disk' });
        }
        res.sendFile(imagePath);

    }catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

exports.deletePost = (req, res, next) => {
    const id = req.params.id;
    Post.deleteOne({
        _id: id,
        createBy: req.userId
    }).then(rs => {
        if(rs.deletedCount > 0){
            res.status(200).json({
                message: 'Post deleted successfully'
            });
        }else{
            res.status(401).json({
                message: "Post could not deleted. You are not authorized!!"
            });
        }
    }).catch(error => {
        res.status(403).json({
            message: 'Could not delete the post!!'
        });
    })
};
