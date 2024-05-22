const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUser, verify_isVisited } = require('../middlewares/auth');

router.post('/api/signup', userController.signup);
router.post('/api/login', userController.login);
router.get('/api/profile', verifyUser, userController.userProfile);
router.get('/api/confirm', verify_isVisited, userController.emailConfirmation);

module.exports = router;