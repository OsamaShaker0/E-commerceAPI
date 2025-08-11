const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
// calulate total price
CartSchema.pre("save", function () {
  let totalPrice = 0;
  this.totalCartPrice = this.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  this.totalCartPrice = totalPrice;
});

module.exports = mongoose.model("Cart", CartSchema);
