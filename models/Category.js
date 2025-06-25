const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      minlength: [3, "Category name is too short "],
      maxlength: [50, "Category name is too long "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    subCategories: {
      type: Array,
    },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
