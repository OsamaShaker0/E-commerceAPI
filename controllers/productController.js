const Product = require("../models/Product");
const slugify = require("slugify");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const { getAll, getOne } = require("./refactorController");


// @desc    Get products
// @route   GET /api/v1/products
// @access  public
exports.getProducts = getAll(Product, "products");

// @desc    Get one product
// @route   GET /api/v1/products/:id
// @access  public
exports.getProduct = getOne(Product, "product");
// @desc    Create product
// @route   POST /api/v1/products
// @access  private
exports.createProduct = asyncHandler(async (req, res) => {
  //   const title = req.body?.title;
  //   const description = req.body?.description;
  //   const quantity = req.body?.quantity;
  //   const price = req.body?.price;
  //   const category = req.body?.category;
  if (!req.body) {
    throw new CustomError(`Missing inputs`, 400);
  }
  const { title, description, quantity, price, category } = req.body;
  if (quantity <= 0 || !quantity) {
    throw new CustomError(`quantity Must be above than 0 `, 400);
  }
  if (price <= 0 || !price) {
    throw new CustomError(`price Must be above than 0 `, 400);
  }

  if (!title || !description || !category) {
    throw new CustomError(`Missing inputs`, 400);
  }
  // chack for category
  let findCategory = await Category.findOne({ _id: category });
  if (!findCategory) {
    throw new CustomError("You try to add product to absent category");
  }

  // check for sub category list
  if (req.body.subCategories) {
    let subCategoriesIds = [...new Set(req.body.subCategories)];
    let existingSubcategories = await SubCategory.find({
      _id: { $in: subCategoriesIds },
    });

    const existingIds = existingSubcategories.map((sub) => sub._id.toString());
    // check that all sub categories is in db
    if (existingIds.length != subCategoriesIds.length) {
      throw new CustomError("Can not find all added sub categories", 400);
    }
    // check that all sub categories belong to one main category
    existingSubcategories.map((sub) => {
      if (sub.category != category) {
        throw new CustomError(
          `sub category with id ${sub._id} did not belong to category with id ${category}`
        );
      }
    });
  }

  req.body.slug = slugify(title);

  let product = await Product.create(req.body);
  return res.status(201).json({ product });
});

// @desc    update product
// @route   PUT /api/v1/products:/id
// @access  private
exports.updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!req.body) {
    throw new CustomError(`Missing inputs`, 400);
  }
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  let updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!updatedProduct) {
    throw new CustomError(`can't find product with id of ${id}`, 404);
  }

  return res.status(200).json({ updatedProduct });
});
// @desc    update products
// @route   Delete /api/v1/products:/id
// @access  private

exports.deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  let deletedProducts = await Product.findOneAndDelete({ _id: id });
  if (!deletedProducts) {
    throw new CustomError(`can't find product with id of ${id}`, 404);
  }

  return res.status(200).json({ deletedProducts });
});
