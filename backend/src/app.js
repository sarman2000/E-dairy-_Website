const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const session = require("express-session");
const hbs = require("hbs");
const multer = require("multer");
require("./db/conn");
const Add_cat = require("./models/category");
const Add_pro = require("./models/product");
const Add_user = require("./models/user");
const Add_admin = require("./models/admin");
const Add_cart = require("./models/cart");
const Add_order = require("./models/order");
const { CLIENT_RENEG_LIMIT } = require("tls");
const { send } = require("process");
const bodyParser = require('body-parser');
const { Console } = require("console");
const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

var storage = multer.diskStorage({
    destination: 'templates/views/images/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({
    storage: storage
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", static_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'NoSmoking',
    // resave: false,
    // saveUninitialized: true
}));

app.post("/index_admin", async (req, res) => {
    const a_id = req.body.phone_num;
    if (await Add_admin.findOne({ admin_phone_num: a_id })) {
        var check_admin = await Add_admin.findOne({ admin_phone_num: a_id });
        if (check_admin.admin_password == req.body.password) {
            req.session.adminId = a_id;
            const product = await Add_pro.find();
            res.render("index_admin", {
                product: product
            });
        } else {
            var check_admin = "x";
        }
    } else {
        res.send(`Wrong id or password!! Please enter valid details.`)
    }
})

app.post("/index", async (req, res) => {
    const id = req.body.phone_num;
    if (await Add_user.findOne({ user_phone_num: id })) {
        var check_user = await Add_user.findOne({ user_phone_num: id });
        if (check_user.user_password == req.body.password) {
            req.session.userId = id;
            const product = await Add_pro.find();
            res.render("index", {
                product: product
            });
        } else {
            var check_user = "x";
        }
    } else {
        res.send(`Wrong id or password!! Please enter valid details.`)
    }
})


app.get("/", async (req, res) => {
    const product = await Add_pro.find();
    res.render("index", {
        product: product
    });
})

app.get("/index", async (req, res) => {
    const product = await Add_pro.find();
    res.render("index", {
        product: product
    });
})

app.get("/index_admin", async (req, res) => {
    const product = await Add_pro.find();
    res.render("index_admin", {
        product: product
    });
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/login_admin", (req, res) => {
    res.render("login_admin");
})

app.get("/cart", async (req, res) => {
    const userid = req.session.userId;
    let cart_list = await Add_cart.find({ user_id: userid }).populate("product_id");
    let total_price = 0;
    if (userid == null) {
        res.render("login");
    }
    else {
        for (let i = 0; i < cart_list.length; i++) {
            const item = cart_list[i]
            item.total = item.product_quantity * item.product_id.product_price,
                total_price += item.total
        }
        res.render("cart", {
            products: cart_list,
            total_price,
        });
    }
})

app.post("/cart", async (req, res) => {
    const id = req.body.pro_id;
    const user_id = req.session.userId;
    if (user_id == null) {
        res.render("login");
    }
    else {
        try {
            const add_cart = new Add_cart({
                user_id: user_id,
                product_id: id,
                product_quantity: req.body.user_pro_quantity
            })
            const addcart = await add_cart.save();
            const product = await Add_pro.find();
            res.render("shop", {
                product: product
            });
        } catch (error) {
            console.error(error)
            res.status(400).send(error);
        }
    }
})

app.get("/shop", async (req, res) => {
    const product = await Add_pro.find();
    const category_name = await Add_cat.find();
    res.render("shop", {
        product: product,
        category_name: category_name
    });
})

app.get("/view_by_cat", async (req, res) => {
    const cat_nm = req.query.cat_name;
    let product = await Add_pro.find({ category_type: cat_nm });
    let category_name = await Add_cat.find();
    if (product == 0) {
        res.render("view_by_cat", {
            message: "Sorry!! no product available for this category",
            product: product,
            category_name: category_name,
            show_category: cat_nm
        });
    } else {
        res.render("view_by_cat", {
            product: product,
            category_name: category_name,
            show_category: cat_nm
        });
    }
})

app.get("/search", async (req, res) => {
    const searched_item = req.body.search;
    console.log(searched_item);
    // let product = await Add_pro.find({ category_type: cat_nm });
    // let category_name = await Add_cat.find();
    if (product == 0) {
        res.render("view_by_cat", {
            message: "Sorry!! no product available for this category",
            product: product,
            category_name: category_name,
            show_category: cat_nm
        });
    } else {
        res.render("view_by_cat", {
            product: product,
            category_name: category_name,
            show_category: cat_nm
        });
    }
})

app.get("/admin_dash", (req, res) => {
    const admin_id = req.session.adminId;
    if(admin_id == null){
        res.render("login_admin")
    }
    else{
        res.render("admin_dash");
    }
})

app.get("/add_category", (req, res) => {
    res.render("add_category");
})

app.get("/Aboutus", (req, res) => {
    res.render("Aboutus");
})

app.get("/contactus", (req, res) => {
    res.render("contactus");
})

