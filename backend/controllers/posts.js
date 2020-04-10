const Post = require('../models/post')

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + /images/ + req.file.filename,
    creator: req.userData.userId
  });
  console.log('=====================post created===========================');
  console.log(post);

  post.save(post)
    .then(createdPost => {
      res.status(201).json({
        message: 'post added successfully',
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a post failed!'
      });
    });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + /images/ + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: 'Update successfull!'})
      } else {
        res.status(401).json({ message: 'Not authorized!'})
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Could not update post!'
      });
    });
  }

exports.getAllPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize; // + converts string into a number
  const currentPage = +req.query.page;
  const postQuery = Post.find(); //not executed until then() is called
  let fetchedPosts;
  if (pageSize && currentPage) { //pagination options
    postQuery.skip(pageSize * (currentPage - 1)) //don't retrieve all posts so skip all previous pages
    .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching posts failed!'
      });
    });
}

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      console.log(post);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'Post not found!'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching post failed!'
      });
    });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
        if (result.n > 0) {
          res.status(200).json({ message: 'Deletion successfull!'})
        } else {
          res.status(401).json({ message: 'Not authorized!'})
        }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting post failed!'
      });
    });
}
