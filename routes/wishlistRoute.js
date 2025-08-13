const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/protect");
const {
  getUserWishlist,
  addProductToWishlist,
  deleteProductFromWishlist,
} = require("../controllers/wishlistController");
/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: User wishlist management
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get the logged-in user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist items
 */

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product added to wishlist successfully
 */

/**
 * @swagger
 * /wishlist:
 *   delete:
 *     summary: Delete a product from the wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 */
router
  .route("/")
  .get(protect, getUserWishlist)
  .post(protect, addProductToWishlist);

  router.delete('/:id' , protect , deleteProductFromWishlist)
module.exports = router;
