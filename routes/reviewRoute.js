const express = require("express");
const router = express.Router();
const {
  protect,
  authorize,
  checkSameUserReview,
} = require("../middlewares/protect");
const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getReviewForProduct,
} = require("../controllers/reviewController");

router.route("/:productId/product").get(getReviewForProduct);
router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user"), checkSameUserReview, updateReview)
  .delete(
    protect,
    authorize("admin", "user"),
    checkSameUserReview,
    deleteReview
  );
router
  .route("/")
  .get(getReviews)
  .post(protect, authorize("user"), createReview);

module.exports = router;
