const mongoose = require("mongoose");
const add_categorySchema = new mongoose.Schema({
    category_name:{
        type:String,
        required:true,
        unique:true
    }
})

const Add_cat = new mongoose.model("Category", add_categorySchema);
module.exports = Add_cat;