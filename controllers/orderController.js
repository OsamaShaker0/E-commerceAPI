const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");

// @desc     create cash oredr
// @route    POST/api/v1/orders/cartId
// @access   private/ user
exports.createCashOrder = asyncHandler(async (req, res) => {
  // app setting
  let taxPrice = 0;
  let shippingPrice = 0;
  // 1- get cart depend on cart id
  let { cartId } = req.params;
  let cart = await Cart.findOne({ _id: cartId });
  if (!cart) {
    throw new CustomError(`No cart with id of ${cartId}`, 404);
  }
  //2- get cart total price 'check if there is coupon or not '
  let cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  let totalOrderPrice = cartPrice + shippingPrice + taxPrice;
  // 3- create order
  let { shippingAddress } = req.body;
  if (!shippingAddress) {
    throw new CustomError(`you must add shipping address `, 400);
  }
  let addressIdx = req.user.addresses.findIndex(
    (address) => address.alias == shippingAddress
  );

  if (addressIdx == -1) {
    throw new CustomError(`address with alias ${shippingAddress} not found`);
  }
  let order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.user.addresses[addressIdx],
  });
  if (!order) {
    throw new CustomError("something went Wrong , try again", 500);
  }
  // 4- if order change product quantity and product sold

  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: {
        _id: item.product,
      },
      update: {
        $inc: { quantity: -item.quantity, sold: +item.quantity },
      },
    },
  }));
  await Product.bulkWrite(bulkOption, {});
  // 5-clear user cart after order created
  await Cart.findByIdAndDelete(cartId);
  res.status(201).json({ success: true, data: order });
});
// @desc     get all orders for admin & user order for user
// @route    get/api/v1/orders/
// @access   private/ user/admin
module.exports.getAllOrders = asyncHandler(async (req, res) => {
  const user = req.user;
  let orders;

  if (user.role === "user") {
    orders = await Order.find({ user: user._id });
  }
  if (user.role === "admin") {
    orders = await Order.find();
  }
  res
    .status(200)
    .json({ success: true, numOfOrdres: orders.length, data: orders });
});
// @desc     get specific order for admin & user order for user
// @route    get/api/v1/orders/:id
// @access   private/ user/admin
module.exports.getSpecificOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  let order;

  if (user.role == "user") {
    order = await Order.findOne({ _id: id, user: user._id });
  }
  if (user.role == "admin") {
    order = await Order.findOne({ _id: id });
  }
  if (!order) {
    throw new CustomError(`order not found `, 404);
  }
  res.status(200).json({ success: true, data: order });
});
// @desc     update order  paid status to true
// @route    PUT/api/v1/orders/:id
// @access   private/admin
exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let order = await Order.findOne({ _id: id });
  if (!order) {
    throw new CustomError(`Can not find order with id of ${id}`, 400);
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  res.status(200).json({ success: true, msg: `paid status is updated ` });
});
// @desc     update order  delever status to true
// @route    PUT/api/v1/orders/:id
// @access   private/admin
exports.updateOrderToDeliverd = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let order = await Order.findOne({ _id: id });
  if (!order) {
    throw new CustomError(`Can not find order with id of ${id}`, 400);
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({ success: true, msg: `deliver status is updated ` });
});

// @desc     get checkout session from stripe and send response
// @route    GET/api/v1/orders/checkout-session/:cartId
// @access   private/user
exports.checkoutSession = asyncHandler(async (req, res) => {
  // app setting
  let taxPrice = 0;
  let shippingPrice = 0;
  // 1- get cart using cart id
  let { cartId } = req.params;
  let { shippingAddress } = req.body;
  if (!shippingAddress) {
    throw new CustomError(`you must add shipping address `, 400);
  }
  let cart = await Cart.findOne({ _id: cartId });
  if (!cart) {
    throw new CustomError(`No cart with id of ${cartId}`, 404);
  }
  // 2- calulate total order price and get shipping address
  let cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  let totalOrderPrice = cartPrice + shippingPrice + taxPrice;
  let addressIdx = req.user.addresses.findIndex(
    (address) => address.alias == shippingAddress
  );
  if (addressIdx == -1) {
    throw new CustomError(
      `address with alias ${req.body.shippingAddress} not in user adresses list`,
      400
    );
  }
  const selectedAddress = req.user.addresses[addressIdx];
  // 3- create  stripe checkout session order

  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: "product",
          },
          unit_amount: Math.round(totalOrderPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: req.user.email,
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    client_reference_id: cart._id.toString(),
    metadata: {
      addressAlias: selectedAddress.alias || "",
      city: selectedAddress.city || "",
      street: selectedAddress.street || "",
      details: selectedAddress.details || "",
      phone: selectedAddress.phone || "",
      userId: req.user._id.toString(),
    },
  });
  // 3- send session to response
  res.status(200).json({ success: true, session });
});
