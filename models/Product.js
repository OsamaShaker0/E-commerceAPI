const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter product name"],
      minlingth: [3, "Too short product name"],
      maxlength: [100, "Too long product name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      minlingth: [20, "Too short product description"],
      required: [true, "Missing product description"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "You must provide quantity number above than 0 "],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "You must add product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    coverImage: {
      type: String,
      required:true
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must belong to category"],
    },
    subCategories: [
      {
        type: [mongoose.Schema.ObjectId],
        ref: "SubCategory",
      },
    ],
    Brand: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
    averageRating: {
      type: Number,
    },

    numberOfResidents: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

ProductSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" });
  next()
});

module.exports = mongoose.model("Product", ProductSchema);
