const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");
const Product = require("../models/Product");
// @desc    get wishlist
// @route   GET/api/v1/wishlist
// @access  private/ protect
exports.getUserWishlist = asyncHandler(async (req, res) => {
  let wishlist = req.user.wishlist;
  if (wishlist.length == 0) {
    return res.status(200).json({
      success: true,
      msg: `You Have No Products In Your Wishlist , Add one `,
    });
  }
  return res.status(200).json({
    success: true,
    count: wishlist.length,
    wishlist,
  });
});

// @desc    add product to  wishlist
// @route   POST/api/v1/wishlist
// @access  private/ protect
exports.addProductToWishlist = asyncHandler(async (req, res) => {
  if (!req?.body?.productId) {
    throw new CustomError(`Product Id Required`, 400);
  }
  let { productId } = req.body;
  let product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError(`You are trying to add product that not exist`, 404);
  }
  let user = req.user;
  user.wishlist.push(productId);
  await user.save();

  return res.status(201).json({
    success: true,
    msg: `product added to your wishlist succfully `,
  });
});
// @desc    delete product from  wishlist
// @route   DELETE/api/v1/wishlist
// @access  private/ protect
exports.deleteProductFromWishlist = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let wishlist = req.user.wishlist;
  let productIdx = wishlist.indexOf(id);
  if (productIdx == -1) {
    throw new CustomError(`product with id ${id} is not in your wishlist`, 404);
  }

  wishlist.splice(productIdx, 1);
  await req.user.save();

  return res.status(200).json({
    success: true,
    msg: `product deleted from your wishlist succfully `,
  });
});
