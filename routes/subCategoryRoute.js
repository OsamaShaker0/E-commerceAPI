const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto(`./uploads/subCategories`);
const { protect, authorize } = require("../middlewares/protect");
const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  addImage,
} = require("../controllers/subCategoryController");
/**
 * @swagger
 * tags:
 *   name: Subcategory
 *   description: Manage product subcategories
 */

/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Retrieve all subcategories
 *     tags: [Subcategory]
 *     responses:
 *       200:
 *         description: List of all subcategories
 */

/**
 * @swagger
 * /subcategories/{id}:
 *   get:
 *     summary: Retrieve a specific subcategory by ID
 *     tags: [Subcategory]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Subcategory ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory details
 *       404:
 *         description: Subcategory not found
 */

/**
 * @swagger
 * /subcategories:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [Subcategory]
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
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 */

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Update an existing subcategory
 *     tags: [Subcategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Subcategory ID
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
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *       404:
 *         description: Subcategory not found
 */

/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory by ID
 *     tags: [Subcategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Subcategory ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       404:
 *         description: Subcategory not found
 */

router
  .route("/:id/image")
  .put(protect, authorize("admin"), upload.single("image"), addImage);

router
  .route("/:id")
  .get(getSubCategory)
  .put(protect, authorize("admin"), updateSubCategory)
  .delete(protect, authorize("admin"), deleteSubCategory);
router
  .route("/")
  .get(getSubCategories)
  .post(protect, authorize("admin"), createSubCategory);
module.exports = router;
