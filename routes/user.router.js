const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticationMiddleware = require('../config/authentication.middleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/follow/:userName', authenticationMiddleware.authenticate, userController.follow);
router.get('/unFollow/:userName', authenticationMiddleware.authenticate, userController.unFollow);

module.exports = router;