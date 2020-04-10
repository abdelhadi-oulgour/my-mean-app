const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true, default: 'New Post' },
  content: { type: String, required: false },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Post', postSchema);
