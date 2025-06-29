const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You Must Enter Brand name"],
    minlingth: [3, "Brand Name Need To Be 3 Char Or More"],
    maxlength: 30,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Brand", BrandSchema);
