const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/', auth.authenticate, userController.getAllUsers);
router.get('/:id', auth.authenticate, userController.getUserById);

module.exports = router;