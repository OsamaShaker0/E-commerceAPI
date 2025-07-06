const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const storage = addPhoto(`./uploads/subCategories`);
const upload = multer({ storage });
const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
 addImage
} = require("../controllers/subCategoryController");

router.route("/").get(getSubCategories).post(createSubCategory);
router.route('/:id/image').put( upload.single('image'),addImage);

router
  .route("/:id")
  .get(getSubCategory)
  .put(updateSubCategory)
  .delete(deleteSubCategory);

module.exports = router;
