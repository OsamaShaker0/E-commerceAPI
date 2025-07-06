const express = require("express");
const router = express.Router();
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/brands`);

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  addImage
} = require("../controllers/brandController");
router.route('/:id/image').put( upload.single('image'),addImage);

router.route("/").get(getBrands).post(createBrand);
router.route("/:id").get(getBrand).put(updateBrand).delete(deleteBrand);

module.exports = router;
