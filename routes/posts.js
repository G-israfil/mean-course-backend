const express = require("express");
const authMiddleware = require("../middleware/auth-middleware")
const router = express.Router();
const postController = require("../controllers/postController")
const fileExtractor = require("../middleware/file-middleware");
router.post('',authMiddleware,fileExtractor,postController.createPost)
router.put('',authMiddleware,fileExtractor,postController.updatePost)
router.get('',postController.getPosts)
router.get('/:id',postController.getPost)
router.get('/:id/image',postController.getPostImage)
router.delete('/:id',authMiddleware,postController.deletePost)

module.exports = router;
