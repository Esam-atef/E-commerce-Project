const jwt=require('jsonwebtoken')
module.exports=(req,res,next)=>
{
    try
    {
        const fullToken=req.headers.authorization
        const token=fullToken?.split(' ')[1]
        if(!token)res.status(401).send("Access Denied")
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=decodedToken
        next()
    }
    catch(err)
    {
        console.log("@error : ",err)
        res.status(401).send({message:"Invalid token"})
    }
}