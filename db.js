const mongoose = require("mongoose");
require("dotenv").config();

function connect() {
  mongoose.connect(process.env.DB_STRING);
}
module.exports = connect;
