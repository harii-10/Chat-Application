const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/:userId', auth.authenticate, messageController.getMessages);
router.post('/', auth.authenticate, messageController.sendMessage);

module.exports = router;