const express = require("express");
const router = express.Router();
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

router.route("/").get(getBrands).post(createBrand);
router.route("/:id").get(getBrand).put(updateBrand).delete(deleteBrand);

module.exports = router;
