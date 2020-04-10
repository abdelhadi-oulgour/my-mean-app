const express = require('express');

const PostsController = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');

const extractFile = require('../middleware/file');

const router = express.Router();



router.post(
  '', //route to
  checkAuth, // run this middleware before doing anything else with the request
  extractFile, //check and extract image file middleware
  PostsController.createPost); // the controller refrence

router.put(
  "/:id",
  checkAuth,
  extractFile,
  PostsController.updatePost
);

router.get('', PostsController.getAllPosts);

router.get('/:id', PostsController.getPostById);

router.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = router;
