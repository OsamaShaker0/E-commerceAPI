const Coupon = require("../models/Coupon");
const CustomError = require("../utils/CustomError");
const asyncHandler = require("../middlewares/asyncHandler");

//  @desc       get all coupons
//  @route      GET/api/v1/coupons
//  @access     private/admin
exports.getCoupons = asyncHandler(async (req, res) => {
  let coupons = await Coupon.find({});
  if (coupons.length == 0) {
    return res
      .status(200)
      .json({ success: true, msg: "there are no coupons yet , add one " });
  }
  res.status(200).json({ success: true, count: coupons.length, coupons });
});

//  @desc       create  coupon
//  @route      POST/api/v1/coupons
//  @access     private/admin
exports.createCoupon = asyncHandler(async (req, res) => {
  if (!req?.body?.name || !req?.body?.expire || !req?.body?.discount) {
    throw new CustomError("Missing values", 400);
  }
  let { name, expire, discount } = req.body;
  let coupon = await Coupon.findOne({ name });
  if (coupon) {
    throw new CustomError("coupon name must be unique", 400);
  }
  req.body.expire = Date.now() + req.body.expire * 60 * 60 * 1000;
  coupon = await Coupon.create(req.body);

  res.status(201).json({ success: true, coupon });
});

//  @desc       delete  coupon
//  @route      DELETE/api/v1/coupons/:id
//  @access     private/admin
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let coupon = await Coupon.findOneAndDelete({ _id: id });
  if (!coupon) {
    throw new CustomError(`there are no coupon with id of ${id}`, 404);
  }

  res.status(201).json({ success: true, msg: "coupon deleted" });
});
