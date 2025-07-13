const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/subCategories`);
const { protect, authorize } = require("../middlewares/protect");
const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  addImage,
} = require("../controllers/subCategoryController");

router
  .route("/:id/image")
  .put(protect, authorize("admin"), upload.single("image"), addImage);

router
  .route("/:id")
  .get(getSubCategory)
  .put(protect, authorize("admin"), updateSubCategory)
  .delete(protect, authorize("admin"), deleteSubCategory);
router
  .route("/")
  .get(getSubCategories)
  .post(protect, authorize("admin"), createSubCategory);
module.exports = router;
