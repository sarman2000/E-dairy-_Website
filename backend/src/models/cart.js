const mongoose = require("mongoose");
const add_cartSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
        // unique:true
    },
    product_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
    
    product_quantity:{
        type:Number,
        required:true
    }
})

const Add_cart = new mongoose.model("Cart", add_cartSchema);
module.exports = Add_cart;