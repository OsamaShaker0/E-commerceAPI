const express = require("express");
const router = express.Router();

const {
  addProductToCart,
  getLoggedUserCart,
  deleteSpecificProduct,
  deleteCartItems,
  updateItemQuantity,
  applyCoupon,
} = require("../controllers/cartController");

const { protect, authorize, checkSame } = require("../middlewares/protect");
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get logged-in user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart data
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to cart
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product added to cart
 */

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Delete a specific product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart item ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 */

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Delete all products from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update quantity of a specific cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart item ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item quantity updated
 */

/**
 * @swagger
 * /cart/applycoupon:
 *   put:
 *     summary: Apply a coupon code to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - couponCode
 *             properties:
 *               couponCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *       400:
 *         description: Invalid coupon
 */

router.route("/applycoupon").put(protect, authorize("user"), applyCoupon);
router
  .route("/:id")
  .delete(protect, authorize("user"), deleteSpecificProduct)
  .put(protect, authorize("user"), updateItemQuantity);

router
  .route("/")
  .get(protect, authorize("user"), getLoggedUserCart)
  .post(protect, authorize("user"), addProductToCart)
  .delete(protect, authorize("user"), deleteCartItems);
module.exports = router;
