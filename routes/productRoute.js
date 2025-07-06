const express = require("express");
const router = express.Router();
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/products`);


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
  .put(upload.array("images", 5), addMultiplePhotos);

router.route("/:id/coverimage").put( upload.single('image'),addSinglePhoto);
router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);
module.exports = router;
