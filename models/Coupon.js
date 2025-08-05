const mongoose = require("mongoose");

const Couponschema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name required"],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon must have expire date"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount percent is required "],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", Couponschema);
