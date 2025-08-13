const express = require("express");
const router = express.Router();
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto("./uploads/user");

const { signup, login, fortgetPassword,verifyPassResetCode, resetPassword } = require("../controllers/authController");
 /**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication and user access management
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
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
 *         description: User signed up successfully
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in and token returned
 */

/**
 * @swagger
 * /auth/forgetpassword:
 *   post:
 *     summary: Send reset code to email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset code sent
 */

/**
 * @swagger
 * /auth/verifyresetcode:
 *   post:
 *     summary: Verify reset code sent to user's email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetCode
 *             properties:
 *               resetCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset code verified
 */

/**
 * @swagger
 * /auth/resetpassword:
 *   post:
 *     summary: Reset user's password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */

router.route("/signup").post(upload.single("image"), signup);
router.route("/login").post(login);
router.route('/forgetpassword').post(fortgetPassword)
router.route('/verifyresetcode').post(verifyPassResetCode)
router.route('/resetpassword').put(resetPassword)
module.exports = router;
