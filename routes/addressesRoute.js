const express = require("express");
const router = express.Router();

const {
  getAddresses,
  createAddress,
  deleteAddress
} = require("../controllers/addressControler");
const { protect } = require("../middlewares/protect");
router.route("/").get(protect, getAddresses).post(protect, createAddress);
router.route("/:id").delete(protect, deleteAddress);
module.exports = router;
