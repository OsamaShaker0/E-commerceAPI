const express = require("express");
const router = express.Router();
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/products`);
const { protect, authorize } = require("../middlewares/protect");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addSinglePhoto,
  addMultiplePhotos,
} = require("../controllers/productController");
router
  .route("/:id/images")
  .put(
    protect,
    authorize("admin"),
    upload.array("images", 5),
    addMultiplePhotos
  );

router
  .route("/:id/coverimage")
  .put(protect, authorize("admin"), upload.single("image"), addSinglePhoto);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);
router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin"), createProduct);
module.exports = router;
