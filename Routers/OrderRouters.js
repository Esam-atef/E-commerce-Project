const express=require('express')
const router=express.Router()
const order=require('../Controller/OrderController')
const authentication=require('../middleware/auth')

router.post('/:consumerId/create',authentication,order.createOrder)
router.get('/:consumerId',authentication,order.getUserOrders)

module.exports=router