const SubCategory = require("../models/SubCategory");
const slugify = require("slugify");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/CustomError");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { getAll, getOne } = require("./refactorController");

// @route     GET /api/v1/categories/categoryId/subcategories
// @desc      get subcategories
// @route     GET /api/v1/subcategories
// @access    public

exports.getSubCategories = getAll(SubCategory, "subCategories");

// @desc      get subcategory
// @route     GET /api/v1/subcategories/:id
// @access    public
exports.getSubCategory = getOne(SubCategory, "subCategory");

// @desc      craete subcategory
// @route     POST /api/v1/subcategories
// @access    private

exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, categoryId } = req.body;

  if (!name || !categoryId) {
    throw new CustomError("You must enter name and categoryId", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let parent = await Category.findById(categoryId).session(session);
    if (!parent) {
      throw new CustomError(`Can Not Find Category With id ${categoryId}`, 404);
    }

    const subcategory = await SubCategory.create(
      [
        {
          name,
          slug: slugify(name),
          category: categoryId,
        },
      ],
      { session }
    );

    parent.subCategories.push(subcategory[0]._id);
    await parent.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ subcategory: subcategory[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

// @desc      Update subcategory
// @route     PUT /api/v1/subcategories/:id
// @access    private
exports.updateSubCategory = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let { name } = req.body;
  if (!name) {
    throw new CustomError("Missing name for update sub category");
  }
  let updatedSubCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!updatedSubCategory) {
    throw new CustomError(`can't find sub category with id of ${id}`, 404);
  }
  res.status(200).json({ updatedSubCategory });
});
// @desc      delete subcategory
// @route     Delete /api/v1/subcategories/:id
// @access    private
exports.deleteSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subcategory = await SubCategory.findOneAndDelete(
      { _id: id },
      { session }
    );

    if (!subcategory) {
      throw new CustomError(`Cannot find SubCategory with id ${id}`, 404);
    }

    await Category.updateOne(
      { _id: subcategory.category },
      { $pull: { subCategories: subcategory._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Subcategory deleted successfully",
      deletedSubCategory: subcategory,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
