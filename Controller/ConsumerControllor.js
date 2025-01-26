const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel= require('../Models/ConsumerSchema.js');

exports.register=async(req,res)=>
{
    try
    {
        const { name, password, PhoneNumber } = req.body;
        const existUser=await UserModel.findOne({PhoneNumber})
        if(existUser)
        {
            return res.status(400).json({message:"User already exist"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=new UserModel({name,password:hashedPassword,PhoneNumber})
        let createdUser=await newUser.save();
        const token=await jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:'60m'})
        res.status(201).json({message:"User created successfully",user:createdUser, token})
    }
    catch(err)
    {
        res.status(500).json({message: "Something is error R",error:err.message})
    }
}

exports.login = async (req, res) => 
{
    try 
    {
        const { PhoneNumber, password } = req.body;
        const user = await UserModel.findOne({ PhoneNumber });
        if (!user) 
        {
            return res.status(400).json({ message: "Invalid phone number or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) 
        {
            return res.status(400).json({ message: "Invalid phone number or password" });
        }
        const token=await jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'60m'})
        res.status(200).json({message: "Login successful",user: { id: user._id, name: user.name, role: user.role, PhoneNumber: user.PhoneNumber ,token}});
    } 
    catch (err) 
    {
        res.status(500).json({ message: "An error occurred during login", error: err.message });
    }
};
