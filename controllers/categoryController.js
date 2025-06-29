const Category = require("../models/Category");
const slugify = require("slugify");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");
const subCategory = require("../models/SubCategory");
const APIFeatures = require("../utils/APIFeature");
// @desc    Get categories
// @route   GET /api/v1/categories
// @access  public
exports.getCategories = asyncHandler(async (req, res) => {
  const features = new APIFeatures(req, Category)
    .buildFilter()
    .sort()
    .limitFields();
  await features.paginate();

  const [query, pagination] = features.getQuery();
  const categories = await query;

  return res.status(200).json({
    success: true,
    count: categories.length,
    pagination,
    data: categories,
  });
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let deletedCategory = await Category.findOneAndDelete(
      { _id: id },
      { session }
    );
    if (!deletedCategory) {
      throw new CustomError(`can't find category with id of ${id}`, 404);
    }

    await subCategory.deleteMany(
      { category: deletedCategory._id },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ deletedCategory });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});
