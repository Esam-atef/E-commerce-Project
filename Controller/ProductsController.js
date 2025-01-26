const ProductModel = require('../Models/ProductSchema');

exports.getProduct = async (req, res) => 
{
    try 
    {
        let products = await ProductModel.find({ _id: req.params.id });
        if(!products) 
        {
            return res.status(404).json({ message: "Product not found" });
        }
        else 
        {
            res.status(200).json({ products: products });
        }
    } 
    catch (err) 
    {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}
exports.addProduct = async (req, res) =>
{
    try
    {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        if (decodedToken.role !== "admin") 
        {
            return res.status(403).json({ message: "Don't have permission" });
        }
        let product = new ProductModel(req.body);
        await product.save();
        res.status(201).json({ message: "Product added successfully" });
    }
    catch(err)
    {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}
