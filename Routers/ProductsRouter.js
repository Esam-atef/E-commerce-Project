const userController = require('../Controller/ProductsController');
const express = require('express');
const router = express.Router();
const authentication=require('../middleware/auth')


router.get('/api/products/:id',authentication, userController.getProduct);
router.post('/api/products/add', authentication,userController.addProduct);







module.exports=router