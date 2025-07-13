const express = require("express");
const router = express.Router();
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto("./uploads/user");

const { signup, login, fortgetPassword,verifyPassResetCode, resetPassword } = require("../controllers/authController");

router.route("/signup").post(upload.single("image"), signup);
router.route("/login").post(login);
router.route('/forgetpassword').post(fortgetPassword)
router.route('/verifyresetcode').post(verifyPassResetCode)
router.route('/resetpassword').put(resetPassword)
module.exports = router;
