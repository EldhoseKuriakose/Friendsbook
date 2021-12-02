const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../config/authentication.middleware');
const likeController = require('../controllers/like.controller');

router.get('/:type/:id', authenticationMiddleware.authenticate, likeController.toggleLike);

module.exports = router;