const express = require('express');
const router = express.Router();
const cart = require('../Controller/CartController');
const authentication=require('../middleware/auth')

router.post('/:userId/add',authentication,cart.addToCart);
router.get('/:userId',authentication,cart.getCart);
router.delete('/:userId/delete',authentication,cart.removeFromCart);

module.exports = router;
