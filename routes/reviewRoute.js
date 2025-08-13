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
/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews management
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Review ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Review ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Review ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /reviews/{productId}:
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - name: productId
 *         in: path
 *         description: Product ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the product
 */
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
