const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
 
} = require("../controllers/subCategoryController");

router.route("/").get(getSubCategories).post(createSubCategory);

router
  .route("/:id")
  .get(getSubCategory)
  .put(updateSubCategory)
  .delete(deleteSubCategory);

module.exports = router;
