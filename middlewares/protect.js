const CustomError = require("../utils/CustomError");
const asyncHandler = require("./asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Review = require("../models/Review");
exports.protect = asyncHandler(async (req, res, next) => {
  if (!req?.headers?.authorization) {
    return next(
      new CustomError(`please login first to access this route `, 401)
    );
  }
  let token;
  if (
    req.headers?.authorization &&
    req.headers?.authorization.startsWith("Bearer ")
  ) {
    token = req.headers?.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new CustomError(`Invalid token `, 401));
  }
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    return next(
      new CustomError(`user with id ${decoded.userId} no longer exist`, 401)
    );
  }
  // check if password changed after create token
  if (user.passwordChangedAt) {
    const passwordChangedAtStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passwordChangedAtStamp > decoded.iat) {
      return next(
        new CustomError(
          `user recently changed the password , please login again `,
          401
        )
      );
    }
  }
  req.user = user;
  next();
});
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }

    return next(
      new CustomError(
        `User  With Role ${req.user.role} Not Allowed To Access This Route`,
        403
      )
    );
  };
};

exports.checkSame = (req, res, next) => {
  if (req.user.role == "admin") {
    return next();
  }
  if (req.user._id !== req.params.id) {
    return next(new CustomError("Not Authorize To Access ", 401));
  }
};
exports.checkSameUserReview = async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    throw new CustomError(`There are no review with id ${req.params.id}`, 404);
  }
  if (req.user.role == "admin") {
     req.review = review;
    return next();
  }

  if (req.user._id.toString() !== review.user._id.toString()) {
    return next(new CustomError("Not Authorize To Access ", 401));
  }
  req.review = review;
  next();
};
