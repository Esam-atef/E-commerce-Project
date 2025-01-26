const express= require('express')
const router=express.Router()
const authentication=require('../middleware/auth')
const favoriteCart = require('../Controller/FavoriteCartController')

router.post('/add/:userId/:productId',authentication,favoriteCart.addToCart)
router.get('/:userId',authentication,favoriteCart.getFavorite)
router.delete('/delete/:userId/:productId',authentication,favoriteCart.deleteFavorite)


module.exports=router