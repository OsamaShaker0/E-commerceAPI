const express = require("express");
const router = express.Router();
const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  updateOrderToPaid,
  updateOrderToDeliverd,
  checkoutSession
} = require("../controllers/orderController");
const { protect, authorize } = require("../middlewares/protect");
router.get("/checkout-session/:cartId", protect, authorize("user") , checkoutSession);
router.route("/:cartId").post(protect, authorize("user"), createCashOrder);
router.put("/:id/pay", updateOrderToPaid);
router.put("/:id/deliver", updateOrderToDeliverd);
router.route("/:id").get(protect, authorize("user", "admin"), getSpecificOrder);

router.route("/").get(protect, authorize("user", "admin"), getAllOrders);
module.exports = router;
