const userController = require('../Controller/ConsumerControllor.js');
const express = require('express');
const router = express.Router();
const authentication=require('../middleware/auth')


router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports=router