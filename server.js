const express = require("express");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const app = express();
const morgan = require("morgan");
const connect = require("./db");
require("dotenv").config();
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const notFound = require("./middlewares/notFound");
const ErrorHandler = require("./middlewares/errorHandler");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const addressestRoute = require("./routes/addressesRoute");
const couponRoute = require("./routes/couponRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
// Middlewares
app.use(express.json());
if (process.env.NODE_ENV === "DEV") {
  app.use(morgan("dev"));
}
// some important security packages
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());
// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/addresses", addressestRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use(ErrorHandler);
app.use(notFound);
// start server and db
const port = process.env.PORT || 8000;
const startServer = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};
startServer();
