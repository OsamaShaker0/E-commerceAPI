const express = require("express");
const router = express.Router();
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const storage = addPhoto(`./uploads/categories`);
const upload = multer({ storage });
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
router.route("/:id/image").put(upload.single("image"), addImage);
router.route("/").post(createCategory).get(getCategories);
router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
