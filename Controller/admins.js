const jwt = require("jsonwebtoken");
const Order=require('../Models/OrderSchema')
const User=require('../Models/ConsumerSchema')
exports.getOrders =async(req, res) =>
{
    try 
    {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) 
        {
            return res.status(401).json({ message: "Token is missing" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        if (decodedToken.role !== "admin") 
        {
            return res.status(403).json({ message: "Don't have permission" });
        }
        const orders = await Order.find().populate("consumer", "name role PhoneNumber").populate("products.product", "name price")
        const formattedOrders = orders.map(order => ({
            consumer: 
            {
                name: order.consumer.name,
                role: order.consumer.role,
                PhoneNumber: order.consumer.PhoneNumber
            },
            products: order.products.map(p => ({
                product: 
                {
                    name: p.product.name,
                    price: p.product.price
                },
                quantity: p.quantity,
                price: p.price
            })),
            totalPrice: order.totalPrice,
            createdAt: order.createdAt
        }));
        res.status(200).json(formattedOrders);
    }
    catch(err)
    {
        res.status(500).json({ message: err.message });
    }
}


