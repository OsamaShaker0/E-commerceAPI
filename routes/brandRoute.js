const express = require("express");
const router = express.Router();
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/brands`);
const { protect, authorize } = require("../middlewares/protect");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  addImage,
} = require("../controllers/brandController");
router.route("/:id/image").put(upload.single("image"), addImage);

router.route("/").get(getBrands).post(protect, authorize("admin"), createBrand);
router
  .route("/:id")
  .get(getBrand)
  .put(protect , authorize('admin',"user") ,updateBrand)
  .delete(protect , authorize('admin',"user"),deleteBrand);

module.exports = router;
