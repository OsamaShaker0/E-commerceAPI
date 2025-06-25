const mongoose = require("mongoose");
const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name is too short "],
      maxlength: [30, "Category name is too long "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Subcategory must have parent Category"],
      ref: "Category",
    },
    image: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("SubCategory", SubCategorySchema);
