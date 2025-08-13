const express = require("express");
const router = express.Router();
const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  updateOrderToPaid,
  updateOrderToDeliverd,
  checkoutSession
} = require("../controllers/orderController");
const { protect, authorize } = require("../middlewares/protect");
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order processing and management
 */

/**
 * @swagger
 * /orders/{cartId}:
 *   post:
 *     summary: Create a cash order based on a cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cartId
 *         in: path
 *         description: Cart ID to create order from
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders of logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Order ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update order paid status or delivery status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Order ID
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
 *               paid:
 *                 type: boolean
 *                 description: Paid status update
 *               delivered:
 *                 type: boolean
 *                 description: Delivery status update
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */
router.get("/checkout-session/:cartId", protect, authorize("user") , checkoutSession);
router.route("/:cartId").post(protect, authorize("user"), createCashOrder);
router.put("/:id/pay", updateOrderToPaid);
router.put("/:id/deliver", updateOrderToDeliverd);
router.route("/:id").get(protect, authorize("user", "admin"), getSpecificOrder);

router.route("/").get(protect, authorize("user", "admin"), getAllOrders);
module.exports = router;
