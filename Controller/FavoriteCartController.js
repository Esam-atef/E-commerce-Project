const FavoriteCart  = require('../Models/FavoriteCart');
const Product = require('../Models/ProductSchema');
const User  = require('../Models/ConsumerSchema');

exports.addToCart = async (req, res) =>
{
    try 
    {
        const { userId, productId } = req.params;
        const user = await User.findById(userId);
        const product = await Product.findById(productId);
        if (!user) 
        {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!product) 
        {
            return res.status(404).json({ message: 'Product not found' });
        }
        let favoriteCart = await FavoriteCart.findOne({ user: userId });
        if (!favoriteCart) 
        {
            favoriteCart = new FavoriteCart({ user: userId, products: [productId] });
        } 
        else 
        {
            if (favoriteCart.products.includes(productId)) 
            {
                return res.status(400).json({ message: 'Product already in favorites' });
            }
            favoriteCart.products.push(productId);
        }
        await favoriteCart.save();
        res.status(200).json({ message: 'Product added to favorites'});
    }
    catch (err)
    {
        res.status(500).json({ message: "An error occurred while adding items to cart", error: err.message });
    }
}

exports.getFavorite = async (req, res) =>
{
    try 
    {
        const { userId } = req.params;
        const favoriteCart = await FavoriteCart.findOne({ user: userId }).populate({
            path: 'products', 
            select: '-_id -__v'
        });
        if (!favoriteCart) 
        {
            return res.status(404).json({ message: 'No favorite cart found for this user' });
        }
        res.status(200).json({ favoriteProducts: favoriteCart.products });
    } 
    catch (err) 
    {
        res.status(500).json({ message: 'Server error', error:err.message });
    }
}

exports.deleteFavorite = async (req, res) =>
{
    try 
    {
        const { userId, productId } = req.params;
        let favoriteCart = await FavoriteCart.findOne({ user: userId });
        if (!favoriteCart) {
            return res.status(404).json({ message: 'No favorite cart found for this user' });
        }
        const productIndex = favoriteCart.products.indexOf(productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in favorite cart' });
        }
        favoriteCart.products.splice(productIndex, 1);
        await favoriteCart.save();
        res.status(200).json({ message: 'Product removed from favorites ...'});
    } 
    catch (err) 
    {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}