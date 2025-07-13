const express = require("express");
const router = express.Router();
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/categories`);
const { protect, authorize } = require("../middlewares/protect");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  addImage,
  getSubCategoriesForCategory,
} = require("../controllers/categoryController");
router.route("/:id/subcategories").get(getSubCategoriesForCategory);
router
  .route("/:id/image")
  .put(protect, authorize("admin"), upload.single("image"), addImage);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);
router
  .route("/")
  .post(protect, authorize("admin"), createCategory)
  .get(getCategories);
module.exports = router;
