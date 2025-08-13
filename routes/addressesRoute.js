const express = require("express");
const router = express.Router();

const {
  getAddresses,
  createAddress,
  deleteAddress
} = require("../controllers/addressController");
const { protect } = require("../middlewares/protect");
/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Manage user shipping addresses
 */

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Get all addresses for the logged-in user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   city:
 *                     type: string
 *                   street:
 *                     type: string
 *                   zip:
 *                     type: string
 */

/**
 * @swagger
 * /address:
 *   post:
 *     summary: Add a new address for the logged-in user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - street
 *             properties:
 *               city:
 *                 type: string
 *               street:
 *                 type: string
 *               zip:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address created
 */

/**
 * @swagger
 * /address/{id}:
 *   delete:
 *     summary: Delete a specific address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Address ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted
 *       404:
 *         description: Address not found
 */

router.route("/").get(protect, getAddresses).post(protect, createAddress);
router.route("/:id").delete(protect, deleteAddress);
module.exports = router;
