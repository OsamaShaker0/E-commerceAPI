const mongoose = require("mongoose");
const Product = require("./Product");

const ReviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, "Min rating value is 1.0"],
      max: [5, "max rating value is 5.0"],
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review Must belong to product"],
    },
  },

  { timestamps: true }
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate("user", "name -password");
  next();
});

ReviewSchema.post("save", async function () {
  // this = the review document
  const productId = this.product;

  // 1. Find all reviews for this product
  const reviews = await mongoose.model("Review").find({ product: productId });

  // 2. Calculate new stats
  const numReviews = reviews.length;
  const avgRating = reviews.reduce((sum, r) => sum + r.ratings, 0) / numReviews;

  // 3. Update product document
  await Product.findByIdAndUpdate(productId, {
    numReviews,
    averageRating: avgRating,
  });
});

module.exports = mongoose.model("Review", ReviewSchema);
