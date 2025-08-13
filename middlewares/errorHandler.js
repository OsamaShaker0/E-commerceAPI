const ErrorHandler = (err, req, res, next) => {

  if (err.name === "CastError") {
    err.message = "Resource Not Found";
    err.statusCode = 404;
  }
  if (err.code == 11000) {
    err.message = "Duplicate Field Value Entered";
    err.statusCode = 400;
  }
  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors).map((val) => val.message);
    err.statusCode = 400;
  }
  if (err.name == "JsonWebTokenError") {
    err.message = "Invalid token , Please login again";
    err.statusCode = 401;
  }
  if (err.name == "TokenExpiredError") {
    err.message = "Expired token , Please login again";
    err.statusCode = 401;
  }
  return res
    .status(err.statusCode || 500)
    .json({ success: false, Error: err.message || "Server Error" });
};
module.exports = ErrorHandler;
