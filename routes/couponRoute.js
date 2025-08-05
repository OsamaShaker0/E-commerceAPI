const express = require("express");
const router = express.Router();

const { getCoupons, createCoupon,deleteCoupon } = require("../controllers/couponController");

const { protect, authorize } = require("../middlewares/protect");

router.route("/:id").delete(protect, authorize("admin"), deleteCoupon);
router
  .route("/")
  .get(protect, authorize("admin"), getCoupons)
  .post(protect, authorize("admin"), createCoupon);
module.exports = router;
