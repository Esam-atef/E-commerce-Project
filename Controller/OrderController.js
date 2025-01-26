const Order = require("../Models/OrderSchema");
const Cart = require("../Models/CartSchema");

exports.createOrder = async (req, res) => 
{
    try 
    {
        const { consumerId } = req.params;
        const existingOrder = await Order.findOne({ consumer: consumerId });
        if (existingOrder) 
        {
            return res.status(400).json({ message: "You already have a pending order.", order: existingOrder });
        }
        const cart = await Cart.findOne({ consumer: consumerId }).populate("items.product");
        if (!cart || cart.items.length === 0) 
        {
            return res.status(400).json({ message: "Cart is empty" });
        }
        let totalPrice = 0;
        const orderProducts = cart.items.map(item => {
            totalPrice += item.product.price * item.quantity;
            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price * item.quantity
            };
        });
        const order = new Order({
            consumer: consumerId,
            products: orderProducts,
            totalPrice
        });
        await order.save();
        await Cart.findOneAndUpdate({ consumer: consumerId }, { items: [] });
        const responseOrder = order.toObject({ versionKey: false });
        responseOrder.products = responseOrder.products.map(({ product, quantity, price }) => ({product,quantity,price,}));
        res.status(201).json({message: "Order created successfully", order: responseOrder, additionalMessage: "Thanks for your order!"  });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error });
    }
};


exports.getUserOrders = async (req, res) => 
{
    try 
    {
        const { consumerId } = req.params;
        const orders = await Order.find({ consumer: consumerId }).populate("products.product");
        if (!orders || orders.length === 0) 
        {
            return res.status(404).json({ message: "No orders found for this user." });
        }
        const responseOrders = orders.map(order => 
        {
            const { _id, __v, ...orderDetails } = order.toObject({ versionKey: false });
            orderDetails.products = orderDetails.products.map(({ product, quantity, price }) => ({product,quantity,price,}));
            return orderDetails;
        });
        res.status(200).json({ message: "User orders retrieved successfully", orders: responseOrders });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "An error occurred while retrieving orders", error: error.message });
    }
};


