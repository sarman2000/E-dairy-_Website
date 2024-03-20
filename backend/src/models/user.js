const mongoose = require("mongoose");
const add_userSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true
    },
    user_location:{
        type:String,
        required:true
    },
    user_phone_num:{
        type:String,
        required:true,
        unique:true
    },
    user_email:{
        type:String,
        required:true,
        unique:true
    },
    user_password:{
        type:String,
        required:true

    }
})
const Add_user = new mongoose.model("User", add_userSchema);
module.exports = Add_user;