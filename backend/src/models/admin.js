const mongoose = require("mongoose");
const add_adminSchema = new mongoose.Schema({
    admin_name: {
        type: String,
        required: true
    },
    admin_location:{
        type:String,
        required:true
    },
    admin_phone_num: {
        type: String,
        required: true,
        unique: true
    },
    admin_email: {
        type: String,
        required: true,
        unique: true
    },
    admin_password: {
        type: String,
        required: true

    }
})
const Add_admin = new mongoose.model("Admin", add_adminSchema);
module.exports = Add_admin;