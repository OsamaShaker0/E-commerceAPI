const Brand = require("../models/Brand");
const slugify = require("slugify");
const CustomError = require("../utils/CustomError");
const asyncHandler = require("../middlewares/asyncHandler");
const APIFeatures = require("../utils/APIFeature");

// @desc    Get brands
// @route   GET /api/v1/brands
// @access  public
exports.getBrands = asyncHandler(async (req, res) => {
  const features = new APIFeatures(req, Brand)
    .buildFilter()
    .sort()
    .limitFields();
  await features.paginate();

  const [query, pagination] = features.getQuery();
  const brands = await query;

  return res.status(200).json({
    success: true,
    count: brands.length,
    pagination,
    data: brands,
  });
});

// @desc    Get brand
// @route   GET /api/v1/brands/:id
// @access  public
exports.getBrand = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let brand = await Brand.findOne({ _id: id });
  if (!brand) {
    throw new CustomError(`There are no brand with id ${id}`, 404);
  }
  return res.status(200).json({ brand });
});

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
