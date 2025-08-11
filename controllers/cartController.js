const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");
const Product = require("../models/Product");

// @desc    get logged user cart
// @route   GET/api/v1/cart
// @access  private / user
exports.getLoggedUserCart = asyncHandler(async (req, res) => {
  let userCart = await Cart.findOne({ user: req.user._id }).select(
    "-totalPriceAfterDiscount"
  );
  if (!userCart) {
    throw new CustomError(
      `user wit id of ${req.user._id}  has no cart yet , add product to create one `,
      404
    );
  }
  res.status(200).json({
    success: true,
    numOfCartItems: userCart.cartItems.length,
    data: userCart,
  });
});

// @desc    add product to  cart
// @route   POST /api/v1/cart
// @access  private / user
exports.addProductToCart = asyncHandler(async (req, res) => {
  if (!req?.body?.productId || !req?.body?.color) {
    throw new CustomError("Missing values", 400);
  }
  const { productId, color } = req.body;
  let product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError(`there is no product with id of ${productId} `, 404);
  }
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color: color,
          price: product.price,
        },
      ],
    });
  } else {
    let productIdx = cart.cartItems.findIndex(
      (item) => item.product.toString() == productId && item.color == color
    );

    if (productIdx !== -1) {
      let cartItem = cart.cartItems[productIdx];
      cartItem.quantity += 1;
      cart.cartItems[productIdx] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        color: color,
        price: product.price,
      });
    }
  }

  await cart.save();
  res
    .status(200)
    .json({ success: true, msg: "item added to cart ", data: cart });
});

// @desc    delete specific product
// @route   Delete/api/v1/cart/:id
// @access  private / user
exports.deleteSpecificProduct = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new CustomError(`there is no cart for this user  `, 404);
  }
  let productIdx = cart.cartItems.findIndex((item) => item.product == id);
  if (productIdx == -1) {
    throw new CustomError(`No item  in cart with id of ${id} `, 404);
  } else {
    cart.cartItems.splice(productIdx, 1);
    await cart.save();
  }
  res.status(200).json({ success: true, msg: "item deleted from cart " });
});
// @desc    delete cart products
// @route   Delete/api/v1/cart
// @access  private / user

exports.deleteCartItems = asyncHandler(async (req, res) => {
  let user = req.user;
  let cart = await Cart.findOneAndDelete({ user });
  if (!cart) {
    throw new CustomError(`there is no cart for this user  `, 404);
  }
  res.status(200).json({ success: true, msg: "cart deleted  " });
});
// @desc    update item quantity
// @route   PUT/api/v1/cart/:id
// @access  private / user
exports.updateItemQuantity = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let user = req.user._id;
  if (!req?.body?.quantity || req.body.quantity < 1) {
    throw new CustomError(`please add new quantity with positive number `, 400);
  }
  let cart = await Cart.findOne({ user });
  if (!cart) {
    throw new CustomError(`there is no cart for this user  `, 404);
  }

  let itemIdx = cart.cartItems.findIndex((item) => item.product == id);

  if (itemIdx == -1) {
    throw new CustomError(`No item  in cart with id of ${id} `, 404);
  } else {
    let product = await Product.findOne({ _id: id });

    if (!product) {
      throw new CustomError("Product not found ", 404);
    }
    if (product.quantity < req?.body?.quantity) {
      throw new CustomError(
        `available quantity of this product is ${product.quantity}`,
        404
      );
    }
    let item = cart.cartItems[itemIdx];
    item.quantity = parseInt(req.body.quantity);
  }
  await cart.save();

  res.status(200).json({ success: true, msg: "item quantity is updated  " });
});
// @desc    Apply coupon on the cart
// @route   PUT /api/v1/cart/applycoupon
// @access  private / user
exports.applyCoupon = asyncHandler(async (req, res) => {
  let { couponName } = req?.body;
  if (!couponName) {
    throw new CustomError("please add coupon to apply ", 400);
  }
  let coupon = await Coupon.findOne({ name: couponName });
  if (!coupon) {
    throw new CustomError("Coupon is not exist", 404);
  }
  let cart = await Cart.findOne({ user: req.user._id.toString() });
  if (!cart) {
    throw new CustomError("user has no cart yet", 404);
  }

  if (coupon.expire < coupon.createdAt) {
    throw new CustomError(`Coupon is expired `, 400);
  }
  const originalPrice = cart.totalCartPrice;
  const discountPercent = coupon.discount;

  const discountAmount = originalPrice * (discountPercent / 100);
  cart.totalPriceAfterDiscount = originalPrice - discountAmount;
  await cart.save();
  res.status(200).json({
    success: true,
    msg: "coupon applied",
    totalPriceAfterDiscount: cart.totalPriceAfterDiscount,
  });
});
