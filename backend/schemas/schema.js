const mongoose=require('mongoose');
const bcryptjs=require('bcryptjs');
const userschema=new mongoose.Schema({
        username:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        }
    },{
        timestamps:true,
    }
);

const model=mongoose.model('users',userschema);
module.exports=model