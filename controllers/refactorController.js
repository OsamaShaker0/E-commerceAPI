const asyncHandler = require("../middlewares/asyncHandler");
const APIFeatures = require("../utils/APIFeature");
const CustomError = require("../utils/CustomError");

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    const features = new APIFeatures(req, Model)
      .buildFilter()
      .sort()
      .limitFields();
    await features.paginate();

    const [query, pagination] = features.getQuery();
    const modelName = await query;

    return res.status(200).json({
      success: true,
      count: modelName.length,
      pagination,
      data: modelName,
    });
  });
exports.getOne = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let id = req.params.id;
    let modelName = await Model.findOne({ _id: id });
    if (!modelName) {
      throw new CustomError(`can't find ${modelName} with id of ${id}`, 404);
    }
    return res.status(200).json(modelName);
  });

  