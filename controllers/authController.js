const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");
const slugify = require("slugify");
const { sendEmail } = require("../utils/sendEmail");

// @desc     signup user
// @route    POST /api/v1/auth/signup
// @access   public
exports.signup = asyncHandler(async (req, res) => {
  if (
    !req?.body?.name ||
    !req?.body?.email ||
    !req?.body?.password ||
    !req?.body?.confirmPassword
  ) {
    throw new CustomError("Please provide all values", 400);
  }
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    throw new CustomError(
      "Password and password confirmation do not match",
      400
    );
  }
  let user = await User.findOne({ email }).select("-password");
  if (user) {
    throw new CustomError(`User with email ${email} is exist`);
  }
  if (req.body.role) {
    req.body.role = "user";
  }
  req.body.slug = slugify(name);
  if (req.file.fieldname == "image" && req.file.mimetype.startsWith("image")) {
    req.body.profilePicture = req.file.path;
  }

  user = await User.create(req.body);
  const userObj = user.toObject();
  delete userObj.password;
  // generate token
  let token = user.getToken();

  res.status(201).json({
    success: true,
    data: userObj,
    token,
  });
});

// @desc     login user
// @route    POST /api/v1/auth/login
// @access   public

exports.login = asyncHandler(async (req, res) => {
  if (!req?.body?.email || !req?.body?.password) {
    throw new CustomError("Please provide email and password values", 400);
  }
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    throw new CustomError(`User with email ${email} is Not exist`);
  }
  let isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomError("Invalid password", 401);
  }
  let userObj = user.toObject();
  delete userObj.password;
  let token = user.getToken();
  res.status(200).json({
    success: true,
    data: userObj,
    token,
  });
});

// @desc   forget password
// @route  POST /api/v1/auth/forgetpassword
// @access public
exports.fortgetPassword = asyncHandler(async (req, res) => {
  if (!req?.body?.email) {
    throw new CustomError("Please Enter Email", 400);
  }
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    throw new CustomError(`There is no user with email ${email}`, 404);
  }
  // generate code=w and hash it
  let code = user.generateCode();

  let hashCode = user.hashCode(code);
  // save hash code in db & expire data (10 min )
  user.passwordRestCode = hashCode;
  user.passwordRestExpire = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerify = false;
  await user.save();
  // options for send email
  let options = {
    from: `E-shop App ${process.env.EMAIL_AUTH_USER}`,
    to: user.email,
    subject: "Reset User Password (valid for 10 min)",
    text: ` Hi ${user.name} \n We Received Request To Reset The Password On Your E-shop Account \n
     Use This Code To Reset Your Password  ${code}`,
  };
  try {
    await sendEmail(options);
  } catch (error) {
    user.passwordRestCode = undefined;
    user.passwordRestExpire = undefined;
    user.passwordResetVerify = undefined;
    await user.save();
    throw new CustomError("sending email error , try again", 500);
  }

  res.status(200).json({ success: true, msg: "Email Sent" });
});
// @desc   verify reset code
// @route  POST /api/v1/auth/verifyresetcode
// @access public
exports.verifyPassResetCode = asyncHandler(async (req, res) => {
  if (!req?.body?.email || !req?.body?.resetCode) {
    throw new CustomError("Provide All Values", 400);
  }
  const { email, resetCode } = req.body;
  let user = await User.findOne({ email }).select("-password");
  if (!user) {
    throw new CustomError(`There is no user with email ${email}`, 404);
  }
  let dateNow = Math.floor(Date.now() / 1000);

  if (
    !user.passwordRestExpire ||
    dateNow > Math.floor(user.passwordRestExpire.getTime() / 1000)
  ) {
    user.passwordRestCode = undefined;
    user.passwordRestExpire = undefined;
    user.passwordResetVerify = undefined;
    await user.save();
    throw new CustomError("reset code expired", 400);
  }
  // hash enter code
  let hashCode = user.hashCode(resetCode);
  // compare two codes
  if (hashCode !== user.passwordRestCode) {
    throw new CustomError("reset code invalid", 400);
  }
  user.passwordResetVerify = true;
  await user.save();

  res.status(200).json({ success: true });
});
// @desc   reset password
// @route  POST /api/v1/auth/resetpassword
// @access public

exports.resetPassword = asyncHandler(async (req, res) => {
  if (
    (!req?.body?.email && !req?.body?.newPassword) ||
    !req?.body?.confirmPassword
  ) {
    throw new CustomError("Provide All Values", 400);
  }
  let { email, newPassword, confirmPassword } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    throw new CustomError(`There is no user with email ${email}`, 404);
  }
  if (!user.passwordResetVerify) {
    throw new CustomError(`You need To reset Code first `, 400);
  }
  if (newPassword !== confirmPassword) {
    throw new CustomError(
      "Password and password confirmation do not match",
      400
    );
  }
  try {
    user.password = newPassword;
    user.passwordRestCode = undefined;
    user.passwordRestExpire = undefined;
    user.passwordResetVerify = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    return res.status(200).json({ success: true, msg: "Password updated" });
  } catch (error) {
    throw new CustomError("someThing went wrong , try again", 500);
  }
});
