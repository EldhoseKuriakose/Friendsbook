const express = require('express');
const router = express.Router();
const userRouter = require('./user.router');
const postRouter = require('./post.router');

console.log('Router Loaded');

//Routes
router.use('/user', userRouter);
router.use('/post', postRouter);

module.exports = router;