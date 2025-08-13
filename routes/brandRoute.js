const express = require("express");
const router = express.Router();
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/brands`);
const { protect, authorize } = require("../middlewares/protect");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  addImage,
} = require("../controllers/brandController");
/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management endpoints
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: List of brands
 */

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Get a single brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Brand ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand found
 *       404:
 *         description: Brand not found
 */

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Brand created successfully
 */

/**
 * @swagger
 * /brands/{id}:
 *   put:
 *     summary: Update an existing brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Brand ID
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       404:
 *         description: Brand not found
 */

/**
 * @swagger
 * /brands/{id}/image:
 *   post:
 *     summary: Upload an image for a brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Brand image file
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid image
 */
router.route("/:id/image").put(upload.single("image"), addImage);

router.route("/").get(getBrands).post(protect, authorize("admin"), createBrand);
router
  .route("/:id")
  .get(getBrand)
  .put(protect , authorize('admin',"user") ,updateBrand)
  .delete(protect , authorize('admin',"user"),deleteBrand);

module.exports = router;
