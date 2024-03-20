const mongoose = require("mongoose");
const add_productSchema = new mongoose.Schema({
    category_type:{
        type:String,
        required:true
    },
    product_name:{
        type:String,
        required:true
    },
    product_description:{
        type:String,
        required:true
    },
    product_price:{
        type:Number,
        required:true

    },
    product_quantity:{
        type:Number,
        required:true
    },
    product_image:{
        type:String,
        required:true
    },
    admin_phone_num:{type: mongoose.Schema.Types.String, ref: 'admin', required:true},
})
const Add_pro = new mongoose.model("Product", add_productSchema);
module.exports = Add_pro;