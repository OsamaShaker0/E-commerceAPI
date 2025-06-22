const express = require("express");
const app = express();
const morgan = require("morgan");
const connect = require("./db");
require("dotenv").config();

if (process.env.NODE_ENV === "DEV") {
  app.use(morgan("dev"));
}
app.get("/", (req, res) => {
  res.send("Hello from the other side ");
});

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
