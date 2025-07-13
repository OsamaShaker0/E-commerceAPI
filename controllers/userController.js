const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const asyncHandler = require("../middlewares/asyncHandler");
const slugify = require("slugify");
const { getOne, getAll } = require("./refactorController");

// @desc   get all users
// @route  GET /api/v1/users
// @access Private/Admin
exports.getAllUsers = getAll(User, "user");

// @desc   get single user
// @route  GET /api/v1/users/:id
// @access Private/Admin
exports.getSingleUser = getOne(User, "user");

// @desc   create user
// @route  POST /api/v1/users
// @access Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  if (
    !req.body?.name ||
    !req.body?.email ||
    !req.body?.password ||
    !req.body?.passwordConfirm
  ) {
    throw new CustomError("Please provide all values", 400);
  }
  if (req.body.password !== req.body.passwordConfirm) {
    throw new CustomError(
      "Password and password confirmation do not match",
      400
    );
  }

  if (req.file.fieldname == "image") {
    if (!req.file.mimetype.startsWith("image")) {
      throw new CustomError("file must be image", 400);
    }
    req.body.profilePicture = req.file.path;
  }
  req.slug = slugify(req.body.name);
  let user = await User.create(req.body);
  user = user.toObject();
  delete user.pass;
  delete user.passwordConfirm;
  res.status(201).json({
    success: true,
    data: user,
  });
});
// @desc   update user
// @route  PUT /api/v1/users/:id
// @access Private/Admin/same user
exports.updateUser = asyncHandler(async (req, res) => {
  if (!req.body?.name && !req.body?.phone) {
    throw new CustomError("Please provide all values", 400);
  }
  const { name, phone } = req.body;
  let user = await User.findById(req.params.id);
  if (name) user.name = name;
  if (phone) user.phone = phone;

  await user.save();
  if (!user) {
    throw new CustomError("No user Found", 404);
  }
  user = user.toObject();
  delete user.password;
  res.status(200).json({
    success: true,
    data: user,
  });
});
// @desc   update user password
// @route  PUT /api/v1/users/:id/updatepassword
// @access Private/Admin/same user
exports.updateUserPassword = asyncHandler(async (req, res) => {
  if (
    !req.body?.currentPassword ||
    !req.body?.newPassword ||
    !req.body?.confirmPassword
  ) {
    throw new CustomError("Please provide all values", 400);
  }
  const { currentPassword, newPassword, confirmPassword } = req.body;
  let user = await User.findById(req.params.id);

  if (!user) {
    throw new CustomError(`No user With id ${req.params.id}`, 404);
  }

  let isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new CustomError("Invalid password", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new CustomError(
      "Password and password confirmation do not match",
      400
    );
  }
  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();
  res
    .status(200)
    .json({ success: true, msg: "user password updated", userId: user._id });
});
// @desc   delete user
// @route  DELETE /api/v1/users/:id
// @access Private/Admin/same user
exports.deleteUser = asyncHandler(async (req, res) => {
  let user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new CustomError("No user Found", 404);
  }
  // Remove sensitive fields before sending response
  if (user.password) user.password = undefined;
  if (user.tokens) user.tokens = undefined;
  res.status(200).json({
    success: true,
    msg: "user deleted ",
    userId: user._id,
  });
});
// @desc   update user photo
// @route  update /api/v1/users/:id/profilepicture
// @access Private/Admin/same user
exports.updateUserPhoto = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!req.file) {
    throw new CustomError("you must upload image", 400);
  }
  if (!user) {
    throw new CustomError(`No user with Id ${req.params.id}`);
  }
  user.profilePicture = req.file.path;
  await user.save();
  res.status(200).json({ msg: "User profile picture updated " });
});
// @desc   get current user
// @route  GET /api/v1/users/getme
// @access Private/Admin/same user
exports.getMe = asyncHandler(async (req, res) => {
  let user = await User.findById(req.user._id).select("-password ");
  res.status(200).json({ success: true, data: user });
});
