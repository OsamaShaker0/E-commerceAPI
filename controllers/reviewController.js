const Review = require("../models/Review");
const User = require("../models/User");
const Product = require("../models/Product");
const { getAll, getOne, addSingleImage } = require("./refactorController");

const CustomError = require("../utils/CustomError");
const asyncHandler = require("../middlewares/asyncHandler");
const { default: mongoose } = require("mongoose");

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @access  public
exports.getReviews = getAll(Review, "reviews");

// @desc    Get review
// @route   GET /api/v1/reviews/:id
// @access  public
exports.getReview = getOne(Review, "review", "reviews");
// @desc    create review
// @route   POST /api/v1/reviews
// @access  private/ protect/user
exports.createReview = asyncHandler(async (req, res) => {
  if (!req?.body?.ratings || !req?.body?.product) {
    throw new CustomError(`You must enter review rating and product `, 400);
  }
  let user = await User.findById(req.user._id);
  if (!user) {
    throw new CustomError("user not found", 404);
  }

  let product = await Product.findById(req.body.product);
  if (!product) {
    throw new CustomError("product not found", 404);
  }
  let review = await Review.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (review) {
    throw new CustomError(
      "Can not make more than one review for the same product",
      400
    );
  }
  req.body.user = req.user._id;
  let createReview = await Review.create(req.body);

  return res.status(201).json({ success: true, createReview });
});
// @desc    update review
// @route   PUT /api/v1/reviews/:id
// @access  private/protect/user
exports.updateReview = asyncHandler(async (req, res) => {
  let { id } = req.params;
  if (!req?.body?.title && !req?.body?.ratings) {
    throw new CustomError(`Missing Values `, 400);
  }
  let updatedReview = req.review;
  if (!updatedReview) {
    throw new CustomError(`There are no review with id ${id}`, 404);
  }
  if (req?.body?.title) updatedReview.title = req.body.title;
  if (req?.body?.reviews) updatedReview.ratings = req.body.ratings;
  await updatedReview.save();
  return res.status(200).json({ success: true, updatedReview });
});
// @desc    delete review
// @route   DELETE /api/v1/reviews/:id
// @access  private/protect/user/admin
exports.deleteReview = asyncHandler(async (req, res) => {
  try {
    let deletedReview = await Review.findOneAndDelete({ _id: req.review._id });
    let productId = deletedReview.product;
    let reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const avgRating =
      reviews.reduce((sum, r) => sum + r.ratings, 0) / numReviews;
    await Product.findByIdAndUpdate(productId, {
      numReviews,
      averageRating: avgRating,
    });
    return res.status(200).json({ success: true, msg: "review deleted " });
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Server Error " });
  }
});
// @desc    get review for product
// @route   GET /api/v1/reviews/:productId
// @access  public

exports.getReviewForProduct = asyncHandler(async (req, res) => {
  let { productId } = req.params;
  console.log(productId);
  let reviews = await Review.find({ product: productId });
  if (reviews.length == 0) {
    throw new CustomError("There are No review on this product ", 404);
  }
  res.status(200).json({ success: true, reviews });
});
