const mongoose = require("mongoose");
const add_orderSchema = new mongoose.Schema({
    order_id:{
        type:Number,
        required:true,
        unique:true
    },
    
    user_phone_num:{type: mongoose.Schema.Types.String, ref: 'user', required:true},

    product_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
    
    product_quantity:{
        type:Number,
        required:true
    },
    payment_mode:{
        type:String,
        required:true
    }
})

const Add_order = new mongoose.model("Order", add_orderSchema);
module.exports = Add_order;