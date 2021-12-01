const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../config/authentication.middleware');
const postController = require('../controllers/post.controller');

router.post('/create', authenticationMiddleware.authenticate, postController.create);
router.put('/update', authenticationMiddleware.authenticate, postController.update);
router.delete('/remove', authenticationMiddleware.authenticate, postController.remove);

module.exports = router;