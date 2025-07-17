const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/protect");
const {
  getUserWishlist,
  addProductToWishlist,
  deleteProductFromWishlist,
} = require("../controllers/wishlistController");
router
  .route("/")
  .get(protect, getUserWishlist)
  .post(protect, addProductToWishlist);

  router.delete('/:id' , protect , deleteProductFromWishlist)
module.exports = router;
