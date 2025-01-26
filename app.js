const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ConsumerRouter=require('./Routers/consumerRouter')
const productRouter = require('./Routers/ProductsRouter');
const CartRouter=require('./Routers/CartRouters');
const favoriteCartRouter = require('./Routers/FavoriteCartRouter');
const orderRouter = require('./Routers/OrderRouters');
const AdminRouter=require('./Routers/AdminsRoute')
dotenv.config()
const app = express();
app.use(bodyParser.json());


const uri=process.env.MONGO_URL;
const connectToDB=async()=>
{
    try
    {
        mongoose.set('strictQuery',false)
        await mongoose.connect(uri)
        console.log("Connected to MongoDB successfully")
    }
    catch(error)
    {
        console.log("the error !@#2: ",error)
        process.exit()
    }
}
connectToDB()

app.use('/api/users',ConsumerRouter)
app.use('/',productRouter)
app.use('/api/cart',CartRouter)
app.use('/api/favoriteCart',favoriteCartRouter)
app.use('/api/order',orderRouter)
app.use('/api/admin',AdminRouter)
app.listen(process.env.PORT || 5060,()=>
{
    console.log(`Server is running on port ${process.env.PORT}`)
})
app.use('*',(req,res)=>
{
    res.json({message:"lef we 2rg3 tany"});
})

