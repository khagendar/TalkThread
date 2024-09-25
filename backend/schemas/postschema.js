 const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    username: {
        type:String,
        required :true
    },
    email:{ 
        type:String,
        required:true
    },
    image: Buffer,
    caption: {
        type: String,
        required:false,
    },
    datuploaded :{
        type:Date,
        default:Date.now
    } // Store the image as a binary buffer
});
const userpost = mongoose.model('userposts', imageSchema);

module.exports = userpost;