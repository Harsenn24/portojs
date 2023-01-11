const express = require("express");
const router = express.Router();
const { StoreController } = require("../controller/register_login");
const { ProductController } = require("../controller/product");
const { authentif } = require("../middleware/authentif");
const { result_image } = require("../middleware/multer");
const { authorization } = require("../middleware/authorized");

router.post("/register", StoreController.register_user)
router.put("/active-store", StoreController.active_user)
router.post("/login", StoreController.login_user)
router.get("/product-id", ProductController.id_product_image)
router.get("/products-all", ProductController.get_product)
router.get("/product-image", ProductController.product_image)

router.use(authentif)

router.post("/product-create", result_image, ProductController.create_product)
router.put("/products-all/:id", authorization, ProductController.edit_product)







module.exports = router