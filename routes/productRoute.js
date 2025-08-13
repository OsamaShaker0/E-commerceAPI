const express = require("express");
const router = express.Router();
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/products`);
const { protect, authorize } = require("../middlewares/protect");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addSinglePhoto,
  addMultiplePhotos,
} = require("../controllers/productController");
const Review = require("../models/Review");
router
  .route("/:id/images")
  .put(
    protect,
    authorize("admin"),
    upload.array("images", 5),
    addMultiplePhotos
  );
  /**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Product ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               brandId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Product ID
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               brandId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Product ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/{id}/coverimage:
 *   post:
 *     summary: Update product cover image
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *       - in: formData
 *         name: coverImage
 *         type: file
 *         required: true
 *         description: Product cover image file
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 */

/**
 * @swagger
 * /products/{id}/images:
 *   post:
 *     summary: Update product images
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *       - in: formData
 *         name: images
 *         type: array
 *         items:
 *           type: file
 *         required: true
 *         description: Array of product image files
 *     responses:
 *       200:
 *         description: Product images updated successfully
 */


  // nasted route from product to review 
const reviewRoute = require("./reviewRoute");
router.use("productId/reviews", reviewRoute);

router
  .route("/:id/coverimage")
  .put(protect, authorize("admin"), upload.single("image"), addSinglePhoto);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);
router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin"), createProduct);
module.exports = router;
