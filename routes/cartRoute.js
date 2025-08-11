const express = require("express");
const router = express.Router();

const {
  addProductToCart,
  getLoggedUserCart,
  deleteSpecificProduct,
  deleteCartItems,
  updateItemQuantity,
  applyCoupon,
} = require("../controllers/cartController");

const { protect, authorize, checkSame } = require("../middlewares/protect");
router.route("/applycoupon").put(protect, authorize("user"), applyCoupon);
router
  .route("/:id")
  .delete(protect, authorize("user"), deleteSpecificProduct)
  .put(protect, authorize("user"), updateItemQuantity);

router
  .route("/")
  .get(protect, authorize("user"), getLoggedUserCart)
  .post(protect, authorize("user"), addProductToCart)
  .delete(protect, authorize("user"), deleteCartItems);
module.exports = router;
