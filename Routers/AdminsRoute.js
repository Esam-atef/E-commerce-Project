const express=require('express')
const router=express.Router()
const {getOrders}=require('../Controller/admins')
const authentication=require('../middleware/auth')


router.get('/orders',authentication,getOrders)


module.exports=router