app.get("/bill", (req, res) => {
    res.render("bill");
})

app.get("/oln_pay", async (req, res) => {
    const userid = req.session.userId;
    const id = req.query.pid;
    const quantity = req.query.user_pro_quantity;
    const pay_mode = req.query.payment_mode;
    let order_list = await Add_order.findOne({}, {}, { sort: { order_id: -1 } });
    if (order_list == null) {
        ord_id = 0;
    } else {
        ord_id = order_list.order_id + 1;
    }
    try {
        const add_order = new Add_order({
            order_id: ord_id,
            user_phone_num: userid,
            product_id: id,
            product_quantity: quantity,
            payment_mode: pay_mode
        })
        const addorder = await add_order.save();
    }catch (error) {
        res.status(400).send(error);
    }
    res.render("oln_pay");
})

app.get("/forget_pass", (req, res) =>{
    res.render("forget_pass");
})

app.get("/add_product", async (req, res) => {
    const category_name = await Add_cat.find();
    res.render("add_product", {
        category_name: category_name
    });
})

app.get("/pay", async (req, res) => {
    const userid = req.session.userId;
    const cartId = req.query.ord_id;
    const id = req.query.pid;
    const quantity = req.query.user_pro_quantity;
    if (userid == null) {
        res.render("login");
    }
    else {
        if (cartId == null) {
            let buy_list = await Add_pro.findOne({ _id: id });
            let total_price = req.query.user_pro_quantity * buy_list.product_price;
            res.render("pay", {
                userid: userid,
                buying_product: buy_list,
                quantity: quantity,
                total_price
            });
        } else {
            let buy_list = await Add_cart.findOne({ _id: cartId });
            let quantity = buy_list.product_quantity;
            const pr_id = buy_list.product_id.toString();
            const product = await Add_pro.findById(pr_id);
            let total_price = quantity * product.product_price;;
            res.render("pay", {
                userid: userid,
                buying_product: product,
                quantity: quantity,
                total_price
            });
        }
    }
})

app.get("/cash_pay", async (req, res) => {
    const userid = req.session.userId;
    const id = req.query.pid;
    const quantity = req.query.user_pro_quantity;
    const pay_mode = req.query.payment_mode;
    let order_list = await Add_order.findOne({}, {}, { sort: { order_id: -1 } });
    if (order_list == null) {
        ord_id = 0;
    } else {
        ord_id = order_list.order_id + 1;
    }
    try {
        const add_order = new Add_order({
            order_id: ord_id,
            user_phone_num: userid,
            product_id: id,
            product_quantity: quantity,
            payment_mode: pay_mode
        })
        const addorder = await add_order.save();
        let your_order_list = await Add_order.findOne({ order_id: ord_id });
        // console.log(our_order_list);
        let you_user = await Add_user.findOne({ user_phone_num: userid });
        let your_product = await Add_order.findOne({ order_id: ord_id }).populate("product_id");
        let product = your_product.product_id;
        let total = product.product_price * your_order_list.product_quantity;
        res.status(201).render("bill", {
            your_order: your_order_list,
            product: product,
            user: you_user,
            total: total
        });
    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/view", async (req, res) => {
    const id = req.body.pro_id;
    const thisproduct = await Add_pro.findById(id);
    res.render("view", {
        product: thisproduct
    });
})

app.post("/signup", async (req, res) => {
    try {
        const add_user = new Add_user({
            user_name: req.body.name,
            user_location: req.body.location,
            user_phone_num: req.body.phone_num,
            user_email: req.body.email,
            user_password: req.body.password
        })
        const adduser = await add_user.save();
        const product = await Add_pro.find();
        res.status(201).render("index", {
            product: product
        }
        );

    } catch (error) {
        res.status(400).render("signup");
    }
})

app.get("/admin_signup", (req, res) => {
    res.render("admin_signup");
})

app.post("/admin_signup", async (req, res) => {
    try {
        const add_admin = new Add_admin({
            admin_name: req.body.admin_name,
            admin_location: req.body.location,
            admin_phone_num: req.body.admin_phone_num,
            admin_email: req.body.admin_email,
            admin_password: req.body.admin_password
        })
        const addadmin = await add_admin.save();
        res.status(201).render("admin_signup");

    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/add_category", async (req, res) => {
    try {
        const add_category = new Add_cat({
            category_name: req.body.category_name
        })
        const add = await add_category.save();
        res.status(201).render("admin_dash");

    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/add_product", upload.single('product_image'), async (req, res) => {
    const ad_id = req.session.adminId;
    try {
        const add_product = new Add_pro({
            category_type: req.body.category_type,
            product_name: req.body.product_name,
            product_description: req.body.product_description,
            product_price: req.body.product_price,
            product_quantity: req.body.product_quantity,
            product_image: req.file.filename,
            admin_phone_num: ad_id
        })
        const addproduct = await add_product.save();
        res.status(201).render("admin_dash");

    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})
app.listen(port, () => {
    console.log((`server is running at port  ${port}`));
})