const mongoose=require('mongoose');
 const bcrypt=require('bcrypt');

//define the person schema
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
       
    },
    mobile:{
        type:Number,
        
    
    },
    address:{
        type:String,
        required:true
    }, 
    aadharcard:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
});
//////////////////////////////////////////////////////////////////////////////
userSchema.pre('save',async function(next){
    const person=this;
    if (!person.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(person.password,salt);
        person.password=hashedPassword;
        next();
    }
    catch(err){
        return err;
    }
})
/////////////////////////////////////////////////////////////////////////////
userSchema.methods.comparePassword=async function(candidatePAssword,candidate)
{
    try{
const isMatch=await bcrypt.compare(candidatePAssword,this.password);
return isMatch;
    }
    catch(err)
    {
        throw err;
    }
}
const user=mongoose.model('user',userSchema);

module.exports=user;