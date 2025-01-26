const Cart = require('../Models/CartSchema');
const Product = require('../Models/ProductSchema');
const Consumer = require('../Models/ConsumerSchema');

exports.addToCart = async (req, res) => 
{
    const { userId } = req.params;
    const { items } = req.body; 
    try 
    {
        const user = await Consumer.findById(userId);
        if (!user) 
        {
            return res.status(404).json({ message: "User not found" });
        }      
        const productIds = items.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) 
        {
            return res.status(404).json({ message: "One or more products not found" });
        }
        let cart = await Cart.findOne({ consumer: userId });
        if (!cart) 
        {
            cart = new Cart({ consumer: userId, items: [], totalPrice: 0 });
        }

        let totalPrice = cart.totalPrice;
        for (const { productId, quantity } of items) 
        {
            const product = products.find(p => p._id.toString() === productId);
            if (!product) continue; 
            const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (existingItemIndex > -1) 
            {
                cart.items[existingItemIndex].quantity += quantity;
            } 
            else 
            {
                cart.items.push({ product: productId, quantity });
            }
            totalPrice += product.price * quantity;
        }
        cart.totalPrice = totalPrice;
        await cart.save();
        const responseCart =
        {
            user: cart.user,
            items: cart.items.map(({ product, quantity }) => ({ product, quantity })), 
            totalPrice: cart.totalPrice,
        };
        res.status(200).json({ message: "Items added to cart successfully", cart:responseCart });
    } catch (err) {
        res.status(500).json({ message: "An error occurred while adding items to cart", error: err.message });
    }
};

exports.getCart = async (req, res) => 
{
    const { userId } = req.params; 
    try 
    {
        const user = await Consumer.findById(userId);
        if (!user) 
        {
            return res.status(404).json({ message: "User not found" });
        }
        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) 
        {
            return res.status(200).json({ message: "Cart is empty", cart: { items: [], totalPrice: 0 } });
        }
        const detailedCart = await Promise.all(
            cart.items.map(async (item) => {
                const product = await Product.findById(item.product);
                if (product) 
                {
                    return {
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: item.quantity,
                        itemTotal: (product.price * item.quantity).toFixed(2),
                    };
                }
                return null; 
            })
        );
        const validCartItems = detailedCart.filter(item => item !== null);
        res.status(200).json({ message: "Cart retrieved successfully", cart: { items: validCartItems, totalPrice: cart.totalPrice.toFixed(2) } });
    } 
    catch (err) 
    {
        res.status(500).json({ message: "An error occurred while retrieving the cart", error: err.message });
    }
};

exports.removeFromCart = async (req, res) => 
{
    const { userId } = req.params;
    const { productId } = req.body;
    try 
    {
        const user = await Consumer.findById(userId);
        if (!user) 
        {
            return res.status(404).json({ message: "User not found" });
        }
        let cart = await Cart.findOne({ user: userId });
        if (!cart) 
        {
            return res.status(404).json({ message: "Cart not found" });
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) 
        {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        const itemToRemove = cart.items[itemIndex];
        const product = await Product.findById(productId);
        if (!product) 
        {
            return res.status(404).json({ message: "Product not found" });
        }
        cart.totalPrice -= product.price * itemToRemove.quantity;
        cart.items.splice(itemIndex, 1);
        await cart.save();
        const responseCart = 
        {
            user: cart.user,
            items: cart.items.map(({ product, quantity }) => ({ product, quantity })), 
            totalPrice: cart.totalPrice,
        };
        res.status(200).json({ message: "Product removed from cart successfully", cart: responseCart });
    } 
    catch (err) 
    {
        res.status(500).json({ message: "An error occurred while removing product from cart", error: err.message });
    }
};
