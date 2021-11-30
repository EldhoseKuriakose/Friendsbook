const express = require('express');

const router = express.Router();
const userRouter = require('./user.router');

console.log('Router Loaded');

//Routes
router.use('/user', userRouter);

module.exports = router;