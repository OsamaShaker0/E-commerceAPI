const express = require("express");
const app = express();
const morgan = require("morgan");
const connect = require("./db");
require("dotenv").config();
const categoryRoute = require("./routes/categoryRoute");
const notFound = require("./middlewares/notFound");
const ErrorHandler = require("./middlewares/errorHandler");

// Middlewares
app.use(express.json());
if (process.env.NODE_ENV === "DEV") {
  app.use(morgan("dev"));
}
// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use(ErrorHandler)
app.use(notFound)
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
