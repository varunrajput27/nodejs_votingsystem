const jwt=require('jsonwebtoken');
const jwtAutMiddleware=(req,res,next)=>{

    //fist check request header has authorization or not
    const authorization=req.headers.authorization;
    if(!authorization) return res.status(401).json({error:'token not found'})

    // extract the jwt tokrn from the request header

const token=req.headers.authorization.split(' ')[1];
if(!token) return res.status(401).json({error :'unauthorized'});
try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded
    next();

}

catch(err){
    
    console.error(err);
    res.status(401).json({error:'invalid token'});
}
}
// function to generate  jwt token
const generateToken=(userData)=>
{
    //generation a new jwt tokrn using user data
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:30000});
}
module.exports={
    jwtAutMiddleware,
    generateToken  };



 