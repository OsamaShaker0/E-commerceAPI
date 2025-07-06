const Category = require("../models/Category");
const slugify = require("slugify");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");
const subCategory = require("../models/SubCategory");

const { getAll, getOne, addSingleImage } = require("./refactorController");
// @desc    Get categories
// @route   GET /api/v1/categories
// @access  public
exports.getCategories = getAll(Category, "categories");
// @desc    Get one category
// @route   GET /api/v1/categories/:id
// @access  public
exports.getCategory = getOne(Category, "category");

// @desc    Get sub categories for  category
// @route   GET /api/v1/categories/:id/subcategory
// @access  public
exports.getSubCategoriesForCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await Category.findOne({ _id: id });
  if (!category) {
    throw new CustomError(`can't find category with id of ${id}`, 404);
  }
  let subCategories = category.subCategories
  if(subCategories.length == 0) {
    return res.status(200).json({msg:`this category has no sub categories`})
  }
  res.status(200).json({subCategories:{count:subCategories.length , mainCategoryName:category.name , mainCategoryId: category._id,subCategories}})
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
// @desc    add image
// @route   POST /api/v1/categories/:id/image
// @access  private
exports.addImage = addSingleImage(Category, "ategory");
