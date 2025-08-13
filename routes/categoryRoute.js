const express = require("express");
const router = express.Router();
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/categories`);
const { protect, authorize } = require("../middlewares/protect");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  addImage,
  getSubCategoriesForCategory,
} = require("../controllers/categoryController");
/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Product categories management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get one category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories/{id}/subcategory:
 *   get:
 *     summary: Get subcategories for a category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subcategories
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
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
 *         description: Category created successfully
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
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
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories/{id}/image:
 *   post:
 *     summary: Add an image to a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Image file
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid image file
 */

router.route("/:id/subcategories").get(getSubCategoriesForCategory);
router
  .route("/:id/image")
  .put(protect, authorize("admin"), upload.single("image"), addImage);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);
router
  .route("/")
  .post(protect, authorize("admin"), createCategory)
  .get(getCategories);
module.exports = router;
