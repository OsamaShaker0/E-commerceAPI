const express = require("express");
const router = express.Router();

const { getCoupons, createCoupon,deleteCoupon } = require("../controllers/couponController");

const { protect, authorize } = require("../middlewares/protect");
/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management
 */

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coupons
 */

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *               - expirationDate
 *             properties:
 *               code:
 *                 type: string
 *               discount:
 *                 type: number
 *                 description: Discount percentage or amount
 *               expirationDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Coupon created successfully
 */

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Delete a coupon by ID
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Coupon ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       404:
 *         description: Coupon not found
 */
router.route("/:id").delete(protect, authorize("admin"), deleteCoupon);
router
  .route("/")
  .get(protect, authorize("admin"), getCoupons)
  .post(protect, authorize("admin"), createCoupon);
module.exports = router;
