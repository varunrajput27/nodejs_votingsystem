const express=require('express');
const router=express.Router();
const user=require('./../models/user');
const {jwtAutMiddleware,generateToken} = require('./../jwt');


 ////////////////////////////////////////////////////////////////
router.post('/signup',async (req,res)=>{
        try
    {
         const data=req.body;  // assuming the request body contains the user data

         //create a new user document using the ongoose model
       const newuser=new user(data);  

        //save the new user to the databseJ
       const response= await newuser.save();
       console.log('datasaved');
        const payload=
        {
        id:response.id

        }
     console.log(JSON.stringify(payload));
     const token=generateToken(payload);
     console.log("token is :",token);
     res.status(200).json({response:response,token:token});
    }
        catch(err)
         {
    console.log(err);
    res.status(500).json({error:'internal server error'});
    
        }
    })

  ///////////////////////////////////////////////////////////////////////////
    router.get('/profile',jwtAutMiddleware,async (req,res)=>{
        try{
        const userdata=req.user;
        const userid=userdata.id;
       const user=await person.findbyId(userid);
        res.status(200).json(user);
        }
        catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'});
        }
        })
// ///////////////////////////////////////////////////////////////////////////////////
    router.put('/profile/password',jwtAutMiddleware,async (req,res)=>{
     try{
                    const userid= req.user.id;    // extract the id from token
                    const {currentpassword,newpassword}= req.body;  // extract the cureent and new pswrd from body
                   const user =await userid.findById(userid);

              
            if(!(await user.comparePassword(currentpassword))){
                return res.status(401).json({error:'invalid username or password'})
            }

            //update user password 

            user.password=newpassword;
            await user.save();
            
            console.log('password updated');
            res.status(200).json({message : 'password updated'});
        }
        catch(err){
            console.log(err);
            res.status(500).json({error:'internal server error'})
        }
            })


     module.exports=router;