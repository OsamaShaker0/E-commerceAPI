const Brand = require("../models/Brand");
const {getAll , getOne} = require('./refactorController')
const slugify = require("slugify");
const CustomError = require("../utils/CustomError");
const asyncHandler = require("../middlewares/asyncHandler");

// @desc    Get brands
// @route   GET /api/v1/brands
// @access  public
exports.getBrands = getAll(Brand , 'brands')

// @desc    Get brand
// @route   GET /api/v1/brands/:id
// @access  public
exports.getBrand = getOne(Brand , 'brand')
// @desc    create brand
// @route   POST /api/v1/brands
// @access  private
exports.createBrand = asyncHandler(async (req, res) => {
  if (!req.body?.name) {
    throw new CustomError(`You must enter brand name `, 400);
  }
  let createdBrand = await Brand.create(req.body);

  return res.status(201).json({ createdBrand });
});
// @desc    update brand
// @route   PUT /api/v1/brands/:id
// @access  private
exports.updateBrand = asyncHandler(async (req, res) => {
  let { id } = req.params;
  if (!req.body?.name) {
    throw new CustomError(`You must enter brand name to update `, 400);
  }
  let updatedBrand = await Brand.findOneAndUpdate(
    { _id: id },
    { name: req.body.name },
    { new: true }
  );
  if (!updatedBrand) {
    throw new CustomError(`There are no brand with id ${id}`, 404);
  }
  return res.status(200).json({ updatedBrand });
});
// @desc    delete brand
// @route   Delete /api/v1/brands/:id
// @access  private
exports.deleteBrand = asyncHandler(async (req, res) => {
  let { id } = req.params;

  let deletedBrand = await Brand.findOneAndDelete({ _id: id });
  return res.status(200).json({ deletedBrand });
});
