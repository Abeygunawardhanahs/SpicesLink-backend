const express = require('express');
const router = express.Router();
const { registerBuyer, loginBuyer } = require('../controllers/userController');

router.post('/register/buyer', registerBuyer);
router.post('/login/buyer', loginBuyer);

module.exports = router;
