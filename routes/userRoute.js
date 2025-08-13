const express = require("express");
const router = express.Router();
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto("./uploads/user");
const { protect, authorize, checkSame } = require("../middlewares/protect");
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserPhoto,
  updateUserPassword,
  getMe,
} = require("../controllers/userController");/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
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
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{id}/updatepassword:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid old password
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{id}/profilepicture:
 *   put:
 *     summary: Update user profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: profilePicture
 *         in: formData
 *         description: Profile picture file
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 */

/**
 * @swagger
 * /users/getme:
 *   get:
 *     summary: Get current logged-in user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 */
router.route("/getme").get(protect, authorize("admin", "user"), getMe);

router
  .route("/:id/profilepicture")
  .put(
    protect,
    authorize("admin", "user"),
    checkSame,
    upload.single("image"),
    updateUserPhoto
  );

router
  .route("/:id/updatepassword")
  .put(protect, authorize("admin", "user"), updateUserPassword);

router
  .route("/:id")
  .get(getSingleUser)
  .put(protect, authorize("admin", "user"), checkSame, updateUser)
  .delete(protect, authorize("admin", "user"), checkSame, deleteUser);

router
  .route("/")
  .get(getAllUsers)
  .post(protect, authorize("admin"), upload.single("image"), createUser);
module.exports = router;
