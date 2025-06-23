const Category = require("../models/Category");
const slugify = require("slugify");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");

// @desc    Get categories
// @route   GET /api/v1/categories
// @access  public
exports.getCategories = asyncHandler(async (req, res) => {
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit || 5;
  let skip = (page - 1) * limit;

  let categories = await Category.find().sort().limit(limit).skip(skip);
  res.status(200).json({ categories, numOfDoc: categories.length });
});
// @desc    Get one category
// @route   GET /api/v1/categories/:id
// @access  public
exports.getCategory = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let category = await Category.findOne({ _id: id });
  if (!category) {
    throw new CustomError(`can't find category with id of ${id}`, 404);
  }
  return res.status(200).json(category);
});
// @desc    Create category
// @route   POST /api/v1/categories
// @access  private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body?.name;
  if (!req.body?.name) {
    throw new CustomError(`You must enter category name`, 400);
  }
  let category = await Category.create({ name, slug: slugify(name) });
  return res.status(201).json({ category });
});

// @desc    update category
// @route   PUT /api/v1/categories:/id
// @access  private
exports.updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const name = req.body?.name;
  if (!req.body?.name) {
    throw new CustomError(`You must enter category name`, 400);
  }
  let category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    throw new CustomError(`can't find category with id of ${id}`, 404);
  }

  return res.status(200).json({ category });
});
// @desc    update category
// @route   Delete /api/v1/categories:/id
// @access  private

exports.deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let deletedCategory = await Category.findOneAndDelete({ _id: id });
  if (!deletedCategory) {
    throw new CustomError(`can't find category with id of ${id}`, 404);
  }
  res.status(200).json({ deletedCategory });
});
