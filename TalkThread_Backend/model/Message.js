const mongoose=require('mongoose');
const MessageSchema=new mongoose.Schema({

   conversationId:{
    type:String,
   },
   sender:{
    type:String,
   },
   text:{
    type:String,
   },type:{
      type:String,
   },subtype:{
      type:String,
   }
},{timestamps:true})
const model=mongoose.model("Message",MessageSchema);
module.exports=model;