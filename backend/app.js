const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();
//mongo pass:  tfcfgY7LAm6YAaQh
mongoose.connect('mongodb+srv://abdo:'+ process.env.MONGO_ATLAS_PW +'@cluster0-qw8vd.mongodb.net/node-angular')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection faild!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('images'))); //allow access to images folder

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
})

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);
module.exports = app;
