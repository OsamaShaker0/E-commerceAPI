const express = require("express");
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
const couponRoute = require('./routes/couponRoute')
// Middlewares
app.use(express.json());
if (process.env.NODE_ENV === "DEV") {
  app.use(morgan("dev"));
}
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
app.use('/api/v1/coupons' , couponRoute)
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
