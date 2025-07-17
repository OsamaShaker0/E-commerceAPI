const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");

// @desc       get all user addresses
// @route      GET/api/v1/addresses
// @access     private/protect
exports.getAddresses = asyncHandler(async (req, res) => {
  let user = req.user;
  let userAddresses = user.addresses;

  if (userAddresses.length == 0) {
    return res.status(200).json({
      success: true,
      msg: "User has no saved addresses Yet , Add One..",
    });
  }
  return res.status(200).json({
    success: true,
    addresses: userAddresses,
  });
});

// @desc       add  address
// @route      POST/api/v1/address
// @access     private/protect
exports.createAddress = asyncHandler(async (req, res) => {
  if (
    !req?.body?.alias ||
    !req?.body?.details ||
    !req?.body?.city ||
    !req?.body?.postalCode
  ) {
    throw new CustomError("Missing values", 400);
  }

  let user = req.user;
  let userAddresses = user.addresses;
  let isExist = userAddresses.find(
    (address) => (address.alias === req?.body?.alias)
  );
  console.log(isExist)
  if (isExist) {
    throw new CustomError(`address alias must be unique`, 400);
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(200).json({
    success: true,
    addresses: userAddresses[userAddresses.length - 1],
  });
});
// @desc    delete product from  wishlist
// @route   DELETE/api/v1/wishlist
// @access  private/ protect
exports.deleteAddress = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let addresses = req.user.addresses;
  let deletedAddress = addresses.find((address) => address._id == id);

  if (!deletedAddress) {
    throw new CustomError(
      `address with id ${id} is not in your addresses list `,
      404
    );
  }
  let addressIdx = addresses.indexOf(deletedAddress);
  addresses.splice(addressIdx, 1);
  await req.user.save();

  return res.status(200).json({
    success: true,
    msg: `address deleted from your addresses list succfully `,
  });
});
